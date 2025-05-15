import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

type TherapistFeedbackSectionProps = {
  userId: number;
};

const TherapistFeedbackSection: React.FC<TherapistFeedbackSectionProps> = ({ userId }) => {
  // Fetch therapist notes
  const { data: therapistNotes, isLoading } = useQuery({
    queryKey: [`/api/therapist-notes/${userId}`],
  });
  
  // Get the most recent note
  const latestNote = therapistNotes?.[0];
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Render note badges based on flags
  const renderBadges = (flags?: string[]) => {
    if (!flags || flags.length === 0) return null;
    
    return flags.map((flag, index) => {
      let icon = <CheckCircle className="h-4 w-4 mr-1" />;
      let className = "bg-blue-100 text-primary";
      
      if (flag.includes("progress")) {
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        className = "bg-blue-100 text-primary";
      } else if (flag.includes("new exercise")) {
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        className = "bg-green-100 text-green-700";
      } else if (flag.includes("posture") || flag.includes("correction")) {
        icon = <AlertCircle className="h-4 w-4 mr-1" />;
        className = "bg-yellow-100 text-yellow-800";
      }
      
      return (
        <Badge key={index} variant="outline" className={`mr-2 mb-2 ${className} flex items-center`}>
          {icon}
          {flag}
        </Badge>
      );
    });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-neutral-800">Therapist Notes & Recommendations</h2>
        <Link href="/therapist">
          <Button variant="ghost" className="text-primary font-medium flex items-center">
            <MessageSquare className="h-5 w-5 mr-1" />
            Message Therapist
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col space-y-2 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : latestNote ? (
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-lg mr-4">
                DR
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-neutral-800">Dr. Rachel Stevens</h3>
                  <span className="text-neutral-500 text-sm ml-2">{formatDate(latestNote.date)}</span>
                </div>
                <div className="mt-2 text-neutral-700 whitespace-pre-line">
                  {latestNote.notes.split("\n").map((paragraph, index) => (
                    <p key={index} className={index > 0 ? "mt-2" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap">
                  {renderBadges(latestNote.flags)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-neutral-600">No therapist notes available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistFeedbackSection;
