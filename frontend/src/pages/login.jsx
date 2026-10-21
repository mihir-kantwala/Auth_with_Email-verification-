import { useState } from 'react';

export default function Login() {
  const [loginFrom, setLoginFrom] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginFrom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log(loginFrom);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginFrom),
        },
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section>
      <div>
        <h1>login </h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email : </label>
          <input
            id="email"
            type="email"
            name="email"
            value={loginFrom.email}
            onChange={handleChange}
          />

          <br />
          <br />

          <label htmlFor="password">password : </label>
          <input
            id="password"
            type="password"
            name="password"
            value={loginFrom.password}
            onChange={handleChange}
          />

          <br />
          <br />
          <p role="status" aria-live="polite">
            {message}
          </p>
          <button type="submit">register</button>
        </form>
      </div>
    </section>
  );
}
