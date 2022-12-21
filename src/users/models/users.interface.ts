import { Role } from "src/roles/entity/role.enum";

export class User {
  id: string;
  username: string;
  login: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  roles: Role[];
}

export interface UserResponse {
  id: string;
  login: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
  photos?: string;
  status?: string;
  roles: Role[];
}

export interface UserSocialLogin {
  username: string,
  login: string,
  photos: string,
}
