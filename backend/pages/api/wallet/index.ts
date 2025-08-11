import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, Wallet, FundWalletRequest, WithdrawRequest } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<Wallet>>) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    switch (req.method) {
      case 'GET':
        // Get wallet balance
        const { data: wallet, error: getWalletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', payload.userId)
          .single();

        if (getWalletError) {
          // Create wallet if it doesn't exist
          const { data: newWallet, error: createWalletError } = await supabase
            .from('wallets')
            .insert({
              user_id: payload.userId,
              balance: 0,
              pending_balance: 0
            })
            .select()
            .single();

          if (createWalletError) {
            return res.status(400).json({ success: false, error: createWalletError.message });
          }

          return res.json({ success: true, data: newWallet });
        }

        return res.json({ success: true, data: wallet });

      case 'POST':
        // Fund wallet or withdraw
        const action = req.body.action;

        if (action === 'fund') {
          return await fundWallet(req, res, payload.userId);
        } else if (action === 'withdraw') {
          return await withdrawFromWallet(req, res, payload.userId);
        } else {
          return res.status(400).json({ success: false, error: 'Invalid action' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Fund wallet function
async function fundWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { amount, payment_method_id } = req.body as FundWalletRequest;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  if (!payment_method_id) {
    return res.status(400).json({ success: false, error: 'Payment method required' });
  }

  try {
    // Here you would integrate with Stripe to process the payment
    // For now, we'll simulate a successful payment
    
    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        amount,
        status: 'pending',
        description: 'Wallet funding',
        reference_id: `fund_${Date.now()}`
      })
      .select()
      .single();

    if (transactionError) {
      return res.status(400).json({ success: false, error: transactionError.message });
    }

    // Update wallet balance (in a real app, this would happen after payment confirmation)
    const { data: updatedWallet, error: updateWalletError } = await supabase
      .from('wallets')
      .update({
        pending_balance: supabase.raw(`pending_balance + ${amount}`),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateWalletError) {
      return res.status(400).json({ success: false, error: updateWalletError.message });
    }

    return res.json({ 
      success: true, 
      data: updatedWallet,
      message: 'Wallet funding initiated'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: 'Payment processing failed' });
  }
}

// Withdraw from wallet function
async function withdrawFromWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { amount, bank_account_id } = req.body as WithdrawRequest;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  if (!bank_account_id) {
    return res.status(400).json({ success: false, error: 'Bank account required' });
  }

  // Check wallet balance
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (walletError || !wallet) {
    return res.status(404).json({ success: false, error: 'Wallet not found' });
  }

  if (wallet.balance < amount) {
    return res.status(400).json({ success: false, error: 'Insufficient balance' });
  }

  try {
    // Create withdrawal transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'withdrawal',
        amount,
        status: 'pending',
        description: 'Wallet withdrawal',
        reference_id: `withdraw_${Date.now()}`
      })
      .select()
      .single();

    if (transactionError) {
      return res.status(400).json({ success: false, error: transactionError.message });
    }

    // Update wallet balance
    const { data: updatedWallet, error: updateWalletError } = await supabase
      .from('wallets')
      .update({
        balance: supabase.raw(`balance - ${amount}`),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateWalletError) {
      return res.status(400).json({ success: false, error: updateWalletError.message });
    }

    return res.json({ 
      success: true, 
      data: updatedWallet,
      message: 'Withdrawal initiated'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: 'Withdrawal processing failed' });
  }
}

export default handler;
