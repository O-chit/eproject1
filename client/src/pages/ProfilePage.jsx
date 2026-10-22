import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 8 ký tự');
      return;
    }

    setSubmittingPassword(true);
    try {
      if (changePassword) {
        await changePassword(currentPassword, newPassword);
      }
      setPasswordMsg('Đã cập nhật mật khẩu mới thành công trên hệ thống CSDL!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Mật khẩu hiện tại không chính xác');
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-180px)] bg-canvas-linen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Profile */}
        <div className="bg-surface-crisp p-4 sm:p-8 border border-border-neutral shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent-terracotta text-white flex items-center justify-center font-headline-title text-xl sm:text-2xl font-bold shrink-0">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <span className="font-spec-code text-[10px] sm:text-[11px] uppercase tracking-wider text-accent-terracotta font-semibold">
                THÀNH VIÊN CRAFTROOTS
              </span>
              <h2 className="font-headline-title text-lg sm:text-2xl text-text-primary">
                {user?.fullName || 'Người Yêu Di Sản'}
              </h2>
              <p className="font-body-spec text-[12px] sm:text-[13px] text-text-secondary">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 border border-border-neutral hover:border-red-600 text-red-600 font-spec-code text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>

        {/* Tab & Nội dung */}
        <div className="bg-surface-crisp border border-border-neutral shadow-sm">
          <div className="flex border-b border-border-neutral divide-x divide-border-neutral font-spec-code text-[12px] uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3.5 transition-colors cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-accent-terracotta text-white font-semibold'
                  : 'text-text-secondary hover:text-text-primary bg-surface-subtle/30'
              }`}
            >
              Thông Tin Tài Khoản
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3.5 transition-colors cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-accent-terracotta text-white font-semibold'
                  : 'text-text-secondary hover:text-text-primary bg-surface-subtle/30'
              }`}
            >
              Đổi Mật Khẩu
            </button>
            <Link
              to="/favourites"
              className="px-6 py-3.5 text-text-secondary hover:text-accent-terracotta bg-surface-subtle/30 transition-colors"
            >
              Bộ Sưu Tập Yêu Thích →
            </Link>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.fullName || 'Khách vãng lai'}
                      className="w-full h-11 px-3 bg-surface-subtle border border-border-neutral font-body-spec text-sm text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                      Email đăng ký
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full h-11 px-3 bg-surface-subtle border border-border-neutral font-body-spec text-sm text-text-primary"
                    />
                  </div>
                </div>

                <div className="p-4 bg-surface-subtle/50 border border-border-neutral text-text-secondary font-body-spec text-[13px] leading-relaxed">
                  Tài khoản của bạn đã được kích hoạt chức năng lưu trữ &amp; đồng bộ bộ sưu tập di sản yêu thích trên máy chủ CraftRoots Cloud.
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                {passwordMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-body-spec">
                    {passwordMsg}
                  </div>
                )}
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-sm font-body-spec">
                    {passwordError}
                  </div>
                )}
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                    Mật khẩu hiện tại *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-11 pl-3 pr-10 bg-surface-subtle/50 border border-border-neutral font-body-spec text-sm focus:outline-none focus:border-accent-terracotta"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-accent-terracotta transition-colors cursor-pointer"
                      aria-label={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      title={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      <span className="material-symbols-outlined text-[20px] select-none">
                        {showCurrentPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                    Mật khẩu mới (Tối thiểu 8 ký tự) *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11 pl-3 pr-10 bg-surface-subtle/50 border border-border-neutral font-body-spec text-sm focus:outline-none focus:border-accent-terracotta"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-accent-terracotta transition-colors cursor-pointer"
                      aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      <span className="material-symbols-outlined text-[20px] select-none">
                        {showNewPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="px-6 py-3 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-spec-code text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submittingPassword ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT MẬT KHẨU'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
