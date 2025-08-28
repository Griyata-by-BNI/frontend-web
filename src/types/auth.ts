export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DecodedUser {
  email: string;
  userId: string;
  fullName: string;
  role: string;
}

export interface LoginResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    token: string;
  };
}

export type UserLogin = {
  id: string;
  email: string;
  name: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type LogoutReason =
  | "manual"
  | "expired"
  | "idle"
  | "unauthenticated"
  | "invalid-token"
  | "forbidden"
  | "revoked"
  | "network";

export type LogoutOptions = {
  redirect?: boolean; // default: true
  redirectTo?: string; // default: "/login"
  includeReturnTo?: boolean; // default: false
};

export type AuthContextType = {
  user: DecodedUser | null;
  token: string | null;
  login: (token: string) => void;
  logout: (reason?: LogoutReason, opts?: LogoutOptions) => void; // <- diubah
  loading: boolean;
};

export interface JwtPayload extends DecodedUser {
  exp: number;
}

export type VerifyOtpForgotPasswordResponse = {
  status: {
    code: number;
    message: string;
  };
  data: {
    tokenReset: string;
  };
};
