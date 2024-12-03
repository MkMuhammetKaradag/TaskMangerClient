import { FC } from 'react';
import Tab from './Tab';


const TabBar: FC<{
  activeTab: string;
  tabs: {
    label: string;
    value: string;
    visible?: boolean;
  }[];
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="flex justify-center space-x-3 border-b border-gray-300 py-2">
      <div className="flex w-full justify-between border-gray-700 mb-4">
        {tabs
          .filter((tab) => {
            if (tab.visible == false) {
              return false;
            }
            return true;
          })
          .map((tab) => (
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
