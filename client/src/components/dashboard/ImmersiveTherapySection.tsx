import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ImmersiveTherapySection: React.FC = () => {
  return (
    <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path>
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path>
            <path d="M3 12h18"></path>
            <path d="M12 16a2 2 0 0 1 0-4"></path>
          </svg>
          Immersive Therapy
        </CardTitle>
        <CardDescription>Experience rehabilitation in virtual and augmented reality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg text-primary-dark mb-2">VR Therapy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Engage in immersive rehabilitation exercises in a virtual environment with gamified elements.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Customizable virtual environments
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Interactive exercise guidance
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Real-time progress tracking
                  </li>
                </ul>
                <Link href="/vr-therapy">
                  <Button className="w-full">Try VR Therapy</Button>
                </Link>
              </div>
              <div className="hidden md:block bg-blue-100 rounded-lg p-3 h-24 w-24 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M3 7v2a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7"></path>
                  <path d="M9 13v4"></path>
                  <path d="M15 13v4"></path>
                  <path d="M6 20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7H6v7Z"></path>
                  <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg text-primary-dark mb-2">AR Therapy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use your mobile device to see exercise guides overlaid on your real environment.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Works on most mobile devices
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Camera-based movement analysis
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Real-world environment integration
                  </li>
                </ul>
                <Link href="/ar-therapy">
                  <Button variant="outline" className="w-full">Try AR Therapy</Button>
                </Link>
              </div>
              <div className="hidden md:block bg-indigo-100 rounded-lg p-3 h-24 w-24 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-600"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                  <line x1="8" x2="16" y1="21" y2="21"></line>
                  <line x1="12" x2="12" y1="17" y2="21"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Both VR and AR therapy sessions are tracked and integrated with your progress reports.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImmersiveTherapySection;