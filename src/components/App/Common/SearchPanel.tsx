// SearchPanel.tsx
import React from 'react';
import SlidingPanel from './SlidingPanel';

import CompanySearch from '../Company/CompanySearch';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen }) => {
  return (
    <SlidingPanel isOpen={isOpen} position="left">
      <CompanySearch></CompanySearch>
    </SlidingPanel>
  );
};

export default SearchPanel;
