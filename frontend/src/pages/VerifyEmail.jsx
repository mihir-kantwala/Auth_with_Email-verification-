import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const controller = new AbortController();

    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
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

        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        if (error.name === 'AbortError') return;

        setStatus('error');
        setMessage(error.message || 'Something went wrong. Please try again.');
      }
    }

    verifyEmail();

    return () => controller.abort();
  }, [searchParams]);

  return (
    <main>
      <h1>Email Verification</h1>
      <p role="status" aria-live="polite">
        {message}
      </p>

      {status === 'success' && <Link to="/login">Go to Login</Link>}

      {status === 'error' && <Link to="/register">Back to Registration</Link>}
    </main>
  );
}
