import { gql } from '@apollo/client';

export const FIND_ALL_TASKS = gql`
  query FindAllTasks {
    findAllTasks {
      id
      title
      priority
      description
      status
      orderInStatus
    }
  }
`;

export const FIND_ONE_TASK = gql`
  query FindOneTask($id: String!) {
    findOneTask(id: $id) {
      id
      title
      priority
      description
      status
      orderInStatus
    }
  }
`;
