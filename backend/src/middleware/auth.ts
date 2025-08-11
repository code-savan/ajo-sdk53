import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '@/types/database';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined. Please check your environment variables.');
}

// Verify JWT
export async function verifyToken(req: NextApiRequest): Promise<string | object> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

// Authenticate request middleware
export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>,
  next: () => void
) => {
  try {
    const decoded = await verifyToken(req);
    req.user = decoded as any;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized', error: err.message });
  }
};
