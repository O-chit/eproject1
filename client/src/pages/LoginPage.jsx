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

  // Điểm đến mong muốn sau khi đăng nhập (mặc định là trang chủ /)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
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
        setErrorMsg(err.message || 'Đăng ký không thành công, vui lòng thử lại.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);
      try {
        await login(email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác. Bạn có thể sử dụng tài khoản kiểm thử bên dưới.');
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
    <div className="min-h-screen bg-canvas-linen flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* 1. Header Thương hiệu Di sản */}
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

        {/* Thông báo yêu cầu đăng nhập trước khi xem */}
        <div className="mt-5 max-w-md text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-subtle border border-border-neutral text-accent-terracotta font-spec-code text-[11px] uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
            CỔNG XÁC THỰC THÀNH VIÊN DI SẢN
          </div>
          <p className="font-body-default text-[13px] text-text-secondary mt-2 leading-relaxed">
            Vui lòng đăng nhập hoặc đăng ký tài khoản để tiếp tục khám phá kho tư liệu, bản đồ tương tác và hồ sơ các bậc thầy nghệ nhân Việt Nam.
          </p>
        </div>
      </div>

      {/* 2. Hộp thoại Đăng Nhập / Đăng Ký (Sharp Linework Container) */}
      <div className="max-w-md w-full mx-auto my-6 bg-surface-crisp border border-border-neutral shadow-lg p-7 sm:p-9">
        {/* Tab Chuyển đổi Đăng Nhập / Đăng Ký */}
        <div className="flex border-b border-border-neutral mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-3 font-spec-code text-[12px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer text-center ${
              !isRegister
                ? 'border-b-2 border-accent-terracotta text-accent-terracotta'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-3 font-spec-code text-[12px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer text-center ${
              isRegister
                ? 'border-b-2 border-accent-terracotta text-accent-terracotta'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Tiêu đề mục */}
        <div className="mb-5 text-center">
          <h2 className="font-headline-title text-[22px] font-semibold text-text-primary">
            {isRegister ? 'Tạo Tài Khoản Di Sản Mới' : 'Đăng Nhập Hệ Thống'}
          </h2>
          <p className="font-body-spec text-[12px] text-text-secondary mt-1">
            {isRegister
              ? 'Lưu trữ các kiệt tác yêu thích và nhận tin chuyên sâu.'
              : 'Tiếp tục phiên làm việc để truy cập đầy đủ các phân hệ.'}
          </p>
        </div>

        {/* Thông báo lỗi */}
        {errorMsg && (
          <div className="p-3 mb-5 bg-[#FFDAD6]/50 border border-[#BA1A1A]/30 text-[#93000A] text-[13px] flex items-center gap-2 font-body-spec">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Nhập Liệu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Họ và Tên quý khách *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Nguyễn Hoàng Nam"
                className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              />
            </div>
          )}

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Địa chỉ Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nam.nguyen@craftroots.vn"
              className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
            />
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Mật khẩu {isRegister ? '(Tối thiểu 8 ký tự)' : ''} *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu..."
              className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Nhập lại mật khẩu..."
                className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 py-3.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Đang Xử Lý Xác Thực...</span>
            ) : (
              <span>{isRegister ? 'Tạo Tài Khoản & Vào Trang Chính →' : 'Đăng Nhập & Vào Trang Chính →'}</span>
            )}
          </button>
        </form>

        {/* Nút Điền Nhanh Tài Khoản Thử Nghiệm */}
        <div className="mt-6 pt-5 border-t border-border-neutral text-center bg-surface-subtle/40 p-3">
          <p className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
            Dành cho kiểm thử nhanh:
          </p>
          <button
            type="button"
            onClick={fillTestCredentials}
            className="text-[11px] font-spec-code uppercase tracking-wider text-accent-terracotta hover:underline font-semibold cursor-pointer"
          >
            ⚡ Điền sẵn: user@craftroots.test / Craft@1234
          </button>
        </div>
      </div>

      {/* 3. Footer Bản Quyền */}
      <div className="text-center pb-2 font-spec-code text-[11px] text-text-secondary">
        <span>© 2024 CraftRoots. Giữ toàn quyền bảo tồn di sản phi vật thể Việt Nam.</span>
      </div>
    </div>
  );
}
