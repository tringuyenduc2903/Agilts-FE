export default async function getCSRFCookie() {
  try {
    const csrfRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`,
      {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    if (!csrfRes.ok) {
      throw new Error('Failed to fetch CSRF cookie');
    }

    // const csrfCookie = csrfRes.headers.get('set-cookie');

    // if (csrfCookie) {
    //   return decodeURIComponent(
    //     csrfCookie
    //       .split('; ')
    //       .find((item) => item.startsWith('XSRF-TOKEN='))
    //       ?.split('=')[1]
    //       .toString() as string
    //   );
    // }
  } catch (error) {
    console.error('Error fetching CSRF cookie:', error);
  }
}
