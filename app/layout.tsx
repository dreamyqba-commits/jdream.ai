import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "Jdream.ai — AI Video Generator",
    template: "%s | Jdream.ai",
  },
  description:
    "Generate stunning AI videos with Seedance, Kling, Runway, Pika, and more — all from one prompt.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://jdream.ai"),
  openGraph: {
    type: "website",
    siteName: "Jdream.ai",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
