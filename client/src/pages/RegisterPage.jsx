import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setSubmitting(true);
    try {
      await register(fullName, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký tài khoản thất bại, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-180px)] bg-canvas-linen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-crisp p-8 sm:p-10 border border-border-neutral shadow-lg">
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
              GIA NHẬP CỘNG ĐỒNG
            </span>
          </div>
          <h2 className="text-center font-headline-title text-2xl font-bold tracking-tight text-text-primary uppercase">
            Đăng Ký Tài Khoản Di Sản
          </h2>
          <p className="mt-2 text-center font-body-spec text-[13px] text-text-secondary">
            Lưu giữ bộ sưu tập yêu thích và nhận thông cáo chuyên sâu về các nghệ nhân ưu tú.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-body-spec">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              required
              className="w-full h-11 px-3 bg-surface-subtle/50 border border-border-neutral font-body-spec text-sm focus:outline-none focus:border-accent-terracotta"
              placeholder="Nguyễn Hoàng Nam"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Địa chỉ Email *
            </label>
            <input
              type="email"
              required
              className="w-full h-11 px-3 bg-surface-subtle/50 border border-border-neutral font-body-spec text-sm focus:outline-none focus:border-accent-terracotta"
              placeholder="nam.nguyen@craftroots.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Mật khẩu (Tối thiểu 8 ký tự) *
            </label>
            <input
              type="password"
              required
              className="w-full h-11 px-3 bg-surface-subtle/50 border border-border-neutral font-body-spec text-sm focus:outline-none focus:border-accent-terracotta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Xác nhận mật khẩu *
            </label>
            <input
              type="password"
              required
              className="w-full h-11 px-3 bg-surface-subtle/50 border border-border-neutral font-body-spec text-sm focus:outline-none focus:border-accent-terracotta"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[12px] uppercase tracking-[0.2em] py-3.5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {submitting ? 'ĐANG TẠO HỒ SƠ...' : 'HOÀN TẤT ĐĂNG KÝ →'}
          </button>
        </form>

        <div className="pt-4 border-t border-border-neutral text-center font-body-spec text-[13px] text-text-secondary">
          Đã có tài khoản thành viên?{' '}
          <Link to="/login" className="text-accent-terracotta hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
