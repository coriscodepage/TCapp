import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/app/utils/users';
import { getUsersMovies } from '@/app/utils/listDb';

export const verifySession = cache(async (): Promise<{ isAuth: boolean; userId: string }> => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.id || !session?.exp || new Date(session.exp * 1000) < new Date()) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.id as string };
});

export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession();

  const user = await getUser(userId);
  return user;
});

export const getUserMovies = cache(async () => {
  const user = await getCurrentUser();
  return await getUsersMovies(user.uuid);
});
