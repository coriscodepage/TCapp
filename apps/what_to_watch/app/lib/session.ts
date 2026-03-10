import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { AppError, SessionPayload } from '@/app/utils/datatypes'
 import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
 
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}
 
export async function decrypt(session: string | undefined = ''): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    throw new AppError("Could not verify session", "SESSION_INVALID");
  }
}
 
export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    expiresAt,
    id: userId,
    email: email
  });
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);
 
  if (!session || !payload) {
    return null;
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
 
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session');
}
