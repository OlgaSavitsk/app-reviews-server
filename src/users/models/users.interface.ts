export class User {
  id: string;
  name: string;
  login: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface UserResponse {
  id: string;
  login: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}
