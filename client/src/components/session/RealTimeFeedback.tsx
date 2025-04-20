import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  id: string;
  type: 'error' | 'warning' | 'success';
  title: string;
  description: string;
  timestamp: Date;
}

interface RealTimeFeedbackProps {
  postureFeedback?: { part: string; message: string; severity: string } | null;
}

const RealTimeFeedback: React.FC<RealTimeFeedbackProps> = ({ postureFeedback }) => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: '1',
      type: 'success',
      title: 'Good range of motion',
      description: 'Right arm showing improved ROM compared to last session',
      timestamp: new Date()
    }
  ]);
  
  // Add posture feedback to the list when it changes
  useEffect(() => {
    if (postureFeedback) {
      const newItem: FeedbackItem = {
        id: Date.now().toString(),
        type: postureFeedback.severity === 'medium' ? 'warning' : 'error',
        title: `${postureFeedback.part.split('_').join(' ')} needs correction`,
        description: postureFeedback.message,
        timestamp: new Date()
      };
      
      // Add to beginning of array
      setFeedbackItems(prevItems => [newItem, ...prevItems.slice(0, 2)]);
    }
  }, [postureFeedback]);
  
  // Periodically add positive feedback
  useEffect(() => {
    const interval = setInterval(() => {
      const goodFeedback = [
        {
          title: 'Good posture maintained',
          description: 'Keep up the consistent form throughout the movement'
        },
        {
          title: 'Smooth movement pattern',
          description: 'Exercise performed with good control and timing'
        },
        {
          title: 'Full range of motion achieved',
          description: 'Excellent mobility shown during this repetition'
        }
      ];
      
      // Only add positive feedback occasionally and if no recent errors
      const noRecentErrors = !feedbackItems.some(item => 
        item.type === 'error' && 
        new Date().getTime() - item.timestamp.getTime() < 5000
      );
      
      if (noRecentErrors && Math.random() < 0.3) {
        const randomFeedback = goodFeedback[Math.floor(Math.random() * goodFeedback.length)];
        const newItem: FeedbackItem = {
          id: Date.now().toString(),
          type: 'success',
          title: randomFeedback.title,
          description: randomFeedback.description,
          timestamp: new Date()
        };
        
        setFeedbackItems(prevItems => [newItem, ...prevItems.slice(0, 2)]);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [feedbackItems]);
  
  // Sort by timestamp, newest first
  const sortedFeedback = [...feedbackItems].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  ).slice(0, 3);
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedFeedback.map((item) => (
            <div key={item.id} className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-neutral-900">{item.title}</h4>
                <p className="mt-1 text-xs text-neutral-500">{item.description}</p>
              </div>
            </div>
          ))}
          
          {sortedFeedback.length === 0 && (
            <div className="text-center py-4 text-neutral-500">
              <p>No feedback available yet</p>
              <p className="text-xs mt-1">Start an exercise to receive real-time feedback</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeFeedback;
