import React, { useState } from 'react';
import { MdRefresh } from 'react-icons/md';

interface RefreshButtonProps {
  onRefresh: () => Promise<any>;
  loading?: boolean;
  className?: string;
  iconSize?: number;
  minimumSpinTime?: number; // Minimum dönme süresi (ms)
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  loading = false,
  className = '',
  iconSize = 24,
  minimumSpinTime = 1000, // Varsayılan olarak 1 saniye
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    try {
      setIsSpinning(true);

      // Her iki promise'i de başlat
      const refreshPromise = onRefresh();
      const delayPromise = new Promise((resolve) =>
        setTimeout(resolve, minimumSpinTime)
      );

      // İkisinin de tamamlanmasını bekle
      await Promise.all([refreshPromise, delayPromise]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleClick}
        disabled={loading || isSpinning}
        className={`
          w-10 h-10 
          items-center 
          justify-center 
          flex 
          bg-blue-500 
          text-white 
          rounded 
          hover:bg-blue-600 
          disabled:bg-blue-300 
          transition-all 
          duration-200
          ${className}
        `}
        type="button"
      >
        <MdRefresh
          size={iconSize}
          className={`
            transition-transform 
            ${isSpinning || loading ? 'animate-spin' : ''} 
            ${isSpinning || loading ? 'animate-[spin_1s_linear_infinite]' : ''}
          `}
        />
      </button>
    </div>
  );
};

export default RefreshButton;
