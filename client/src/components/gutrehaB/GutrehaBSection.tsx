import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Smile } from "lucide-react";

const GutrehaBSection = () => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-neutral-800 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 48C141.1 48 48 141.1 48 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V256C0 114.6 114.6 0 256 0S512 114.6 512 256V400.1c0 48-37.3 87.9-85.3 87.9H144c-13.3 0-24-10.7-24-24s10.7-24 24-24H426.7c20.5 0 37.3-16.9 37.3-39.9V256c0-114.9-93.1-208-208-208zM256 128c-13.3 0-24 10.7-24 24V264c0 13.3 10.7 24 24 24s24-10.7 24-24V152c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
          </svg>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white">GutrehaB</h2>
          <p className="mt-2 text-xl text-accent-light">Holistic Gut Health & Mental Wellbeing</p>
          
          <div className="mt-6 max-w-3xl">
            <p className="text-neutral-200">
              GutrehaB provides a comprehensive solution for addressing gut health issues while integrating mental wellbeing programs for deep-rooted healing. Our approach recognizes the crucial gut-brain connection that affects physical recovery and overall health.
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-700 bg-opacity-50 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent-light" />
              </div>
              <h3 className="text-lg font-medium text-white">Gut Microbiome Analysis</h3>
              <p className="mt-2 text-sm text-neutral-300">
                Comprehensive assessment of gut flora and digestive health to identify imbalances affecting recovery.
              </p>
            </div>
            
            <div className="bg-neutral-700 bg-opacity-50 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent-light" />
              </div>
              <h3 className="text-lg font-medium text-white">Nutritional Therapy</h3>
              <p className="mt-2 text-sm text-neutral-300">
                Personalized nutrition plans designed to support gut health and optimize physiotherapy outcomes.
              </p>
            </div>
            
            <div className="bg-neutral-700 bg-opacity-50 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center mb-4">
                <Smile className="h-6 w-6 text-accent-light" />
              </div>
              <h3 className="text-lg font-medium text-white">Mental Wellbeing Integration</h3>
              <p className="mt-2 text-sm text-neutral-300">
                Mindfulness, stress reduction, and cognitive techniques that enhance physical healing through the gut-brain axis.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <Button variant="default" className="bg-accent hover:bg-accent-light text-neutral-900">
              Learn More About GutrehaB
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GutrehaBSection;
