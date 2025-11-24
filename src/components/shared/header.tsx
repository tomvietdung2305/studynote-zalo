import { Box, Header as ZaHeader, Icon, Text } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  action?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  onBack,
  onMenu,
  action,
}: HeaderProps) {
  const { goBack } = useAppNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <ZaHeader
      className="sticky top-0 left-0 right-0 z-50"
      title={title}
      subtitle={subtitle}
      showBackIcon={showBack}
      onBackClick={handleBack}
    >
      <ZaHeader.Actions>
        {action && <div className="mr-2">{action}</div>}
        {showMenu && (
          <button onClick={onMenu} className="p-2 hover:bg-gray-100 rounded">
            <Icon icon="zi-more-2" />
          </button>
        )}
      </ZaHeader.Actions>
    </ZaHeader>
  );
}
