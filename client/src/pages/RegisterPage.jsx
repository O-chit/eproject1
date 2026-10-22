import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setErrorMsg('Vui lòng nhập họ và tên của quý khách.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
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
    <div className="min-h-screen bg-canvas-linen flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Logo */}
      <div className="flex flex-col items-center justify-center pt-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full border border-accent-terracotta flex items-center justify-center bg-surface-crisp text-accent-terracotta font-serif font-bold text-lg tracking-widest shrink-0 shadow-sm">
            CR
          </div>
          <div className="flex flex-col text-left">
            <span className="font-['Montserrat'] text-[18px] uppercase tracking-[0.25em] text-text-primary font-semibold group-hover:text-accent-terracotta transition-colors leading-tight">
              CraftRoots
            </span>
            <span className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-text-secondary leading-none mt-1">
              Di Sản &amp; Làng Nghề Thủ Công
            </span>
          </div>
        </Link>
      </div>

      {/* Container Đăng Ký */}
      <div className="max-w-md w-full mx-auto my-6 bg-surface-crisp border border-border-neutral shadow-lg p-7 sm:p-9">
        <div className="text-center mb-6">
          <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
            GIA NHẬP CỘNG ĐỒNG DI SẢN
          </span>
          <h2 className="font-headline-title text-[24px] font-semibold text-text-primary mt-1">
            Đăng Ký Tài Khoản
          </h2>
          <p className="font-body-spec text-[12px] text-text-secondary mt-1">
            Tạo tài khoản để lưu trữ các bộ sưu tập và truy cập toàn bộ hệ thống làng nghề.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 bg-[#FFDAD6]/50 border border-[#BA1A1A]/30 text-[#93000A] text-[13px] flex items-center gap-2 font-body-spec">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              required
              className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
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
              className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              placeholder="nam.nguyen@craftroots.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Mật khẩu (Tối thiểu 8 ký tự) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full h-11 pl-3.5 pr-11 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary hover:text-accent-terracotta transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Xác nhận mật khẩu *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full h-11 pl-3.5 pr-11 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary hover:text-accent-terracotta transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 py-3.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {submitting ? 'ĐANG TẠO HỒ SƠ...' : 'HOÀN TẤT ĐĂNG KÝ & VÀO TRANG CHÍNH →'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border-neutral text-center font-body-spec text-[13px] text-text-secondary">
          Đã có tài khoản thành viên?{' '}
          <Link to="/login" className="text-accent-terracotta hover:underline font-semibold">
            Đăng nhập ngay
          </Link>
        </div>
      </div>

      <div className="text-center pb-2 font-spec-code text-[11px] text-text-secondary">
        <span>© 2024 CraftRoots. Giữ toàn quyền bảo tồn di sản phi vật thể Việt Nam.</span>
      </div>
    </div>
  );
}
