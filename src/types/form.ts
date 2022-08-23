export interface FormField {
  label: string;
  placeholder: string;
  type: string;
  name?: string;
  className?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  username: string;
  avatar: File;
}
