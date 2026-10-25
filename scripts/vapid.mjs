// Prints a fresh key pair for browser notifications. Run: npm run vapid
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("Add these three to Vercel (Settings > Environment Variables) and to .env.local:\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}   <- secret, never share it`);
console.log("VAPID_SUBJECT=mailto:you@example.com");
