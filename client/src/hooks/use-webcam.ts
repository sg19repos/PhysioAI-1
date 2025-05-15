import { useRef, useState, useCallback, useEffect } from 'react';

interface WebcamHookResult {
  videoReady: boolean;
  videoError: string | null;
  startWebcam: () => Promise<void>;
  stopWebcam: () => void;
}

export const useWebcam = (
  webcamRef: React.RefObject<HTMLVideoElement>
): WebcamHookResult => {
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [browserSupportsMediaDevices, setBrowserSupportsMediaDevices] = useState<boolean>(true);

  // Check if browser supports getUserMedia
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setBrowserSupportsMediaDevices(false);
      setVideoError("Your browser doesn't support camera access. Please try a different browser.");
      console.error("getUserMedia is not supported in this browser");
    } else {
      setBrowserSupportsMediaDevices(true);
    }
  }, []);
  
  const startWebcam = useCallback(async () => {
    // Clear previous errors
    setVideoError(null);

    // Check for browser support first
    if (!browserSupportsMediaDevices) {
      setVideoError("Your browser doesn't support camera access. Please try Chrome, Firefox, or Edge.");
      return;
    }

    if (!webcamRef.current) {
      setVideoError("Video element is not initialized");
      return;
    }

    try {
      // First stop any existing streams to avoid conflicts
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }

      // Try with ideal settings first, fall back to basic if needed
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
      } catch (err) {
        console.log("First camera attempt failed, trying basic settings");
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      // Store stream reference and connect to video element
      streamRef.current = stream;
      webcamRef.current.srcObject = stream;
      
      // Add error event listener
      webcamRef.current.onerror = (event) => {
        console.error('Video element error:', event);
        setVideoError("Error with video playback");
      };

      // Set up event handling for video loaded and playing
      await new Promise<void>((resolve, reject) => {
        if (!webcamRef.current) {
          return reject(new Error("Video element not available"));
        }
        
        // Wait for metadata to load
        webcamRef.current.onloadedmetadata = async () => {
          if (webcamRef.current) {
            try {
              // Try to play the video
              await webcamRef.current.play();
              setVideoReady(true);
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        };
        
        // Set a timeout in case loading takes too long
        setTimeout(() => {
          reject(new Error("Video loading timed out"));
        }, 10000);
      });
      
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.name === 'NotAllowedError' 
        ? "Camera access denied. Please allow camera access in your browser settings."
        : `Camera error: ${error.message}`;
      
      setVideoError(errorMessage);
      console.error('Camera access error:', error);
    }
  }, [webcamRef, browserSupportsMediaDevices]);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (webcamRef.current) {
      webcamRef.current.srcObject = null;
    }
    
    setVideoReady(false);
  }, [webcamRef]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoReady,
    videoError,
    startWebcam,
    stopWebcam
  };
};