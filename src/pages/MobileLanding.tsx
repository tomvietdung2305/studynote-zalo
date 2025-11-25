import React from 'react';

/**
 * Mobile Landing Page
 * Shown to mobile users visiting via browser
 * Prompts them to open the app in Zalo Mini App
 */
const MobileLanding: React.FC = () => {
    const handleOpenInZalo = () => {
        // TODO: Replace with actual Zalo Mini App link
        const zaloMiniAppUrl = 'https://zalo.me/app/YOUR_APP_ID';
        window.location.href = zaloMiniAppUrl;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                {/* App Logo/Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-5xl">📚</span>
                    </div>
                </div>

                {/* App Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    StudyNote
                </h1>
                <p className="text-gray-600 mb-8">
                    Ứng dụng quản lý học sinh dành cho giáo viên
                </p>

                {/* Features List */}
                <div className="mb-8 text-left">
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">✅</span>
                        <div>
                            <p className="font-medium text-gray-900">Điểm danh nhanh</p>
                            <p className="text-sm text-gray-600">Theo dõi sĩ số hàng ngày</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">📝</span>
                        <div>
                            <p className="font-medium text-gray-900">Nhận xét AI</p>
                            <p className="text-sm text-gray-600">Tạo nhận xét tự động</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">👨‍👩‍👧‍👦</span>
                        <div>
                            <p className="font-medium text-gray-900">Kết nối phụ huynh</p>
                            <p className="text-sm text-gray-600">Gửi thông báo trực tiếp</p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleOpenInZalo}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
                >
                    <span className="text-xl">📱</span>
                    Mở trong Zalo Mini App
                </button>

                {/* Info Text */}
                <p className="text-xs text-gray-500">
                    Ứng dụng được thiết kế cho Zalo Mini App.<br />
                    Vui lòng mở trên điện thoại để trải nghiệm đầy đủ.
                </p>

                {/* Desktop Notice */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                        💻 Đang dùng máy tính?
                    </p>
                    <a
                        href="/"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                        onClick={(e) => {
                            e.preventDefault();
                            // Force reload as web app
                            sessionStorage.setItem('force-web', 'true');
                            window.location.reload();
                        }}
                    >
                        Truy cập phiên bản Web
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MobileLanding;
