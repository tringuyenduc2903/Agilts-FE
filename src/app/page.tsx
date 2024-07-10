import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function RootPage() {
  const locale = cookies().get('NEXT_LOCALE')?.value || 'vi';
  redirect(`/${locale}`);
}
