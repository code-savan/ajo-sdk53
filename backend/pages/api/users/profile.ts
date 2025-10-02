import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ApiResponse, User } from '@/types/database';
import stripe from '@/lib/stripe';

const DEFAULT_AVATAR = 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<User>>) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token) as any;

    switch (req.method) {
      case 'GET': {
        let { data: user, error: getUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', payload.userId)
          .single();

        if (getUserError || !user) {
          const { data: created, error: createErr } = await supabase
            .from('users')
            .insert({
              id: payload.userId,
              email: payload.email || '',
              is_verified: false,
              profile_image_url: DEFAULT_AVATAR
            })
            .select('*')
            .single();

          if (createErr) {
            return res.status(400).json({ success: false, error: createErr.message });
          }
          user = created as any;
        }

        // Ensure profile_image_url is set
        if (!(user as any).profile_image_url) {
          const { data: upImg } = await supabase
            .from('users')
            .update({ profile_image_url: DEFAULT_AVATAR })
            .eq('id', payload.userId)
            .select('*')
            .single();
          if (upImg) user = upImg as any;
        }

        // Ensure stripe_customer_id exists (idempotent)
        if (!(user as any).stripe_customer_id) {
          const customer = await stripe.customers.create({ metadata: { user_id: payload.userId, email: (user as any).email || '' } });
          const { data: updated, error: upErr } = await supabase
            .from('users')
            .update({ stripe_customer_id: customer.id })
            .eq('id', payload.userId)
            .select('*')
            .single();
          if (!upErr && updated) {
            user = updated as any;
          }
        }

        // Enforce is_verified=false unless identity says verified
        const identityStatus = (user as any).stripe_identity_status;
        if (identityStatus !== 'verified' && (user as any).is_verified === true) {
          const { data: upVer } = await supabase
            .from('users')
            .update({ is_verified: false })
            .eq('id', payload.userId)
            .select('*')
            .single();
          if (upVer) user = upVer as any;
        }

        return res.json({ success: true, data: user as any });
      }

      case 'PUT': {
        const { full_name, phone, profile_image_url } = req.body;
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            full_name,
            phone,
            profile_image_url: profile_image_url || DEFAULT_AVATAR,
            updated_at: new Date().toISOString()
          })
          .eq('id', payload.userId)
          .select()
          .single();

        if (updateError) {
          return res.status(400).json({ success: false, error: updateError.message });
        }

        return res.json({ success: true, data: updatedUser as any });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export default handler;
