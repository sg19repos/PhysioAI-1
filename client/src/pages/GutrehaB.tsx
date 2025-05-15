import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from 'wouter';
import { HeartPulse, Brain, CheckCircle, Leaf, Utensils, Activity, ArrowRight, Calendar } from 'lucide-react';

const GutRehab: React.FC = () => {
  const [location] = useLocation();
  // Parse search params manually
  const urlParams = new URLSearchParams(window.location.search);
  const showAssessment = urlParams.get('assessment') === 'true';
  const showPrograms = urlParams.get('programs') === 'true';
  
  const [activeTab, setActiveTab] = useState<string>(
    showAssessment ? 'assessment' : showPrograms ? 'programs' : 'overview'
  );

  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 10;

  const handleCompleteAssessment = () => {
    setAssessmentCompleted(true);
  };

  return (
    <DashboardLayout title="GutrehaB">
      <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">GutrehaB</h1>
          <p className="text-xl mb-4">
            Our one-in-all solution for all gut problems coupled with mental wellbeing programs
          </p>
          <p className="opacity-90">
            Experience a deep-rooted holistic approach to gut health and mental wellness, backed by science 
            and designed for sustainable healing.
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Gut Health Assessment</TabsTrigger>
          <TabsTrigger value="programs">Mental Wellbeing</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>The Gut-Brain Connection</CardTitle>
                <CardDescription>
                  Understanding the powerful connection between gut health and mental wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <div className="w-full md:w-3/4 h-64 bg-teal-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-24 w-24 text-teal-500 opacity-75" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <p className="text-neutral-700">
                    Research shows that the gut and brain are connected through millions of nerves, creating 
                    a two-way communication system often called the gut-brain axis. This connection explains 
                    why gut health significantly impacts mental wellbeing and vice versa.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" className="mr-2" onClick={() => setActiveTab('assessment')}>
                      Take Assessment
                    </Button>
                    <Button onClick={() => setActiveTab('programs')}>
                      Explore Programs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Our Holistic Approach</CardTitle>
                <CardDescription>
                  Addressing both gut health and mental wellbeing for complete healing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <HeartPulse className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Gut Microbiome Analysis</h3>
                      <p className="text-sm text-neutral-600">Detailed assessment of your gut health to identify imbalances</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Utensils className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Personalized Nutrition</h3>
                      <p className="text-sm text-neutral-600">Customized dietary plans based on your specific gut needs</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Brain className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mental Wellbeing Programs</h3>
                      <p className="text-sm text-neutral-600">Mindfulness, stress reduction, and cognitive techniques</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Activity className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Lifestyle Optimization</h3>
                      <p className="text-sm text-neutral-600">Sleep, exercise, and daily routine adjustments for optimal health</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Benefits of GutrehaB</CardTitle>
              <CardDescription>
                How our holistic approach can transform your health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Improved Digestion</h3>
                  <p className="text-neutral-600">
                    Reduce bloating, gas, constipation, and other digestive discomforts through targeted gut healing protocols.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Enhanced Mood</h3>
                  <p className="text-neutral-600">
                    Experience reduced anxiety, improved mood stability, and greater emotional resilience.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Increased Energy</h3>
                  <p className="text-neutral-600">
                    Boost your overall vitality by improving nutrient absorption and reducing inflammatory burden.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Stronger Immunity</h3>
                  <p className="text-neutral-600">
                    70% of your immune system resides in your gut. Strengthen your defenses against illness.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Reduced Inflammation</h3>
                  <p className="text-neutral-600">
                    Address the root causes of inflammatory conditions through gut healing and stress reduction.
                  </p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Better Sleep</h3>
                  <p className="text-neutral-600">
                    Improve sleep quality and duration through balanced gut microbiome and reduced anxiety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Gut Health Assessment</CardTitle>
              <CardDescription>
                Complete this comprehensive assessment to receive personalized gut health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!assessmentCompleted ? (
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-600">Progress</span>
                      <span className="text-sm font-medium">{currentQuestion}/{totalQuestions}</span>
                    </div>
                    <Progress value={(currentQuestion / totalQuestions) * 100} className="h-2" />
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-medium text-lg mb-4">
                      Question {currentQuestion}: How frequently do you experience digestive discomfort?
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="q1-a" 
                          name="q1" 
                          className="mr-3 h-4 w-4 text-primary"
                        />
                        <label htmlFor="q1-a">Rarely or never</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="q1-b" 
                          name="q1" 
                          className="mr-3 h-4 w-4 text-primary"
                        />
                        <label htmlFor="q1-b">Once or twice a month</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="q1-c" 
                          name="q1" 
                          className="mr-3 h-4 w-4 text-primary"
                        />
                        <label htmlFor="q1-c">Once or twice a week</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="q1-d" 
                          name="q1" 
                          className="mr-3 h-4 w-4 text-primary"
                        />
                        <label htmlFor="q1-d">Several times a week</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="q1-e" 
                          name="q1" 
                          className="mr-3 h-4 w-4 text-primary"
                        />
                        <label htmlFor="q1-e">Daily</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      disabled={currentQuestion === 1}
                      onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={() => {
                        if (currentQuestion < totalQuestions) {
                          setCurrentQuestion(prev => prev + 1);
                        } else {
                          handleCompleteAssessment();
                        }
                      }}
                    >
                      {currentQuestion < totalQuestions ? 'Next' : 'Complete Assessment'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Assessment Completed!</h3>
                  <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                    Based on your responses, we've created a personalized gut health profile with targeted recommendations.
                  </p>
                  
                  <div className="max-w-xl mx-auto mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className="font-medium mb-3">Your Gut Health Score: 68/100</h4>
                      <Progress value={68} className="h-2 mb-4" />
                      <p className="text-sm text-neutral-700 mb-3">
                        Your gut health is in the moderate range. We've identified several areas for improvement that could significantly enhance your digestive wellness and overall health.
                      </p>
                      <h5 className="font-medium mb-2">Key Insights:</h5>
                      <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                        <li>Signs of moderate gut inflammation</li>
                        <li>Potential imbalance in gut microbiome</li>
                        <li>Digestive enzyme insufficiency possible</li>
                        <li>Stress appears to be impacting digestive function</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button>
                    View Full Results & Recommendations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Mental Wellbeing Programs</CardTitle>
                <CardDescription>
                  Science-backed programs to reduce stress and improve mental health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">8-Week Mindfulness Journey</h3>
                        <p className="text-neutral-600 mt-1">
                          A comprehensive program to develop present-moment awareness and reduce stress response
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                            Beginner Friendly
                          </Badge>
                          <Badge variant="outline">8 Weeks</Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Stress & Anxiety Relief</h3>
                        <p className="text-neutral-600 mt-1">
                          Targeted techniques to manage stress, reduce anxiety, and regulate nervous system
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
                            Most Popular
                          </Badge>
                          <Badge variant="outline">6 Weeks</Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Sleep Enhancement</h3>
                        <p className="text-neutral-600 mt-1">
                          Improve sleep quality through cognitive techniques and relaxation practices
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline">4 Weeks</Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Emotional Resilience</h3>
                        <p className="text-neutral-600 mt-1">
                          Build capacity to navigate difficult emotions and develop psychological flexibility
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-200">
                            Advanced
                          </Badge>
                          <Badge variant="outline">10 Weeks</Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Program: Stress & Anxiety Relief</CardTitle>
                <CardDescription>
                  Our most popular program for reducing stress and managing anxiety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-16 w-16 text-blue-500 opacity-70" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Program Overview</h3>
                    <p className="text-neutral-600 text-sm">
                      This 6-week program combines evidence-based techniques from cognitive behavioral therapy, 
                      mindfulness practices, and nervous system regulation to help you effectively 
                      manage stress and reduce anxiety.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">What You'll Learn</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Identify stress triggers and anxiety patterns</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Practice quick-relief techniques for acute anxiety</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Develop a personalized stress management routine</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Understand the gut-brain connection in anxiety</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <Button className="w-full">
                      Start Free Trial
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Practices</CardTitle>
              <CardDescription>
                Quick exercises to incorporate into your daily routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Leaf className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">5-Minute Breath Work</h3>
                  <p className="text-sm text-neutral-600">
                    Quick breathing exercise to calm the nervous system
                  </p>
                  <Badge variant="outline" className="mt-2">3 min</Badge>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <Brain className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">Body Scan Meditation</h3>
                  <p className="text-sm text-neutral-600">
                    Release physical tension and increase body awareness
                  </p>
                  <Badge variant="outline" className="mt-2">10 min</Badge>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <HeartPulse className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-1">Gratitude Practice</h3>
                  <p className="text-sm text-neutral-600">
                    Shift focus to positive aspects to reduce anxiety
                  </p>
                  <Badge variant="outline" className="mt-2">5 min</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your GutrehaB Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-neutral-600 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Gut health assessment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic dietary recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Access to 2 wellbeing programs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Weekly progress tracking</span>
                    </li>
                  </ul>
                  <Button className="w-full">Select Plan</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-neutral-600 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced gut health analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Personalized nutrition plan</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Unlimited access to all programs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Bi-weekly progress consultation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Select Plan</Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary">
                <CardHeader>
                  <CardTitle>Ultimate</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$89</span>
                    <span className="text-neutral-600 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Comprehensive gut microbiome testing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom meal plans and recipes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>1:1 sessions with gut health specialist</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Weekly therapy sessions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>24/7 premium support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Select Plan</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">How is GutrehaB different from other gut health programs?</h3>
                  <p className="text-neutral-600 text-sm">
                    GutrehaB is unique in its comprehensive approach that addresses both gut health and mental wellbeing simultaneously. We recognize the powerful gut-brain connection and provide integrated solutions that target both aspects for more complete healing.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Can I cancel my subscription anytime?</h3>
                  <p className="text-neutral-600 text-sm">
                    Yes, all subscriptions can be canceled at any time without penalty. You'll continue to have access to the services until the end of your current billing period.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">How soon can I expect to see results?</h3>
                  <p className="text-neutral-600 text-sm">
                    Many users report noticeable improvements in digestive symptoms and mood within 2-4 weeks. However, deep healing of the gut microbiome typically takes 3-6 months of consistent work. Your results may vary based on your specific conditions and adherence to the program.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Is GutrehaB right for me if I have a diagnosed condition?</h3>
                  <p className="text-neutral-600 text-sm">
                    GutrehaB can be used as a complementary approach alongside conventional medical treatment. However, it's essential to consult with your healthcare provider before starting any new health program, especially if you have diagnosed conditions like IBS, IBD, or clinical depression/anxiety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GutRehab;
