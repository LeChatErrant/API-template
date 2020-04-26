export interface UserCreation {
  email: string;
  name?: string;
  password: string;
}

export interface UserModifiableFields {
  email?: string;
  name?: string;
  password?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}
