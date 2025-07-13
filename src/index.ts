import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings & { ASSETS: Fetcher } }>();

// Fallback to serve assets for all routes
app.get("*", async (c) => {
  // Use the ASSETS binding to serve static files
  return await c.env.ASSETS.fetch(c.req.raw);
});

export default app;
