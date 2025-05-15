import React, { useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SkeletonOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  color?: string;
  showDetails?: boolean;
  onToggleDetails?: () => void;
}

const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({ 
  canvasRef,
  color = "#1976D2",
  showDetails = true,
  onToggleDetails
}) => {
  useEffect(() => {
    // Set canvas dimensions to match its container size when it loads
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
    }

    // Update canvas size on resize
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full skeleton-overlay"
      />
      {onToggleDetails && (
        <button 
          onClick={onToggleDetails}
          className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full hover:bg-opacity-80 transition-opacity flex items-center"
        >
          {showDetails ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Show Details
            </>
          )}
        </button>
      )}
    </>
  );
};

export default SkeletonOverlay;
