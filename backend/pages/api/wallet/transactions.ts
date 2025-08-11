import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, Transaction, PaginatedResponse } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<PaginatedResponse<Transaction>>>) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Get transaction type filter if provided
    const type = req.query.type as string;
    const groupId = req.query.group_id as string;

    let query = supabase
      .from('transactions')
      .select('*, groups:group_id(name)', { count: 'exact' })
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }

    if (groupId) {
      query = query.eq('group_id', groupId);
    }

    const { data: transactions, error, count } = await query;

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    const response: PaginatedResponse<Transaction> = {
      data: transactions || [],
      total: count || 0,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1
    };

    return res.json({ success: true, data: response });
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
