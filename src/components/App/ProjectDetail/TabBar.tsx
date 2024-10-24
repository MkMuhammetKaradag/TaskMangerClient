import { FC } from 'react';
import Tab from './Tab';

const TabBar: FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { label: 'Project', value: 'project' },
    { label: 'Team', value: 'team' },
    { label: 'TaskSummary', value: 'taskSummary' },
  ];

  return (
    <div className="flex justify-center space-x-3 border-b border-gray-300 py-2">
      <div className="flex w-full justify-between border-gray-700 mb-4">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default TabBar;
