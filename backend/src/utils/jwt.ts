import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export function generateTokens(payload: JWTPayload) {
  const accessToken = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutes in seconds
  };
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
