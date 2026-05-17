export function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://jdream.ai";
  const body = `# Jdream.ai

## What is Jdream.ai?
Jdream.ai is an AI video generation aggregator. Users write a prompt and we submit it to multiple state-of-the-art AI video models (Seedance, Kling, Runway, Pika, Veo) through a single interface.

## Key pages
- ${base}/ — Home page with model overview and pricing
- ${base}/app — Video generation workspace (requires login)
- ${base}/pricing — Credit-based pricing plans
- ${base}/use-cases — Use case gallery

## API
- POST /api/generate — Submit a generation job
- GET /api/status/[id] — Poll generation status
- GET /api/download?id=[id] — Get presigned download URL

## Contact
support@jdream.ai
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
