import { FastifyInstance } from "fastify";
import { loadWebPage } from "../services/crawlers";

export async function crawlersRoutes(app: FastifyInstance) {
  app.get("/crawlers", async () => {
    await loadWebPage();
    return { message: "ok" };
  });
}
