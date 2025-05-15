import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MessageSquare, Video, CheckCircle, AlertCircle } from 'lucide-react';

const TherapistPage: React.FC = () => {
  const [messageContent, setMessageContent] = useState('');
  const userId = 1; // This would come from authentication context

  // Fetch therapist notes
  const { data: therapistNotes, isLoading: notesLoading } = useQuery({
    queryKey: [`/api/therapist-notes/${userId}`],
  });

  // Fetch user data to get therapist info
  const { data: therapistUser, isLoading: therapistLoading } = useQuery({
    queryKey: [`/api/users/2`], // Therapist ID (Dr. Rachel)
  });

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

  // Handle sending a message to therapist
  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    
    // In a real app, this would send the message to the therapist
    console.log("Sending message to therapist:", messageContent);
    
    // Clear the input
    setMessageContent('');
  };

  return (
    <DashboardLayout title="Therapist Notes">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Therapist Communication</h1>
        <p className="text-neutral-600">
          Review notes from your therapist and communicate directly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Therapist</CardTitle>
            </CardHeader>
            <CardContent>
              {therapistLoading ? (
                <div className="flex flex-col items-center py-4 animate-pulse">
                  <div className="h-20 w-20 rounded-full bg-gray-200 mb-4"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
                      {therapistUser?.fullName?.split(' ').map(n => n[0]).join('') || 'DR'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{therapistUser?.fullName || 'Dr. Rachel Stevens'}</h3>
                  <p className="text-neutral-600 text-sm">Physical Therapist</p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <Button className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Video className="mr-2 h-4 w-4" />
                          Schedule Video Call
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule Video Consultation</DialogTitle>
                          <DialogDescription>
                            Choose a date and time for your video consultation with Dr. Rachel Stevens.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Available Slots</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                Today, 3:00 PM
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                Today, 4:30 PM
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                Tomorrow, 2:00 PM
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                Tomorrow, 3:30 PM
                              </Button>
                            </div>
                          </div>
                          <Button className="w-full">Schedule Consultation</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-primary/5 border-primary">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <p className="font-medium">Today, 3:00 PM</p>
                  </div>
                  <p className="text-sm text-neutral-600">Regular Therapy Session</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-neutral-600" />
                    <p className="font-medium">May 25, 3:00 PM</p>
                  </div>
                  <p className="text-sm text-neutral-600">Regular Therapy Session</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Video className="h-4 w-4 mr-2 text-neutral-600" />
                    <p className="font-medium">May 27, 2:30 PM</p>
                  </div>
                  <p className="text-sm text-neutral-600">Video Consultation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="notes">
            <TabsList className="mb-4">
              <TabsTrigger value="notes">Therapist Notes</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notes & Recommendations</CardTitle>
                  <CardDescription>
                    Notes and feedback from your therapist about your rehabilitation progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notesLoading ? (
                    <div className="space-y-6 animate-pulse">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : therapistNotes && therapistNotes.length > 0 ? (
                    <div className="space-y-8">
                      {therapistNotes.map((note) => (
                        <div key={note.id} className="pb-6 border-b last:border-b-0 last:pb-0">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-lg mr-4">
                              DR
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-neutral-800">Dr. Rachel Stevens</h3>
                                <span className="text-neutral-500 text-sm ml-2">{formatDate(note.date)}</span>
                              </div>
                              <div className="mt-2 text-neutral-700 whitespace-pre-line">
                                {note.notes.split("\n").map((paragraph, index) => (
                                  <p key={index} className={index > 0 ? "mt-2" : ""}>
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                              <div className="mt-4 flex flex-wrap">
                                {renderBadges(note.flags)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-neutral-600">No therapist notes available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Send and receive messages from your therapist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-sm mr-2 flex-shrink-0">
                            DR
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">Hi John, how is your shoulder feeling after yesterday's session?</p>
                            <p className="text-xs text-neutral-500 mt-1">10:30 AM</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start justify-end">
                          <div className="bg-primary text-white rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">Hi Dr. Rachel, it's feeling better today. Still a bit sore but the pain is less intense.</p>
                            <p className="text-xs text-primary-foreground mt-1">10:45 AM</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm ml-2 flex-shrink-0">
                            JD
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-sm mr-2 flex-shrink-0">
                            DR
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">That's good to hear! Make sure to apply ice if the soreness continues. Did you complete the pendulum exercises this morning?</p>
                            <p className="text-xs text-neutral-500 mt-1">11:02 AM</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start justify-end">
                          <div className="bg-primary text-white rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">Yes, I did them as soon as I woke up. I also tried the new scapular retraction exercise you recommended, but I'm not sure if I'm doing it correctly.</p>
                            <p className="text-xs text-primary-foreground mt-1">11:10 AM</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm ml-2 flex-shrink-0">
                            JD
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-sm mr-2 flex-shrink-0">
                            DR
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">I can show you the proper technique during our session today. Remember to focus on squeezing your shoulder blades together, not just pulling your shoulders back.</p>
                            <p className="text-xs text-neutral-500 mt-1">11:15 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Textarea
                        placeholder="Type your message here..."
                        className="flex-1 min-h-[80px] resize-none"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                      />
                      <Button className="ml-2 h-10" onClick={handleSendMessage}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TherapistPage;
