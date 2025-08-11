import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, Group, JoinGroupRequest } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<Group>>) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    const { id: groupId } = req.query;

    switch (req.method) {
      case 'GET':
        // Get group details with members
        const { data: group, error: getGroupError } = await supabase
          .from('groups')
          .select(`
            *,
            group_members!inner (
              *,
              users:user_id (id, full_name, email, profile_image_url)
            )
          `)
          .eq('id', groupId)
          .single();

        if (getGroupError) {
          return res.status(404).json({ success: false, error: 'Group not found' });
        }

        // Check if user is a member
        const isMember = group.group_members.some(
          (member: any) => member.user_id === payload.userId && member.status === 'active'
        );

        if (!isMember) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }

        return res.json({ success: true, data: group });

      case 'POST':
        // Join group
        const { invite_code } = req.body as JoinGroupRequest;

        // First, check if group exists and has space
        const { data: existingGroup, error: groupError } = await supabase
          .from('groups')
          .select('*, group_members(*)')
          .eq('id', groupId)
          .single();

        if (groupError) {
          return res.status(404).json({ success: false, error: 'Group not found' });
        }

        // Check if group is full
        if (existingGroup.group_members.length >= existingGroup.max_members) {
          return res.status(400).json({ success: false, error: 'Group is full' });
        }

        // Check if user is already a member
        const existingMember = existingGroup.group_members.find(
          (member: any) => member.user_id === payload.userId
        );

        if (existingMember) {
          return res.status(400).json({ success: false, error: 'Already a member of this group' });
        }

        // Add user to group
        const nextPosition = existingGroup.group_members.length + 1;
        const { error: joinError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId as string,
            user_id: payload.userId,
            position: nextPosition,
            role: 'member',
            status: 'active',
            total_contributed: 0,
            has_received_payout: false
          });

        if (joinError) {
          return res.status(400).json({ success: false, error: joinError.message });
        }

        // If group is now full, activate it
        if (nextPosition === existingGroup.max_members) {
          await supabase
            .from('groups')
            .update({ status: 'active' })
            .eq('id', groupId);
        }

        return res.json({ success: true, message: 'Successfully joined group' });

      case 'PUT':
        // Update group (admin only)
        const { data: groupToUpdate, error: getGroupToUpdateError } = await supabase
          .from('groups')
          .select('admin_id')
          .eq('id', groupId)
          .single();

        if (getGroupToUpdateError) {
          return res.status(404).json({ success: false, error: 'Group not found' });
        }

        if (groupToUpdate.admin_id !== payload.userId) {
          return res.status(403).json({ success: false, error: 'Only group admin can update group' });
        }

        const { name, description } = req.body;
        const { data: updatedGroup, error: updateError } = await supabase
          .from('groups')
          .update({
            name,
            description,
            updated_at: new Date().toISOString()
          })
          .eq('id', groupId)
          .select()
          .single();

        if (updateError) {
          return res.status(400).json({ success: false, error: updateError.message });
        }

        return res.json({ success: true, data: updatedGroup });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
