import React, { useState } from 'react';
import { Box, Text, Button, Sheet, Icon } from 'zmp-ui';
import { zaloAdapter } from '@/adapters';

interface FollowOABannerProps {
    variant: 'inline' | 'modal' | 'hero';
    message: string;
    onFollow?: () => void;
    onDismiss?: () => void;
}

/**
 * Follow OA Banner Component
 * 
 * Encourages users to follow the Official Account with different presentation styles
 * 
 * @param variant - Display style: 'inline' (banner), 'modal' (popup), 'hero' (large banner)
 * @param message - Value proposition message
 */
export function FollowOABanner({
    variant,
    message,
    onFollow,
    onDismiss
}: FollowOABannerProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(variant === 'modal');

    const handleFollow = async () => {
        try {
            setIsFollowing(true);
            await zaloAdapter.followOA();

            if (onFollow) {
                onFollow();
            }

            if (variant === 'modal') {
                setShowModal(false);
            }
        } catch (error) {
            console.error('Follow OA failed:', error);
        } finally {
            setIsFollowing(false);
        }
    };

    const handleDismiss = () => {
        if (variant === 'modal') {
            setShowModal(false);
        }
        if (onDismiss) {
            onDismiss();
        }
    };

    // Inline banner variant
    if (variant === 'inline') {
        return (
            <Box className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="bg-white rounded-full p-2">
                            📢
                        </div>
                        <div className="flex-1">
                            <Text size="small" className="font-medium text-gray-900 mb-1">
                                {message}
                            </Text>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Icon icon="zi-star" className="text-white text-sm" />
                                </div>
                                <Text size="xSmall" className="text-gray-600">
                                    Sổ Liên Lạc Thông Minh
                                </Text>
                            </div>
                        </div>
                    </div>
                    <Button
                        size="small"
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleFollow}
                        loading={isFollowing}
                    >
                        Quan tâm
                    </Button>
                </div>
            </Box>
        );
    }

    // Hero banner variant
    if (variant === 'hero') {
        return (
            <Box className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <Text.Title className="text-white mb-2">
                            Quan tâm OA để trải nghiệm tốt nhất!
                        </Text.Title>
                        <Text className="text-blue-100 mb-4">
                            {message}
                        </Text>
                        <Button
                            size="medium"
                            className="bg-white text-blue-600 font-semibold"
                            onClick={handleFollow}
                            loading={isFollowing}
                        >
                            Quan tâm ngay
                        </Button>
                    </div>
                    <div className="text-6xl">
                        🎁
                    </div>
                </div>
            </Box>
        );
    }

    // Modal variant
    if (variant === 'modal') {
        return (
            <Sheet
                visible={showModal}
                onClose={handleDismiss}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box className="p-6 text-center">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Icon icon="zi-star" className="text-blue-500 text-2xl" />
                        </div>
                        <Text.Title className="mb-2">
                            Quan tâm OA Sổ Liên Lạc
                        </Text.Title>
                        <Text className="text-gray-600">
                            {message}
                        </Text>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <Icon icon="zi-star" className="text-white" />
                            </div>
                            <div className="text-left flex-1">
                                <Text className="font-semibold">Sổ Liên Lạc Thông Minh</Text>
                                <Text size="xSmall" className="text-gray-500">Official Account</Text>
                            </div>
                        </div>
                    </div>

                    <Text size="xSmall" className="text-gray-500 mb-4">
                        Bằng cách nhấn "Quan tâm", tôi đồng ý với{' '}
                        <span className="text-blue-500">điều khoản sử dụng của Zalo</span>
                    </Text>

                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={handleDismiss}
                        >
                            Để sau
                        </Button>
                        <Button
                            className="flex-1 bg-blue-500"
                            onClick={handleFollow}
                            loading={isFollowing}
                        >
                            Quan tâm
                        </Button>
                    </div>
                </Box>
            </Sheet>
        );
    }

    return null;
}
