export interface Environment
{
  production: boolean;
}

//base url is a required field for the actionCodeSettings params
export interface AuthEnvironment extends Environment{
  baseUrl: string;
}
