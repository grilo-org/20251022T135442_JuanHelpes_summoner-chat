export type Role = "user" | "bot";

export interface Message {
  role: Role;
  content: string;
}
