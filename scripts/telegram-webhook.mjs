// Connects your Telegram bot to this site. Run once after you set the three TELEGRAM_ variables:
//   SITE_URL=https://shelbystudio.xyz node --env-file=.env.local scripts/telegram-webhook.mjs
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const site = (process.env.SITE_URL || "").replace(/\/$/, "");

if (!token || !secret || !site.startsWith("https://")) {
  console.error("Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET (in .env.local) and SITE_URL=https://your-site");
  process.exit(1);
}

const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: `${site}/api/telegram/webhook`, secret_token: secret, allowed_updates: ["message"] }),
});

console.log(await response.json());
