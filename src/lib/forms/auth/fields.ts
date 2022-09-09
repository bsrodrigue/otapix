import { FormField } from "../../../types";

export const loginFormFields: Array<FormField> = [
  {
    label: "Email address",
    placeholder: "Enter your email address",
    type: "mail",
    name: "email",
  },
  {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    name: "password",
  },
];

export const registerFormFields: Array<FormField> = [
  {
    label: "Username",
    placeholder: "Enter your username",
    type: "text",
    name: "username",
  },
  {
    label: "Email address",
    placeholder: "Enter your email address",
    type: "email",
    name: "email",
  },
  {
    label: "Password",
    placeholder: "Create your password",
    type: "password",
    name: "password",
  },
];
