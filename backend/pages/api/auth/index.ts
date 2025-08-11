import type { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword, comparePassword } from '@/utils/password';
import { generateTokens } from '@/utils/jwt';
import { supabase } from '@/lib/supabase';
import { ApiResponse, RegisterRequest, LoginRequest } from '@/types/database';

// Registration handler
const register = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const { email, full_name, pin } = req.body as RegisterRequest;

  if (!email || !full_name || !pin) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const pinHash = await hashPassword(pin);

  const { error } = await supabase.auth.signUp({
    email,
    password: pinHash,
    options: { data: { full_name } },
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.status(201).json({ success: true, message: 'User registered successfully' });
};

// Login handler
const login = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const { email, pin } = req.body as LoginRequest;

  if (!email || !pin) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pin });

  if (error || !data?.session) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  // Generate tokens
  const tokens = generateTokens({ userId: data.user.id, email: data.user.email });
  res.json({ success: true, data: { user: data.user, ...tokens } });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return req.body.email && req.body.full_name ? register(req, res) : login(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

