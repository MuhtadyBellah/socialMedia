export interface Error {}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: any;
}
