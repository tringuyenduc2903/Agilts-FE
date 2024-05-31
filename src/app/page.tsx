import dynamic from 'next/dynamic';
const DynamicBanner = dynamic(() => import('./_components/Banner'), {
  ssr: false,
  loading: () => (
    <section className='skeleton relative w-full h-screen'></section>
  ),
});
export default async function Home() {
  return (
    <main>
      <DynamicBanner />
    </main>
  );
}
