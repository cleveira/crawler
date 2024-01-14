import { CronJob } from "cron";
import { env } from "../env";
import { loadWebPage } from "../services/crawlers";

const job = new CronJob(env.CRON_JOB_CRAWLER, function () {
  void loadWebPage();
});

export { job };
