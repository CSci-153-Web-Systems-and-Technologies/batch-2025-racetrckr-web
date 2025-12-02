import { AuthErrorBoundary } from '@/components/auth/shared/AuthErrorBoundary';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthErrorBoundary>
  );
}
