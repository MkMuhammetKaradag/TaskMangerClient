import { FC } from 'react';

interface TabProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 flex-1 py-2 ${
      isActive ? 'border-b-2 border-gray-500' : ''
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Tab;
