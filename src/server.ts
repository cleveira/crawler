import fastify from "fastify";

import { env } from "./env";
import { crawlersRoutes } from "./routes/crawlers";
import { job } from "./cron/jobs";

const app = fastify();

app.register(crawlersRoutes);

job.start();

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running at port: ${env.PORT}`);
});
