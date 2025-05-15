import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const GutRehaBSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row">
          <div className="md:w-2/3 text-white">
            <h2 className="text-2xl font-bold font-heading">GutrehaB</h2>
            <p className="mt-2">
              Our one-in-all solution for all gut problems coupled with mental wellbeing programs for a deep rooted holistic approach.
            </p>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-medium">Gut Health Assessment</h3>
                <p className="mt-1 text-sm text-teal-100">
                  Comprehensive analysis of your digestive system health
                </p>
                <Link href="/gutrehab?assessment=true">
                  <Button className="mt-3 bg-teal-600 hover:bg-teal-700 text-white border-none">
                    Take Assessment
                  </Button>
                </Link>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-medium">Mental Wellbeing</h3>
                <p className="mt-1 text-sm text-teal-100">
                  Mindfulness and stress reduction techniques
                </p>
                <Link href="/gutrehab?programs=true">
                  <Button className="mt-3 bg-teal-600 hover:bg-teal-700 text-white border-none">
                    Explore Programs
                  </Button>
                </Link>
              </div>
            </div>
            
            <Link href="/gutrehab">
              <Button className="mt-6 bg-white text-teal-600 hover:bg-teal-50 font-medium transition-colors">
                Learn More About GutrehaB
              </Button>
            </Link>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0 flex items-center justify-center">
            <div className="w-full h-64 bg-teal-400 rounded-lg overflow-hidden flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-24 w-24 text-white opacity-75" 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GutRehaBSection;
