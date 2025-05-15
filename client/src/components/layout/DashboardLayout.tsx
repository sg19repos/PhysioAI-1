import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Dashboard" 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div 
        className={cn(
          "md:w-64 md:flex-shrink-0 md:static fixed inset-y-0 left-0 z-20 transition-transform duration-300 transform md:transform-none bg-white md:border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar />
      </div>
      
      {/* Overlay when mobile sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <Topbar toggleSidebar={toggleSidebar} title={title} />
        
        <div className="p-4 md:p-8">
          {children}
        </div>
        
        <footer className="bg-white border-t py-6 px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="text-center md:text-left">
              <p className="text-sm text-neutral-600">© 2023 PhysioTrack AI. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-4">
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Terms of Service</a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Contact Us</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
