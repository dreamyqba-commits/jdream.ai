import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { redirectTo, error } = await searchParams;

  if (user) redirect(redirectTo ?? "/app");

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-2">
          Sign in to Jdream
        </h1>
        <p className="text-[15px] text-[var(--color-text-secondary)] mb-8">
          Continue with your Google account to start generating.
        </p>

        {error && (
          <p className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            Authentication failed. Please try again.
          </p>
        )}

        <GoogleSignInButton redirectTo={redirectTo} />

        <p className="mt-8 text-center text-[13px] text-[var(--color-text-tertiary)]">
          By continuing you agree to our{" "}
          <a href="/terms" className="text-[var(--color-brand)] hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-[var(--color-brand)] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function GoogleSignInButton({ redirectTo }: { redirectTo?: string }) {
  return (
    <form action="/api/auth/google" method="POST">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[15px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-elevated)]"
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
