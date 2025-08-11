import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    const { id: notificationId } = req.query;

    if (req.method !== 'PUT') {
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Mark notification as read
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', payload.userId) // Ensure user owns the notification
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
