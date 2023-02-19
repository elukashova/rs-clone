export enum InputAlertVariables {
  Name = 'name',
  Email = 'email',
  Password = 'password',
  Country = 'country',
}

export enum ValidityMessages {
  Name = 'The name must contain two subnames, each at least 3 letters long',
  Email = 'Please provide a valid email',
  Password = 'The password must contain a minimum of 5 characters, including 1 digit and 1 uppercase letter',
  EmptyValue = 'Please enter your ',
  Country = 'Please provide a valid country name',
  Number = 'This input should be a number',
  Time = 'Please provide any number below 59',
}

export type CountryResponse = {
  name: string;
};

export enum InputConflictMessages {
  UserAlreadyExists = 'An account with this email already exists. Please choose another one or ',
  InvalidCredentials = 'Invalid email or password. Please enter valid credentials or ',
}
