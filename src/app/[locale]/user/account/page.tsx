import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
function AccountsPage() {
  const cookieStore = cookies();
  redirect(`/${cookieStore.get('NEXT_LOCALE')?.value}/user/account/documents`);
}

export default AccountsPage;
