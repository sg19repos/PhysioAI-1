import { useRef, useEffect, useState } from 'react';
import { useWebcam } from '@/hooks/use-webcam';
import { useMotionDetection } from '@/hooks/use-motion-detection';
import { Button } from '@/components/ui/button';
import SkeletonOverlay from './SkeletonOverlay';
import { AlertCircle, Camera, XCircle, Eye, EyeOff } from 'lucide-react';

interface MotionTrackerProps {
  onPoseDetected?: (poses: any) => void;
  showControls?: boolean;
  autoStart?: boolean;
  width?: number | string;
  height?: number | string;
  showJointDetails?: boolean;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({
  onPoseDetected,
  showControls = true,
  autoStart = false,
  width = '100%',
  height = '100%',
  showJointDetails = true
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(autoStart);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const { videoReady, videoError, startWebcam, stopWebcam } = useWebcam(webcamRef);
  const { 
    poses, 
    isDetecting, 
    showDetails,
    toggleDetails,
    startPoseDetection, 
    stopPoseDetection 
  } = useMotionDetection(webcamRef, canvasRef);

  // Pass detected poses to parent component if needed
  useEffect(() => {
    if (onPoseDetected && poses) {
      onPoseDetected(poses);
    }
  }, [poses, onPoseDetected]);

  // Manually initiate webcam startup
  const initializeCamera = async () => {
    try {
      setCameraInitializing(true);
      await startWebcam();
      setCameraInitializing(false);
    } catch (error) {
      console.error("Failed to initialize camera:", error);
      setCameraInitializing(false);
    }
  };
  
  // Handle camera activation/deactivation
  useEffect(() => {
    if (isActive) {
      // Start the webcam immediately
      initializeCamera();
    } else {
      // Stop everything when deactivated
      stopWebcam();
      stopPoseDetection();
    }

    // Cleanup on unmount
    return () => {
      stopWebcam();
      stopPoseDetection();
    };
  }, [isActive, stopWebcam, stopPoseDetection]);

  useEffect(() => {
    if (videoReady && isActive) {
      startPoseDetection();
    }
  }, [videoReady, isActive, startPoseDetection]);

  const toggleTracking = async () => {
    if (!isActive) {
      setCameraInitializing(true);
      setIsActive(true);
      try {
        // Try to directly initialize the camera to speed things up
        await startWebcam();
      } catch (error) {
        console.error("Error in toggleTracking:", error);
      }
    } else {
      setIsActive(false);
      stopWebcam();
      stopPoseDetection();
    }
  };

  // Handle autoStart prop change
  useEffect(() => {
    // Only run on initial render or when autoStart changes
    if (autoStart && !isActive) {
      // Start camera and set state accordingly
      setCameraInitializing(true);
      setIsActive(true);
      
      // Early direct camera initialization
      (async () => {
        try {
          await startWebcam();
        } catch (error) {
          console.error("Failed to auto-start camera:", error);
        } finally {
          setCameraInitializing(false);
        }
      })();
    }
  }, [autoStart, isActive, startWebcam]);

  return (
    <div className="relative" style={{ width, height }}>
      <div className="webcam-container relative aspect-video bg-black rounded-lg overflow-hidden">
        {isActive ? (
          <>
            <video
              ref={webcamRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <SkeletonOverlay 
              canvasRef={canvasRef}
              showDetails={showDetails}
              onToggleDetails={toggleDetails}
            />
            
            {/* Overlay status messages */}
            {!videoReady && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-center text-white p-4 rounded">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="mb-2">Initializing camera...</p>
                  <p className="text-xs text-gray-300">You may need to allow camera access in your browser</p>
                </div>
              </div>
            )}
            
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-center text-white max-w-md p-6 rounded bg-red-900 bg-opacity-40">
                  <XCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
                  <h3 className="text-lg font-medium mb-2">Camera Access Error</h3>
                  <p className="mb-4 text-sm opacity-90">
                    {videoError.includes("denied") || videoError.includes("permission")
                      ? "Please allow camera access to use motion tracking features. You might need to check your browser settings."
                      : videoError.includes("browser") 
                        ? videoError
                        : "There was a problem accessing your camera. Please check your device and try again."}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={toggleTracking} variant="outline" className="border-white text-white hover:bg-white hover:text-red-800">
                      Try Again
                    </Button>
                    <p className="text-xs mt-2">
                      Note: Motion tracking requires a camera. If you're using a device without a camera or in an environment 
                      where camera access is restricted, some features may not work.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {videoReady && !isDetecting && (
              <div className="absolute top-0 left-0 m-2 px-3 py-1 bg-yellow-500 text-black text-xs rounded">
                <div className="flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Initializing motion tracking...
                </div>
              </div>
            )}
            
            {isDetecting && (
              <div className="absolute top-0 left-0 m-2 px-3 py-1 bg-green-500 text-black text-xs rounded">
                <div className="flex items-center">
                  <div className="h-2 w-2 mr-1 rounded-full bg-green-900 animate-pulse"></div>
                  Motion tracking active
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-6 max-w-md">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-60" />
              <h3 className="text-xl font-medium mb-2">Motion Analysis</h3>
              <p className="mb-6 opacity-80">Enable your camera to start real-time posture analysis and exercise tracking</p>
              <Button onClick={toggleTracking} size="lg">
                {cameraInitializing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Starting Camera...
                  </>
                ) : (
                  <>Enable Camera</>
                )}
              </Button>
            </div>
          </div>
        )}

        {showControls && isActive && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 text-gray-800"
              onClick={toggleTracking}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Stop Camera
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotionTracker;
