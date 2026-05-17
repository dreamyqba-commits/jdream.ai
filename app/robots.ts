import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://jdream.ai";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app", "/account", "/history", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
