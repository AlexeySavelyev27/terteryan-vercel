import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Media Management',
  description: 'Admin interface for managing media uploads',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
