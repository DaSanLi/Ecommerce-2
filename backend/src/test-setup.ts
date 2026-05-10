// Jest setup file for mocking GraphQL decorators
import '@nestjs/graphql';

// Mock GraphQL decorators to avoid TypeScript compilation issues
jest.mock('@nestjs/graphql', () => ({
  Resolver: () => (target: any) => target,
  Query: () => (target: any, key: string, descriptor: PropertyDescriptor) => descriptor,
  Mutation: () => (target: any, key: string, descriptor: PropertyDescriptor) => descriptor,
  Args: () => (target: any, key: string, index: number) => {},
  Context: () => (target: any, key: string, index: number) => {},
  UseGuards: () => (target: any, key: string, descriptor: PropertyDescriptor) => descriptor,
  UsePipes: () => (target: any, key: string, descriptor: PropertyDescriptor) => descriptor,
  ObjectType: () => (target: any) => target,
  InputType: () => (target: any) => target,
  Field: () => (target: any, key: string) => {},
  Int: () => (target: any, key: string) => {},
  ID: () => (target: any, key: string) => {},
}));

jest.mock('@nestjs/mapped-types', () => ({
  PartialType: (target: any) => target,
}));

jest.mock('class-validator', () => ({}));
jest.mock('class-transformer', () => ({}));