export interface User {
  login: string;
  isLogged: string;
}

export interface AppUser extends User {
  password: string;
}
