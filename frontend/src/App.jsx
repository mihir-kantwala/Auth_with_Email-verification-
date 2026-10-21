import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './pages/register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
