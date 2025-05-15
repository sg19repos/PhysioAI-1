import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

type WelcomeSectionProps = {
  userId: number;
};

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userId }) => {
  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  // Fetch sessions data
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: [`/api/sessions/patient/${userId}`],
  });

  // Fetch progress data
  const { data: progressRecords, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/progress/${userId}`],
  });

  // Fetch engagement metrics
  const { data: engagementMetrics, isLoading: engagementLoading } = useQuery({
    queryKey: [`/api/engagement/${userId}`],
  });

  const isLoading = userLoading || sessionsLoading || progressLoading || engagementLoading;

  // Find today's session if there is one
  const todaySession = sessions?.find(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  // Format session time
  const formatSessionTime = (timeString?: string) => {
    if (!timeString) return "Not scheduled";
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Calculate recovery progress
  const recoveryProgress = progressRecords && progressRecords.length > 0 
    ? Math.round((progressRecords[0].rangeOfMotion || 0) / 180 * 100) 
    : 0;

  // Calculate session completion
  const sessionsCompleted = engagementMetrics && engagementMetrics.length > 0 
    ? engagementMetrics[0].sessionsCompleted 
    : 0;

  const totalSessions = 24; // This could be fetched from an API
  const sessionsPercentage = Math.round((sessionsCompleted / totalSessions) * 100);

  return (
    <div className="mb-8 bg-gradient-to-r from-primary to-primary-dark rounded-xl overflow-hidden shadow-md">
      <div className="p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading">
              Welcome back, {userLoading ? "..." : user?.fullName?.split(' ')[0] || "User"}!
            </h1>
            <p className="mt-2 text-blue-100">
              {todaySession 
                ? `You have a session scheduled today at ${formatSessionTime(todaySession.startTime)}`
                : "You have no sessions scheduled for today"}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/session">
              <Button className="bg-white text-primary hover:bg-blue-50 font-medium transition-colors">
                Start Session
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Recovery Progress</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold">{isLoading ? "..." : `${recoveryProgress}%`}</span>
              <span className="ml-2 text-green-300 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                12%
              </span>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Sessions Completed</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold">
                {isLoading ? "..." : `${sessionsCompleted}/${totalSessions}`}
              </span>
              <span className="ml-2 text-blue-100 text-sm">
                {isLoading ? "..." : `${sessionsPercentage}%`}
              </span>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Est. Full Recovery</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold">4 Weeks</span>
              <span className="ml-2 text-green-300 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Early
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
