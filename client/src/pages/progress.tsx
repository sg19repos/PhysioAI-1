import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProgressChart from '@/components/progress/ProgressChart';
import ProgressIndicator from '@/components/progress/ProgressIndicator';
import { ChevronRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';

type TimeRange = "week" | "month" | "all";

const ProgressPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const userId = 1; // This would come from authentication context

  // Fetch progress records
  const { data: progressRecords, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/progress/${userId}`],
  });

  // Fetch sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: [`/api/sessions/patient/${userId}`],
  });

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (!sessions) return { completed: 0, missed: 0, total: 0, rate: 0 };
    
    const completed = sessions.filter(s => s.status === 'completed').length;
    const missed = sessions.filter(s => s.status === 'missed').length;
    const total = sessions.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, missed, total, rate };
  };

  const completion = calculateCompletionRate();

  // Get latest progress values
  const getLatestProgress = () => {
    if (!progressRecords || progressRecords.length === 0) {
      return { rangeOfMotion: 0, postureQuality: 0, painLevel: 0 };
    }
    
    return {
      rangeOfMotion: progressRecords[0].rangeOfMotion || 0,
      postureQuality: progressRecords[0].postureQuality || 0,
      painLevel: progressRecords[0].painLevel || 0
    };
  };

  const latestProgress = getLatestProgress();

  // Calculate trend (improvement or decline)
  const calculateTrend = (field: 'rangeOfMotion' | 'postureQuality' | 'painLevel') => {
    if (!progressRecords || progressRecords.length < 2) return 0;
    
    const current = progressRecords[0][field] || 0;
    const previous = progressRecords[1][field] || 0;
    
    return field === 'painLevel' 
      ? previous - current // For pain, lower is better
      : current - previous; // For other metrics, higher is better
  };

  const trends = {
    rangeOfMotion: calculateTrend('rangeOfMotion'),
    postureQuality: calculateTrend('postureQuality'),
    painLevel: calculateTrend('painLevel')
  };

  // Format trend display with + or - sign
  const formatTrend = (value: number, inverse = false) => {
    const isPositive = inverse ? value < 0 : value > 0;
    const absValue = Math.abs(value);
    return isPositive ? `+${absValue}` : `-${absValue}`;
  };

  return (
    <DashboardLayout title="Progress Reports">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Progress Reports</h1>
        <p className="text-neutral-600">
          Track your recovery journey and analyze your improvements over time
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-neutral-800">Progress Dashboard</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Range of Motion</CardTitle>
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
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-neutral-600">Current</span>
                  <div className="font-medium text-lg flex items-center">
                    {latestProgress.rangeOfMotion}°
                    {trends.rangeOfMotion !== 0 && (
                      <Badge variant="outline" className={
                        trends.rangeOfMotion > 0 
                          ? 'bg-green-100 text-green-800 border-none ml-2' 
                          : 'bg-red-100 text-red-800 border-none ml-2'
                      }>
                        {trends.rangeOfMotion > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {formatTrend(trends.rangeOfMotion)}°
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-neutral-600">Goal</span>
                  <div className="font-medium text-lg">180°</div>
                </div>
              </div>
              <div className="mt-2">
                <ProgressIndicator 
                  value={(latestProgress.rangeOfMotion / 180) * 100} 
                  color="primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Posture Quality</CardTitle>
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
                  <p className="text-lg font-semibold text-green-600">
                    {latestProgress.postureQuality}%
                  </p>
                </div>
                <div className="bg-yellow-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-neutral-600">Fair</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {Math.round(100 - latestProgress.postureQuality - 5)}%
                  </p>
                </div>
                <div className="bg-red-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-neutral-600">Poor</p>
                  <p className="text-lg font-semibold text-red-600">5%</p>
                </div>
              </div>
              {trends.postureQuality !== 0 && (
                <div className="text-sm text-green-600 mt-2 font-medium flex items-center">
                  {trends.postureQuality > 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {trends.postureQuality > 0 ? (
                    `Improved ${trends.postureQuality}% since last measurement`
                  ) : (
                    `Decreased ${Math.abs(trends.postureQuality)}% since last measurement`
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pain Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ProgressChart 
                data={progressRecords?.map(record => ({
                  date: new Date(record.date),
                  value: record.painLevel || 0
                }))}
                timeRange={timeRange}
                dataKey="painLevel"
                color="#F44336"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-neutral-600">Current Pain Level</span>
                  <div className="font-medium text-lg flex items-center">
                    {latestProgress.painLevel}/10
                    {trends.painLevel !== 0 && (
                      <Badge variant="outline" className={
                        trends.painLevel > 0 
                          ? 'bg-green-100 text-green-800 border-none ml-2' 
                          : 'bg-red-100 text-red-800 border-none ml-2'
                      }>
                        {trends.painLevel > 0 ? (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {formatTrend(trends.painLevel, true)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-neutral-600">Target</span>
                  <div className="font-medium text-lg">0/10</div>
                </div>
              </div>
              <div className="mt-2">
                <ProgressIndicator 
                  value={((10 - latestProgress.painLevel) / 10) * 100} 
                  color="green"
                />
              </div>
              <p className="text-sm text-neutral-600 mt-2">
                {latestProgress.painLevel <= 3 
                  ? "Mild pain, manageable during activities" 
                  : latestProgress.painLevel <= 6
                  ? "Moderate pain, may limit some activities"
                  : "Severe pain, significantly limits activities"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Session Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative h-32 w-32">
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
                    stroke={completion.rate >= 80 ? "#4CAF50" : completion.rate >= 60 ? "#FFC107" : "#F44336"}
                    strokeWidth="3"
                    strokeDasharray={`${completion.rate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">
                    {Math.round(completion.rate)}%
                  </span>
                  <span className="text-sm text-neutral-600">completed</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-medium text-neutral-800">
                  {completion.completed}/{completion.total} sessions completed
                </p>
                <p className="text-sm text-neutral-600">
                  {completion.missed} sessions missed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recovery Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-center">
                <p className="text-sm text-neutral-600">AI Prediction</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  Full Recovery: Jul 18
                </p>
                <div className="inline-block bg-primary-light bg-opacity-10 text-primary rounded-full px-3 py-1 text-sm font-medium mt-2">
                  2 weeks early
                </div>
              </div>
              <div className="w-full mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">Overall Progress</span>
                  <span className="text-neutral-800 font-medium">76%</span>
                </div>
                <ProgressIndicator value={76} color="green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Consistency Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center text-white font-bold text-2xl">
                  A
                </div>
                <p className="text-2xl font-bold mt-3">85 points</p>
                <p className="text-sm text-neutral-600">Weekly Score</p>
              </div>
              <div className="w-full mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12 from last week
                  </span>
                  <span className="text-neutral-600">Top 10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-heading font-semibold text-neutral-800 mb-4">Progress History</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left whitespace-nowrap px-4 py-3 font-medium text-neutral-600">Date</th>
                    <th className="text-left whitespace-nowrap px-4 py-3 font-medium text-neutral-600">Range of Motion</th>
                    <th className="text-left whitespace-nowrap px-4 py-3 font-medium text-neutral-600">Posture Quality</th>
                    <th className="text-left whitespace-nowrap px-4 py-3 font-medium text-neutral-600">Pain Level</th>
                    <th className="text-left whitespace-nowrap px-4 py-3 font-medium text-neutral-600">Notes</th>
                    <th className="text-right whitespace-nowrap px-4 py-3 font-medium text-neutral-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {progressLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">Loading progress history...</td>
                    </tr>
                  ) : progressRecords && progressRecords.length > 0 ? (
                    progressRecords.map((record) => {
                      const recordDate = new Date(record.date);
                      
                      return (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3 font-medium">
                            {recordDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric', 
                              year: 'numeric'
                            })}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {record.rangeOfMotion ? `${record.rangeOfMotion}°` : '--'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {record.postureQuality ? `${record.postureQuality}%` : '--'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {record.painLevel !== undefined && record.painLevel !== null ? `${record.painLevel}/10` : '--'}
                          </td>
                          <td className="px-4 py-3 max-w-[300px] truncate">
                            {record.notes || 'No notes'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">No progress records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
