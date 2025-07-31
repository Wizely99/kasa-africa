/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";


declare module "next-auth" {
//   interface User extends IUser {}

  interface Session extends DefaultSession {
    access_token: string;
    id_token: string;
    userId: UUID;
    error?: string;
    preferred_username: string;
   
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    error?: string;
    expiresAt?: number;
    name?: string;
    email?: string;
    sub?: string;
    decoded?: {
      exp: number;
      iat: number;
      auth_time: number;
      jti: string;
      iss: string;
      aud: string;
      sub: UUID;
      typ: string;
      azp: string;
      sid: string;
      acr: string;
      allowed_origins: string[];
      realm_access: { roles: string[] };
      resource_access: { account: object };
      scope: string;
      email_verified: boolean;
      preferred_username: string;
      given_name: string;
      family_name: string;
    };
  }
}
