// SearchPanel.tsx
import React, { useCallback, useEffect, useState } from 'react';
import SlidingPanel from './SlidingPanel';

import { useLazyQuery } from '@apollo/client';

import { Link } from 'react-router-dom';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <SlidingPanel isOpen={isOpen} position="left">
      <div className="flex  items-center mb-4 border border-gray-700 rounded">
        <input
          type="text"
          placeholder="Ara"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-900 text-white"
        />
      </div>
      {/* Arama sonuçları */}
      <div className="flex-grow  overflow-y-auto"></div>
    </SlidingPanel>
  );
};

export default SearchPanel;
