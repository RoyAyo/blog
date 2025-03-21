import React, { useState, useEffect } from 'react';
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
  const [currentPrompt, setCurrentPrompt] = useState<'username' | 'password'>('username');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [bootText, setBootText] = useState<string[]>([]);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const bootSequence = [
      "RETRO-OS v1.0.3 BOOT SEQUENCE INITIATED",
      "CHECKING MEMORY................DONE",
      "INITIALIZING RESOURCES........DONE",
      "LOADING ADMIN INTERFACE.......DONE",
      "ESTABLISHING SECURE CONNECTION...",
      "ACCESS TERMINAL READY"
    ];
    
    const typeBootText = async () => {
      for (let i = 0; i < bootSequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setBootText(prev => [...prev, bootSequence[i]]);
      }
    };
    
    typeBootText();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentPrompt === 'username') {
        setCurrentPrompt('password');
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setBootText(prev => [...prev, `AUTHENTICATING USER: ${credentials.username}`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    setBootText(prev => [...prev, "VALIDATING CREDENTIALS..."]);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Invalid credentials');
      
      setBootText(prev => [...prev, "ACCESS GRANTED"]);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setBootText(prev => [...prev, "ACCESS DENIED: INVALID CREDENTIALS"]);
      setError('Authentication failure: Invalid username or password');
      setCurrentPrompt('username');
      setCredentials({ username: '', password: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono flex flex-col">
      <div className="flex-1 overflow-auto p-4 max-w-3xl mx-auto w-full">
        <div className="terminal-output mb-4">
          {bootText.map((line, index) => (
            <div key={index} className="mb-1">{line}</div>
          ))}
        </div>
        
        {bootText.length >= 6 && !loading && (
          <div className="login-prompt mt-8">
            {error && <div className="text-red-500 mb-4"> ERROR: {error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentPrompt === 'username' ? (
                <div className="flex">
                  <span className="mr-2"> username:</span>
                  <input
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="bg-transparent border-none outline-none text-green-500 flex-1"
                    autoComplete="off"
                  />
                </div>
              ) : (
                <div>
                  <div> username: {credentials.username}</div>
                  <div className="flex">
                    <span className="mr-2"> password:</span>
                    <input
                      name="password"
                      type="password"
                      value={credentials.password}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="bg-transparent border-none outline-none text-green-500 flex-1"
                    />
                  </div>
                </div>
              )}
              
              <div className="text-xs text-green-300 mt-8">
                PRESS ENTER TO CONTINUE | RETRO BLOG ADMIN TERMINAL v2.4.1
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;