import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Smile, 
  ArrowRight, 
  Brain, 
  Apple, 
  Clock,
  CheckCircle2,
  Calendar,
  Clipboard,
  Users
} from "lucide-react";
import GutrehaBSection from "@/components/gutrehaB/GutrehaBSection";

const GutrehaB = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">GutrehaB Program</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Holistic gut health and mental wellbeing integration for optimal recovery
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button className="inline-flex items-center">
            Get Started
          </Button>
        </div>
      </div>

      {/* GutrehaB Overview */}
      <GutrehaBSection />
      
      {/* Program Details */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Program Details</h2>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="microbiome">Gut Microbiome</TabsTrigger>
            <TabsTrigger value="nutrition">Nutritional Therapy</TabsTrigger>
            <TabsTrigger value="mental">Mental Wellbeing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>The Gut-Brain Connection</CardTitle>
                <CardDescription>
                  Understanding the critical link between gut health and physiotherapy outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-neutral-700">
                    The GutrehaB program is built on the scientific understanding that gut health directly impacts 
                    physical recovery, inflammation levels, and mental wellbeing. This comprehensive approach addresses 
                    the root causes that may be impeding your patients' physiotherapy progress.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center mb-4">
                            <Brain className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">Gut-Brain Axis</h3>
                          <p className="text-sm text-neutral-600">
                            Two-way communication system between your gut and brain that influences physical recovery
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-accent" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">Inflammation Control</h3>
                          <p className="text-sm text-neutral-600">
                            Gut health directly impacts systemic inflammation, which affects healing and pain levels
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-secondary-light bg-opacity-20 flex items-center justify-center mb-4">
                            <Smile className="h-6 w-6 text-secondary" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">Stress Reduction</h3>
                          <p className="text-sm text-neutral-600">
                            Mental wellbeing techniques enhance physical therapy results through stress hormone reduction
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                    <h3 className="font-medium text-lg mb-3">Key Benefits for Physiotherapy Patients</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Reduced inflammation and pain through improved gut health</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Enhanced recovery times by optimizing nutrient absorption</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Improved exercise adherence through mental wellbeing techniques</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Better overall treatment outcomes with holistic approach</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="bg-blue-100 text-blue-800">
                    Clinical Research-Backed
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 ml-2">
                    Integrative Health
                  </Badge>
                </div>
                <Button variant="outline" className="gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="microbiome">
            <Card>
              <CardHeader>
                <CardTitle>Gut Microbiome Analysis</CardTitle>
                <CardDescription>
                  Comprehensive assessment of gut health and its impact on physical recovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-neutral-700">
                    Our gut microbiome analysis provides detailed insights into your patients' gut flora composition,
                    identifying imbalances that may be affecting their recovery and response to physiotherapy.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Clipboard className="h-5 w-5 mr-2 text-primary" />
                        Assessment Process
                      </h3>
                      <ol className="space-y-3 list-decimal pl-5">
                        <li className="pl-1">Non-invasive stool sample collection</li>
                        <li className="pl-1">Comprehensive laboratory analysis</li>
                        <li className="pl-1">Detailed report of microbiome composition</li>
                        <li className="pl-1">Identification of beneficial and harmful bacteria</li>
                        <li className="pl-1">Personalized recommendations based on findings</li>
                      </ol>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Connection to Physiotherapy
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Gut dysbiosis can increase systemic inflammation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Healthy gut bacteria produce anti-inflammatory compounds</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improved gut health leads to better nutrient absorption for muscle recovery</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Gut health directly impacts pain perception and tolerance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Schedule Microbiome Analysis</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Therapy</CardTitle>
                <CardDescription>
                  Personalized nutrition plans to optimize gut health and enhance physiotherapy outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-neutral-700">
                    Our nutritional therapy program creates personalized eating plans designed to support gut health,
                    reduce inflammation, and provide optimal nutrients for tissue repair and rehabilitation.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <Apple className="h-6 w-6 text-green-600" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">Anti-inflammatory Diet</h3>
                          <p className="text-sm text-neutral-600">
                            Foods that reduce systemic inflammation and support faster healing
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">Gut Repair Protocol</h3>
                          <p className="text-sm text-neutral-600">
                            Targeted nutrients to heal intestinal lining and improve gut function
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <Calendar className="h-6 w-6 text-purple-600" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">Meal Planning</h3>
                          <p className="text-sm text-neutral-600">
                            Practical and sustainable meal plans integrated with rehabilitation schedule
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Book Nutritional Consultation</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="mental">
            <Card>
              <CardHeader>
                <CardTitle>Mental Wellbeing Integration</CardTitle>
                <CardDescription>
                  Mind-body techniques that enhance physical healing through the gut-brain axis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-neutral-700">
                    Our mental wellbeing program provides evidence-based techniques that reduce stress,
                    improve treatment adherence, and optimize the gut-brain connection for better physical outcomes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-600" />
                        Core Techniques
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Mindfulness Meditation</span>
                            <p className="text-sm text-neutral-600 mt-1">Reduces stress hormones that affect gut function and inflammation</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Cognitive Behavioral Therapy</span>
                            <p className="text-sm text-neutral-600 mt-1">Addresses pain perception and improves exercise adherence</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Breathing Exercises</span>
                            <p className="text-sm text-neutral-600 mt-1">Activates vagus nerve which directly influences gut function</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Integration Schedule
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                          <span className="font-medium">Morning</span>
                          <span className="text-sm">5-minute breathing practice</span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                          <span className="font-medium">Pre-exercise</span>
                          <span className="text-sm">Mindfulness body scan</span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                          <span className="font-medium">Post-exercise</span>
                          <span className="text-sm">Guided relaxation</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Evening</span>
                          <span className="text-sm">Cognitive reflection practice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Schedule Wellbeing Assessment</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GutrehaB;
