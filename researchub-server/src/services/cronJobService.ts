import cron from "node-cron";
import ApiService from "./apiService";
import axios from "axios";

const SELF_URL =
  process.env.SELF_URL || "https://researchub-server.onrender.com";

/**
 * Keep-Alive Cron Job
 * --------------------
 * This scheduled task periodically pings the deployed Render services
 * (Researchub Server and AI Engine) to prevent them from going idle.
 *
 * Render’s free tier automatically suspends inactive services after ~15 minutes
 * of no incoming requests, which can cause 502 errors or long cold starts.
 *
 * Runs every 10 minutes.
 */
const pingServers = async () => {
  try {
    console.log(
      `[keepAlive] Pinging self and AI Engine at ${new Date().toISOString()}`
    );

    await Promise.all([
      axios.get(`${SELF_URL}/chat/health`, { timeout: 5000 }),
      ApiService.get("/summarize/health", { timeout: 5000 }),
    ]);

    console.log(`[keepAlive] ✅ Successfully pinged both services`);
  } catch (err: any) {
    console.error(`[keepAlive] ❌ Ping failed:`, err.message);
  }
};

export default {
  init() {
    //every 10 minutes
    cron.schedule("*/10 * * * *", async () => {
      await pingServers();
    });
  },
};
