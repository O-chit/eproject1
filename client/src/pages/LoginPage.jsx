import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (!fullName.trim()) {
        setErrorMsg('Vui lòng nhập họ và tên');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự (chữ hoa, chữ thường và chữ số)');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không khớp');
        return;
      }

      setSubmitting(true);
      try {
        await register(fullName, email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMsg(err.message || 'Đăng ký tài khoản thất bại');
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);
      try {
        await login(email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const fillTestCredentials = () => {
    setIsRegister(false);
    setEmail('user@craftroots.test');
    setPassword('Craft@1234');
    setErrorMsg('');
  };

  return (
    <div className="craft-container py-12 md:py-16">
      <div className="max-w-md mx-auto border border-[#E6E2DA] bg-[#FFFFFF] p-8 shadow-sm">
        
        {/* Tiêu đề & Chuyển đổi tab */}
        <div className="text-center mb-8">
          <span className="spec-code text-[#B86B35]">TÀI KHOẢN DI SẢN CRAFTROOTS</span>
          <h1 className="font-['Playfair_Display'] text-[26px] font-semibold text-[#1C1B1A] mt-2 mb-4">
            {isRegister ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập Hệ Thống'}
          </h1>
          <div className="flex border-b border-[#E6E2DA]">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); }}
              className={`flex-1 py-2.5 font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] font-medium transition-colors ${
                !isRegister
                  ? 'border-b-2 border-[#B86B35] text-[#B86B35]'
                  : 'text-[#5A5854] hover:text-[#1C1B1A]'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); }}
              className={`flex-1 py-2.5 font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] font-medium transition-colors ${
                isRegister
                  ? 'border-b-2 border-[#B86B35] text-[#B86B35]'
                  : 'text-[#5A5854] hover:text-[#1C1B1A]'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        </div>

        {/* Thông báo lỗi */}
        {errorMsg && (
          <div className="p-3 mb-6 bg-[#FFDAD6]/50 border border-[#BA1A1A]/30 text-[#93000A] text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[12px] font-['Montserrat'] uppercase tracking-wider text-[#5A5854] mb-1">
                Họ và Tên *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                className="craft-input"
              />
            </div>
          )}

          <div>
            <label className="block text-[12px] font-['Montserrat'] uppercase tracking-wider text-[#5A5854] mb-1">
              Địa Chỉ Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ten@example.com"
              className="craft-input"
            />
          </div>

          <div>
            <label className="block text-[12px] font-['Montserrat'] uppercase tracking-wider text-[#5A5854] mb-1">
              Mật Khẩu *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tối thiểu 8 ký tự..."
              className="craft-input"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-[12px] font-['Montserrat'] uppercase tracking-wider text-[#5A5854] mb-1">
                Xác Nhận Mật Khẩu *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Nhập lại mật khẩu..."
                className="craft-input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3 bg-[#B86B35] hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Đang Xử Lý...</span>
            ) : (
              <span>{isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}</span>
            )}
          </button>
        </form>

        {/* Tài khoản mẫu cho test nhanh */}
        <div className="mt-8 pt-6 border-t border-[#E6E2DA] text-center">
          <p className="text-[12px] text-[#5A5854] mb-2 font-['Inter']">
            Tài khoản kiểm thử mẫu (seed data):
          </p>
          <button
            type="button"
            onClick={fillTestCredentials}
            className="text-[11px] font-['Montserrat'] uppercase tracking-wider text-[#B86B35] hover:underline"
          >
            Điền nhanh: user@craftroots.test / Craft@1234
          </button>
        </div>

      </div>
    </div>
  );
}
