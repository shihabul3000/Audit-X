"use client";

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session: {
    token: string;
    expiresAt: number;
  };
}

export async function signIn(params: SignInParams): Promise<AuthResponse> {
  const response = await fetch("/api/auth/signin/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      password: params.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Sign in failed" }));
    throw new Error(error.message || "Sign in failed");
  }

  const data = await response.json();
  return data;
}

export async function signUp(params: SignUpParams): Promise<AuthResponse> {
  const response = await fetch("/api/auth/signup/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: params.name,
      email: params.email,
      password: params.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Sign up failed" }));
    throw new Error(error.message || "Sign up failed");
  }

  const data = await response.json();
  return data;
}

export async function signOut(): Promise<void> {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Sign out failed");
  }
}

export async function getSession(): Promise<AuthResponse | null> {
  try {
    const response = await fetch("/api/auth/get-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}