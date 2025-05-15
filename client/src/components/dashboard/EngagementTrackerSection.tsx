import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EngagementView = "weekly" | "monthly";

type EngagementTrackerSectionProps = {
  userId: number;
};

const EngagementTrackerSection: React.FC<EngagementTrackerSectionProps> = ({ userId }) => {
  const [view, setView] = useState<EngagementView>("weekly");
  
  // Fetch engagement data
  const { data: engagementMetrics, isLoading } = useQuery({
    queryKey: [`/api/engagement/${userId}`],
  });
  
  // Get latest metrics
  const latestMetrics = engagementMetrics?.[0];
  
  // Get weekday names
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Check if a day is checked in (this would come from the API)
  const isCheckedIn = (day: string) => {
    const checkedInDays = ["Mon", "Tue", "Wed", "Thu"];
    return checkedInDays.includes(day);
  };
  
  // Get sessions (this would come from the API)
  const sessions = [
    { 
      name: "Shoulder Program", 
      date: "Thu, May 18", 
      time: "3:00 PM", 
      status: "completed"
    },
    { 
      name: "Shoulder Program", 
      date: "Wed, May 17", 
      time: "3:15 PM", 
      status: "completed"
    },
    { 
      name: "Shoulder Program", 
      date: "Tue, May 16", 
      time: "3:00 PM", 
      status: "missed"
    }
  ];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-neutral-800">Your Engagement</h2>
        <div className="flex items-center text-sm">
          <span className="text-neutral-600 mr-2">View:</span>
          <Button 
            variant={view === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("weekly")}
          >
            Weekly
          </Button>
          <Button 
            variant={view === "monthly" ? "default" : "outline"}
            size="sm"
            className="ml-2"
            onClick={() => setView("monthly")}
          >
            Monthly
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-medium text-neutral-800">Weekly Score</h3>
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray={`${isLoading ? 0 : latestMetrics?.weeklyScore || 85}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-600">
                      {isLoading ? "--" : latestMetrics?.weeklyScore || 85}
                    </span>
                    <span className="text-sm text-neutral-600 block">points</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-green-600 font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +12 from last week
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-heading font-medium text-neutral-800">Check-in Streak</h3>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {weekdays.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-neutral-500 mb-1">{day}</p>
                  <div className={cn(
                    "h-10 w-10 mx-auto rounded-full flex items-center justify-center",
                    isCheckedIn(day) 
                      ? "bg-green-500" 
                      : "bg-gray-200"
                  )}>
                    {isCheckedIn(day) ? (
                      <CheckIcon className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-neutral-500 font-medium">{day.substring(0, 1)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-bold text-primary">
                {isLoading ? "--" : latestMetrics?.checkInStreak || 4} Day Streak!
              </p>
              <p className="text-sm text-neutral-600">Keep it up to earn bonus points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-heading font-medium text-neutral-800">Session Completion</h3>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-neutral-700 mb-1">
                <span>This Week</span>
                <span className="font-medium">4/5 sessions</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex justify-between text-sm text-neutral-700 mb-1 mt-3">
                <span>Last Week</span>
                <span className="font-medium">3/5 sessions</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Recent Sessions</h4>
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex justify-between items-center p-2 rounded-md",
                        session.status === "completed" ? "bg-green-50" : "bg-red-50"
                      )}
                    >
                      <div>
                        <p className="font-medium text-neutral-800">{session.name}</p>
                        <p className="text-xs text-neutral-500">{session.date} • {session.time}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded",
                        session.status === "completed" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      )}>
                        {session.status === "completed" ? "Completed" : "Missed"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngagementTrackerSection;
