import { Suspense } from 'react';
import LoginForm from '@/components/auth/login/LoginForm';

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </div>
  );
}
