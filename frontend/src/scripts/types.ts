export type FetchOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    credentials?: 'include' | 'omit' | 'same-origin';
}


export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: {
    code?: string;
    originalError?: {
      message: string | string[];
      error: string;
      statusCode: number;
    };
    stacktrace?: string[];
  };
}

export interface GraphQLResponse<T> {
  data: T | null;
  errors?: GraphQLError[];
}

export interface LoginResponse {
  login: {
    email: string;
  };
}