import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export default async function RootPage() {
  const cookieStore = cookies();
  redirect(`/${cookieStore.get('NEXT_LOCALE')?.value}`);
}
