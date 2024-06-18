import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const lang = localeCookie ? localeCookie.value : 'vi';

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
