import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, Group, CreateGroupRequest } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<Group | Group[]>>) => {
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
        // Get user's groups
        const { data: userGroups, error: getGroupsError } = await supabase
          .from('group_members')
          .select(`
            *,
            groups:group_id (*)
          `)
          .eq('user_id', payload.userId)
          .eq('status', 'active');

        if (getGroupsError) {
          return res.status(400).json({ success: false, error: getGroupsError.message });
        }

        const groups = userGroups.map(member => member.groups);
        return res.json({ success: true, data: groups });

      case 'POST':
        // Create new group
        const { name, description, contribution_amount, frequency, start_date, max_members } = req.body as CreateGroupRequest;

        if (!name || !contribution_amount || !frequency || !start_date) {
          return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Create group
        const { data: newGroup, error: createGroupError } = await supabase
          .from('groups')
          .insert({
            name,
            description,
            admin_id: payload.userId,
            contribution_amount,
            frequency,
            start_date,
            max_members: max_members || 10,
            status: 'pending',
            current_round: 1,
            total_rounds: max_members || 10
          })
          .select()
          .single();

        if (createGroupError) {
          return res.status(400).json({ success: false, error: createGroupError.message });
        }

        // Add creator as first member and admin
        const { error: addMemberError } = await supabase
          .from('group_members')
          .insert({
            group_id: newGroup.id,
            user_id: payload.userId,
            position: 1,
            role: 'admin',
            status: 'active',
            total_contributed: 0,
            has_received_payout: false
          });

        if (addMemberError) {
          // If adding member fails, we should clean up the group
          await supabase.from('groups').delete().eq('id', newGroup.id);
          return res.status(400).json({ success: false, error: 'Failed to add user to group' });
        }

        // Create wallet for the group if needed
        const { error: walletError } = await supabase
          .from('wallets')
          .insert({
            user_id: payload.userId,
            balance: 0,
            pending_balance: 0
          });

        return res.status(201).json({ success: true, data: newGroup });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
