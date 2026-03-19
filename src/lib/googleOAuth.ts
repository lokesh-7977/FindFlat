import type { GoogleUser } from "../types/authTypes";

// In-memory state store — maps state → expiry timestamp
const stateStore = new Map<string, number>();
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateState(): string {
  const rand = () => Math.random().toString(36).substring(2);
  return `${rand()}-${rand()}-${rand()}`;
}

export function createAuthUrl(
  clientId: string,
  redirectUri: string,
  scope: string[],
): { url: string; state: string } {
  const state = generateState();
  stateStore.set(state, Date.now() + STATE_TTL_MS);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope.join(" "),
    state,
    include_granted_scopes: "true",
    prompt: "consent",
  });

  return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, state };
}

export function verifyState(state: string): boolean {
  const expiry = stateStore.get(state);
  if (!expiry) return false;
  stateStore.delete(state);
  return Date.now() < expiry;
}

export async function exchangeCodeForUser(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<GoogleUser> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  }).then((r) => r.json());

  if ("error" in tokenRes) {
    console.error("Google token error:", JSON.stringify(tokenRes));
    throw new Error(tokenRes.error_description ?? tokenRes.error);
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${tokenRes.access_token}` },
  }).then((r) => r.json());

  if ("error" in userRes) {
    throw new Error(userRes.error?.message ?? "Failed to fetch Google user");
  }

  return userRes as GoogleUser;
}
