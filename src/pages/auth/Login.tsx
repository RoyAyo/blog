import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

interface LoginCredentials {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Invalid credentials');
 
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-purple-500">
        <h1 className="text-3xl font-bold text-purple-400 text-center">Retro Blog Admin</h1>
        {error && <div className="text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" type="text" placeholder="Username" className="w-full p-2" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" className="w-full p-2" onChange={handleChange} />
          <button type="submit" className="bg-purple-600 text-white w-full p-2">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
