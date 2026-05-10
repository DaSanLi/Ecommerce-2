import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { redirect } from 'next/navigation';
import { URLBASE } from '@/src/scripts/scripts';

function verifyTokenWithRetry(): Promise<boolean> {
  return fetch(URLBASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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
  })
    .then((res) => res.json())
    .then((result) => !!result.data?.verification?.email)
    .catch(() => false);
}

const authLink = onError(({ error, operation, forward }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const authErrors = error.errors.filter((e) => {
    const message = e.message || '';
    const code = e.extensions?.code as string | undefined;

    return (
      code === 'UNAUTHENTICATED' ||
      message.includes('Unauthorized') ||
      message.includes('No se ha proporcionado el token') ||
      message.includes('Token')
    );
  });

  if (authErrors.length > 0) {
    verifyTokenWithRetry().then((isValid) => {
      if (!isValid) {
        redirect('/auth/login');
        return;
      }
      return forward(operation);
    });
  }
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: from([
      authLink,
      new HttpLink({
        uri: URLBASE,
        credentials: 'include',
      }),
    ]),
    cache: new InMemoryCache(),
  });
};
