import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MailCheck, CircleX, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('error');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const controller = new AbortController();
    let isActive = true;

    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return () => controller.abort();
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Email verification failed.');
        }

        if (isActive) {
          setStatus('success');
          setMessage(
            data.message || 'Your email has been verified successfully!',
          );
        }
      } catch (error) {
        if (error.name === 'AbortError') return;

        if (isActive) {
          setStatus('error');
          setMessage(
            error.message || 'Something went wrong. Please try again.',
          );
        }
      }
    }

    verifyEmail();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-8 text-center shadow-xl shadow-indigo-100/60 sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <ShieldCheck size={36} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Email Verification
        </h1>

        <div
          role="status"
          aria-live="polite"
          className={`mt-6 rounded-xl border p-4 ${
            status === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <div className="mb-2 flex justify-center">
            {status === 'success' ? (
              <MailCheck size={32} />
            ) : (
              <CircleX size={32} />
            )}
          </div>

          <h2 className="font-semibold">
            {status === 'success'
              ? 'Email verified successfully!'
              : 'Verification unsuccessful'}
          </h2>

          <p className="mt-2 text-sm leading-6">{message}</p>
        </div>

        <Link
          to={status === 'success' ? '/login' : '/register'}
          className="mt-7 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          {status === 'success' ? 'Go to Login' : 'Back to Registration'}
        </Link>

        <p className="mt-6 text-xs text-gray-400">
          <ShieldCheck size={14} className="mr-1 inline-block" />
          Your account security matters to us.
        </p>
      </div>
    </main>
  );
}
