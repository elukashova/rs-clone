export enum InputAlertVariables {
  Name = 'name',
  Email = 'email',
  Password = 'password',
  Country = 'country',
}

export enum ValidityMessages {
  Name = 'splash.errors.Name',
  Email = 'splash.errors.Email',
  Password = 'splash.errors.Password',
  EmptyValue = 'splash.errors.EmptyValue',
  Country = 'splash.errors.Country',
  Number = 'splash.errors.Number',
  Time = 'splash.errors.Time',
}

export enum InputConflictMessages {
  UserAlreadyExists = 'splash.errors.UserAlreadyExists',
  InvalidCredentials = 'splash.errors.InvalidCredentials',
}
