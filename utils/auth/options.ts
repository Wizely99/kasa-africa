import { jwtDecode } from "jwt-decode";
import { Account, getServerSession, NextAuthOptions, Session } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { encrypt } from "@/utils/encryption";
import { JWT } from "next-auth/jwt";



// this will refresh an expired access token, when needed
async function refreshAccessToken(token:JWT):Promise<JWT> {
    const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID as string,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token as string,
      }),
      method: "POST",
    });
    const refreshToken = await resp.json();
    if (!resp.ok){
        token.error = "RefreshTokenError";
        return token;
    }
    
  
    return {
      ...token,
      access_token: refreshToken.access_token,
      decoded: jwtDecode(refreshToken.access_token),
      id_token: refreshToken.id_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
      refresh_token: refreshToken.refresh_token,
    };
  }

export const authOptions:NextAuthOptions = {
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: `${process.env.AUTH_ISSUER}`,
    }),
  ],

  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }): Promise<JWT> {
        const nowTimeStamp = Math.floor(Date.now() / 1000);
      
        if (account) {
          // Account is available on the first sign-in
          token.decoded = jwtDecode(account.access_token as string);
          token.access_token = account.access_token;
          token.id_token = account.id_token;
          token.expires_at = account.expires_at;
          token.refresh_token = account.refresh_token;
          return token;
        } else if (token.decoded?.exp && nowTimeStamp < token.decoded.exp) {
          // Token has not expired yet, return it
          return token;
        } else {
          // Token is expired, attempt to refresh it
            const refreshedToken = await refreshAccessToken(token);

            return refreshedToken;
          
        }
      },
      
    async session({ session, token }:{session:Session,token: JWT}) {
      
      session.access_token = encrypt(token.access_token as string); // see utils/sessionTokenAccessor.js
      session.id_token = encrypt(token.id_token as string);  // see utils/sessionTokenAccessor.js
      session.userId=token.decoded!.sub; 
      session.error = token.error as string;    
      session.preferred_username=token.decoded!.preferred_username;  
      return session;
    },
  },
};

export function retrieveServerSession() {
	return getServerSession(authOptions);
}