import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($createTaskDto: CreateTaskDto!) {
    createTask(createTaskDto: $createTaskDto)
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: String!, $updateTaskDto: UpdateTaskDto!) {
    updateTask(id: $id, updateTaskDto: $updateTaskDto)
  }
`;

export const REMOVE_TASK = gql`
  mutation RemoveTask($id: String!) {
    removeTask(id: $id)
  }
`;

export const MOVE_TASK = gql`
  mutation MoveTask($id: String!, $moveTaskDto: UpdateTaskDto!) {
    moveTask(id: $id, moveTaskDto: $moveTaskDto)
  }
`;
