export interface User {
  login: string;
  isOnline: boolean;
}

export interface AppUser extends User {
  password: string;
}
