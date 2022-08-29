import { FormField } from "../../../types";

export const loginFormFields: Array<FormField> = [
  {
    label: "Adresse mail",
    placeholder: "Entrez votre adresse mail",
    type: "mail",
    name: "email",
  },
  {
    label: "Mot de passe",
    placeholder: "Entrez votre mot de passe",
    type: "password",
    name: "password",
  },
];

export const registerFormFields: Array<FormField> = [
  {
    label: "Nom d'utilisateur",
    placeholder: "Entrez votre nom d'utilisateur",
    type: "text",
    name: "username",
  },
  {
    label: "Adresse mail",
    placeholder: "Entrez votre adresse mail",
    type: "email",
    name: "email",
  },
  {
    label: "Mot de passe",
    placeholder: "Entrez votre mot de passe",
    type: "password",
    name: "password",
  },
];
