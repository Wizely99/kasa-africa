import { retrieveServerSession } from "@/utils/auth/options";
import { getIdToken } from "@/utils/token-accessor";

export async function POST() {
  const session = await retrieveServerSession();

  if (session) {
    const idToken = await getIdToken();

    if (!process.env.END_SESSION_URL || !process.env.NEXTAUTH_URL) {
      return new Response(null, { status: 500 });
    }

    const url = `${process.env.END_SESSION_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(
      process.env.NEXTAUTH_URL
    )}`;

    try {
      const resp = await fetch(url, { method: "GET" });

      if (!resp.ok) {
        return new Response(null, { status: 500 });
      }
    } catch {
      return new Response(null, { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}