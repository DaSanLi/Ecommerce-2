import { redirect } from 'next/navigation';
import { verifyToken } from '@/src/lib/auth';

export default async function Home() {
  const isValid = await verifyToken();

  if (isValid) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
}
