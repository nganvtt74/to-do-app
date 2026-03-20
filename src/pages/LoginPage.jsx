import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = handleLogin(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Đăng nhập thất bại. Vui lòng dùng admin@gmail.com');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f9fafc] font-sans pt-20">
      {/* To-do Logo */}
      <div className="flex items-center gap-3 mb-8 text-[#253858]">
        <div className="flex gap-1.5 mt-1.5">
          <span className="block w-2.5 h-6 bg-[#0052cc] rounded-sm"></span>
          <span className="block w-2.5 h-9 bg-[#0052cc] rounded-sm"></span>
          <span className="block w-2.5 h-7 bg-[#0052cc] rounded-sm"></span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">To-do</h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] p-8 bg-white rounded shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        <h2 className="mb-6 text-base font-bold text-center text-[#5e6c84]">
          Đăng nhập vào To-do
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2.5 text-sm bg-[#fafbfc] border border-[#dfe1e6] rounded-[3px] focus:outline-none focus:bg-white focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff] transition-colors placeholder-[#a5adba]" 
              placeholder="Nhập email (vd: admin@gmail.com)" 
              required
            />
          </div>
          
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2.5 text-sm bg-[#fafbfc] border border-[#dfe1e6] rounded-[3px] focus:outline-none focus:bg-white focus:border-[#4c9aff] focus:ring-1 focus:ring-[#4c9aff] transition-colors placeholder-[#a5adba]" 
              placeholder="Nhập mật khẩu" 
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 px-4 py-2.5 text-sm font-bold text-white bg-[#0052cc] rounded-[3px] hover:bg-[#0065ff] transition-colors shadow-sm"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#dfe1e6] text-center text-sm text-[#5e6c84]">
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-[#0052cc] hover:underline">Không thể đăng nhập?</a></li>
            <li><a href="#" className="text-[#0052cc] hover:underline">Đăng ký tài khoản</a></li>
          </ul>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-8 text-sm text-[#5e6c84] flex items-center gap-1">
        Bản quyền thuộc về <span className="font-bold text-[#172b4d]">Atlassian</span>
      </div>
    </div>
  );
};

export default LoginPage;