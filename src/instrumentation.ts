import { registerOTel } from '@vercel/otel';
import { title } from './config/config';

export function register() {
  registerOTel(title);
}
