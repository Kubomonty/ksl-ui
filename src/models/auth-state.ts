export interface AuthState {
  token: string;
  loggedInUser?: {
    id: string;
    userEmail: string;
    username: string;
    userRole: string,
    teamName?: string | null;
  } | null
}
