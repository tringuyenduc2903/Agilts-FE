export default async function getCSRFCookie() {
  try {
    const csrfRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`,
      {
        credentials: 'include',
      }
    );

    if (!csrfRes.ok) {
      throw new Error('Failed to fetch CSRF cookie');
    }

    const csrfCookie = csrfRes.headers.get('set-cookie');

    if (csrfCookie) {
      return csrfCookie
        .split('; ')
        .find((item) => item.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    }
  } catch (error) {
    console.error('Error fetching CSRF cookie:', error);
  }
}
