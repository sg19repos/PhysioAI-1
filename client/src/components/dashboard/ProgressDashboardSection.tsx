import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProgressChart from "../progress/ProgressChart";
import ProgressIndicator from "../progress/ProgressIndicator";

type TimeRange = "week" | "month" | "all";

type ProgressDashboardSectionProps = {
  userId: number;
};

const ProgressDashboardSection: React.FC<ProgressDashboardSectionProps> = ({ userId }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  // Fetch progress data
  const { data: progressRecords, isLoading } = useQuery({
    queryKey: [`/api/progress/${userId}`],
  });
  
  // These could come from the API, but for now we'll use static data
  const rangeOfMotionData = {
    current: 142,
    goal: 180,
    improvement: 12
  };
  
  const postureQualityData = {
    good: 72,
    fair: 23,
    poor: 5,
    improvement: 8
  };
  
  const recoveryData = {
    progress: 76,
    estimatedDate: "Jul 18",
    weeksEarly: 2
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-neutral-800">Your Progress Dashboard</h2>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("all")}
          >
            All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Range of Motion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ProgressChart 
                data={progressRecords?.map(record => ({
                  date: new Date(record.date),
                  value: record.rangeOfMotion || 0
                }))}
                timeRange={timeRange}
                dataKey="rangeOfMotion"
                color="#1976D2"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-neutral-700 mb-1">
                <span>Current</span>
                <span className="font-medium">{rangeOfMotionData.current}°</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-700 mb-1">
                <span>Goal</span>
                <span className="font-medium">{rangeOfMotionData.goal}°</span>
              </div>
              <ProgressIndicator 
                value={(rangeOfMotionData.current / rangeOfMotionData.goal) * 100} 
                color="green"
              />
              <p className="text-sm text-green-600 mt-2 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                Improved {rangeOfMotionData.improvement}° this month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Posture Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ProgressChart 
                data={progressRecords?.map(record => ({
                  date: new Date(record.date),
                  value: record.postureQuality || 0
                }))}
                timeRange={timeRange}
                dataKey="postureQuality"
                color="#4CAF50"
              />
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-green-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-neutral-600">Good</p>
                  <p className="text-lg font-semibold text-green-600">{postureQualityData.good}%</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-neutral-600">Fair</p>
                  <p className="text-lg font-semibold text-yellow-600">{postureQualityData.fair}%</p>
                </div>
                <div className="bg-red-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-neutral-600">Poor</p>
                  <p className="text-lg font-semibold text-red-600">{postureQualityData.poor}%</p>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                Improved {postureQualityData.improvement}% this month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recovery Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ProgressChart 
                data={progressRecords?.map((record, index, array) => ({
                  date: new Date(record.date),
                  value: ((array.length - index) / array.length) * 100
                }))}
                timeRange={timeRange}
                dataKey="recoveryTimeline"
                color="#FF5722"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-neutral-500">AI Prediction</p>
                  <p className="text-lg font-semibold text-primary">
                    Full Recovery: {recoveryData.estimatedDate}
                  </p>
                </div>
                <div className="bg-primary-light bg-opacity-10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                  {recoveryData.weeksEarly} weeks early
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">Overall Progress</span>
                  <span className="text-neutral-800 font-medium">{recoveryData.progress}%</span>
                </div>
                <ProgressIndicator value={recoveryData.progress} color="green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboardSection;
