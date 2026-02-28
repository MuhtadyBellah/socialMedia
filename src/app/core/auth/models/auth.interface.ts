export interface Auth {}

export interface AuthResponse {
  success: true;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    user: {
      id: number;
      name: string;
      username?: string;
      email: string;
      photo: string;
      cover: string;
    };
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: any;
}
