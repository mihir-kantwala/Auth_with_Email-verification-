import { useState } from 'react';

export default function Register() {
  const [registerForm, setRegisterForm] = useState({
    name: ' ',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(registerForm);

  //   const res = registerApi();
  //   console.log(res);
  // };

  const handleRegister = async (event) => {
    event.preventDefault();

    console.log(registerForm);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerForm),
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
        <h1>Register </h1>
        <form onSubmit={handleRegister}>
          <label htmlFor="name">Name : </label>
          <input
            id="name"
            type="text"
            name="name"
            value={registerForm.name}
            onChange={handleChange}
          />

          <br />

          <br />
          <label htmlFor="email">Email : </label>
          <input
            id="email"
            type="email"
            name="email"
            value={registerForm.email}
            onChange={handleChange}
          />

          <br />
          <br />

          <label htmlFor="password">password : </label>
          <input
            id="password"
            type="password"
            name="password"
            value={registerForm.password}
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
