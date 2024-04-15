export interface PayloadAccessType {
  email: string;
  sub: string;
}
export interface PayloadRefreshType {
  sub: string;
}

export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
}
