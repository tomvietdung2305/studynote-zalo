import { BottomNavigation, Icon } from 'zmp-ui';
import { useAppNavigation, type PageName } from '@/context/AppContext';
import { useState, useEffect } from 'react';

export function Navigation() {
  const { currentPage, navigateTo } = useAppNavigation();
  const [activeTab, setActiveTab] = useState<PageName>('dashboard');

  useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);

  return (
    <BottomNavigation
      fixed
      activeKey={activeTab}
      onChange={(key) => navigateTo(key as PageName)}
    >
      <BottomNavigation.Item
        key="dashboard"
        label="Dashboard"
        icon={<Icon icon="zi-home" />}
        activeIcon={<Icon icon="zi-home" />}
      />
      <BottomNavigation.Item
        key="quick-attendance"
        label="Điểm Danh"
        icon={<Icon icon="zi-group" />}
        activeIcon={<Icon icon="zi-group-solid" />}
      />
      <BottomNavigation.Item
        key="grades-input"
        label="Sổ Điểm"
        icon={<Icon icon="zi-edit-text" />}
        activeIcon={<Icon icon="zi-edit-text-solid" />}
      />
      <BottomNavigation.Item
        key="broadcast-message"
        label="Thông Báo"
        icon={<Icon icon="zi-chat" />}
        activeIcon={<Icon icon="zi-chat-solid" />}
      />
    </BottomNavigation>
  );
}
