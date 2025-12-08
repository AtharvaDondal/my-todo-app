export interface User {
  _id: string;
  email: string;
  fullname: string;
}

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface TodoResponse {
  success: boolean;
  message: string;
  todos?: Todo[];
  todo?: Todo;
}
