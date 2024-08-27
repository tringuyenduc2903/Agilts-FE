import { Metadata } from 'next';
import { VehicleRegistrationSupportProvider } from './_contexts/VehicleRegistrationSupportProvider';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Đơn đặt hàng',
  };
}
export default async function PurchaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VehicleRegistrationSupportProvider>
      {children}
    </VehicleRegistrationSupportProvider>
  );
}
