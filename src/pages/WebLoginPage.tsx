/**
 * Simple Web Login Page
 * Plain HTML/CSS login page for web environment
 */

import React, { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

export const WebLoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if already logged in
    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleDevLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('[WebLogin] Starting dev login...');

            const result = await authService.devLogin();
            console.log('[WebLogin] Login successful:', result);

            // Set authenticated state
            setIsAuthenticated(true);

            // Show success message briefly before reload
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (err: any) {
            console.error('[WebLogin] Login failed:', err);
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // If authenticated, show dashboard message
    if (isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '48px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#48bb78',
                        borderRadius: '50%',
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px'
                    }}>
                        ✅
                    </div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#1a202c', marginBottom: '16px' }}>
                        Đăng nhập thành công!
                    </h1>
                    <p style={{ margin: 0, color: '#718096', fontSize: '16px', lineHeight: '1.6' }}>
                        Bạn đã đăng nhập vào chế độ Web Demo.<br />
                        Để sử dụng đầy đủ tính năng, vui lòng truy cập qua Zalo Mini App.
                    </p>
                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>
                            <strong>Lưu ý:</strong> Phiên bản web chỉ hỗ trợ xem dữ liệu cơ bản.
                            Các tính năng như điểm danh, gửi thông báo chỉ khả dụng trong Zalo Mini App.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '48px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px'
                    }}>
                        📚
                    </div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#1a202c' }}>StudyNote</h1>
                    <p style={{ margin: '8px 0 0', color: '#718096' }}>Sổ Liên Lạc Điện Tử</p>
                </div>

                <div style={{
                    background: '#f7fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0'
                }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
                        <strong>Chế độ Web Demo</strong><br />
                        Để trải nghiệm đầy đủ tính năng, vui lòng sử dụng ứng dụng trong Zalo Mini App.
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fff5f5',
                        border: '1px solid #fc8181',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px',
                        color: '#c53030',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleDevLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '16px'
                    }}
                >
                    {loading ? 'Đang đăng nhập...' : '🔧 Dev Login (Demo)'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0' }}>
                        Phiên bản Web - Chỉ dùng để demo
                    </p>
                </div>
            </div>
        </div>
    );
};

