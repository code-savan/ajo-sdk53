import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, User } from '@/types/database';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<User>>) => {
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
        // Get user profile
        const { data: user, error: getUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', payload.userId)
          .single();

        if (getUserError) {
          return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.json({ success: true, data: user });

      case 'PUT':
        // Update user profile
        const { full_name, phone, profile_image_url } = req.body;
        
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            full_name,
            phone,
            profile_image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', payload.userId)
          .select()
          .single();

        if (updateError) {
          return res.status(400).json({ success: false, error: updateError.message });
        }

        return res.json({ success: true, data: updatedUser });

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
