import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  value: number;
  color?: 'green' | 'yellow' | 'red' | string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  value, 
  color = 'green' 
}) => {
  const getColorClass = () => {
    if (typeof color === 'string') {
      switch (color) {
        case 'green':
          return 'bg-green-500';
        case 'yellow':
          return 'bg-yellow-500';
        case 'red':
          return 'bg-red-500';
        default:
          return color.startsWith('#') || color.startsWith('rgb') 
            ? color // Custom color
            : 'bg-primary'; // Default to primary color
      }
    }
    return 'bg-primary';
  };

  const colorClass = getColorClass();
  const percentage = Math.min(Math.max(value, 0), 100); // Clamp between 0 and 100

  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden progress-indicator">
      <div 
        className={cn(
          "h-full rounded-full progress-bar",
          typeof colorClass === 'string' && colorClass.startsWith('bg-') 
            ? colorClass 
            : 'bg-primary'
        )}
        style={{ 
          width: `${percentage}%`,
          ...(typeof colorClass === 'string' && !colorClass.startsWith('bg-') 
            ? { backgroundColor: colorClass } 
            : {})
        }}
      />
    </div>
  );
};

export default ProgressIndicator;
