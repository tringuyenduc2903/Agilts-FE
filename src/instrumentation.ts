import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel(process.env.NEXT_PUBLIC_WEBSITE_NAME);
}
