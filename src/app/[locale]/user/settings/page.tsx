import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
function SettingsPage() {
  const cookieStore = cookies();
  redirect(
    `/${
      cookieStore.get('NEXT_LOCALE')?.value
    }/user/settings/password-and-security`
  );
}

export default SettingsPage;
