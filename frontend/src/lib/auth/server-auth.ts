import { cookies } from 'next/headers';
import { URLBASE } from '@/src/scripts/scripts';

export async function verifyToken(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return false;

  try {
    const response = await fetch(URLBASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            verification {
              email
            }
          }
        `,
      }),
      cache: 'no-store',
    });

    const result = await response.json();
    return !!result.data?.verification?.email;
  } catch {
    return false;
  }
}
