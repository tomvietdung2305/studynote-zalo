import { Box, Text, Icon } from 'zmp-ui';
import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'zi-inbox', title, description, action }: EmptyStateProps) {
  return (
    <Box className="flex flex-col items-center justify-center py-12 px-4">
      <Icon icon={icon} className="text-5xl mb-4 text-gray-300" />
      <Text.Title className="text-center mb-2">{title}</Text.Title>
      {description && (
        <Text className="text-center text-gray-500 mb-4">{description}</Text>
      )}
      {action && <div>{action}</div>}
    </Box>
  );
}
