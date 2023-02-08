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
  Country = '',
}

export type CountryResponse = {
  name: 'string';
  independent: 'string';
};
