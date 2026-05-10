import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME } from '../queries/auth';

interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  gender: string;
}

interface MeData {
  me: CurrentUser;
}

export function useCurrentUser() {
  const { data, loading, error, refetch } = useQuery<MeData>(ME, {
    context: {
      credentials: 'include',
    },
    errorPolicy: 'all',
  });

  const user: CurrentUser | null = useMemo(() => {
    return data?.me ? {
      id: data.me.id,
      email: data.me.email,
      fullName: data.me.fullName,
      gender: data.me.gender,
    } : null;
  }, [data?.me]);

  return { user, loading, error, refetch };
}
