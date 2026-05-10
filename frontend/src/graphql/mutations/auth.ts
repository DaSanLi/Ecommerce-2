import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($body: LoginDto!) {
    login(body: $body) {
      email
    }
  }
`;

export const REGISTER = gql`
  mutation Register($body: CreateUserDto!) {
    register(body: $body) {
      email
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $body: UpdateUserDto!) {
    updateUser(id: $id, body: $body)
  }
`;
