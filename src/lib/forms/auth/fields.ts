import { FormField } from "../../../types";

const emailFormField: FormField = {
  label: "Email address",
  placeholder: "Enter your email address",
  type: "mail",
  name: "email",
};

const passwordFormField: FormField = {
  label: "Password",
  placeholder: "Enter your password",
  type: "password",
  name: "password",
};

const usernameFormField: FormField = {
  label: "Username",
  placeholder: "Enter your username",
  type: "text",
  name: "username",
};

export const loginFormFields: Array<FormField> = [
  emailFormField,
  passwordFormField,
];

export const registerFormFields: Array<FormField> = [
  usernameFormField,
  emailFormField,
  passwordFormField,
];

export const passwordForgotFormFields: Array<FormField> = [emailFormField];
