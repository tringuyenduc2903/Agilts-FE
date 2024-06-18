import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export default function RootPage() {
  const cookieStore = cookies();
  redirect(`/${cookieStore.get('NEXT_LOCALE')?.value}`);
}
