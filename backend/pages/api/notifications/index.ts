import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, Notification, PaginatedResponse } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<PaginatedResponse<Notification> | Notification>>) => {
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
        // Get user notifications
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;
        const unreadOnly = req.query.unread_only === 'true';

        let query = supabase
          .from('notifications')
          .select('*', { count: 'exact' })
          .eq('user_id', payload.userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (unreadOnly) {
          query = query.eq('read', false);
        }

        const { data: notifications, error, count } = await query;

        if (error) {
          return res.status(400).json({ success: false, error: error.message });
        }

        const totalPages = Math.ceil((count || 0) / limit);

        const response: PaginatedResponse<Notification> = {
          data: notifications || [],
          total: count || 0,
          page,
          limit,
          has_next: page < totalPages,
          has_prev: page > 1
        };

        return res.json({ success: true, data: response });

      case 'POST':
        // Create notification (admin only for now)
        const { user_id, title, message, type, data } = req.body;

        if (!user_id || !title || !message || !type) {
          return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const { data: newNotification, error: createError } = await supabase
          .from('notifications')
          .insert({
            user_id,
            title,
            message,
            type,
            data,
            read: false
          })
          .select()
          .single();

        if (createError) {
          return res.status(400).json({ success: false, error: createError.message });
        }

        return res.status(201).json({ success: true, data: newNotification });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
