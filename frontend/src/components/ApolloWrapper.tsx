'use client'
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/src/graphql/client";
import { useMemo } from "react";

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
