import { User } from "./user";

export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
};
