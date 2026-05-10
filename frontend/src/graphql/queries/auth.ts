import { gql } from '@apollo/client';

export const VERIFICATION = gql`
  query Verification {
    verification {
      message
      email
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      email
      fullName
      gender
    }
  }
`;
