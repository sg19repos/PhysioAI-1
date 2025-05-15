import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TopbarProps = {
  toggleSidebar: () => void;
  title: string;
};

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, title }) => {
  const [location] = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // This would come from auth context in a real app
  const user = {
    name: "John Doe",
    role: "Patient",
    initials: "JD",
  };
  
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/profile":
        return "My Profile";
      case "/session":
        return "Therapy Session";
      case "/progress":
        return "Progress Reports";
      case "/exercises":
        return "Exercises";
      case "/therapist":
        return "Therapist Notes";
      case "/payments":
        return "Billing & Payments";
      case "/gutrehab":
        return "GutrehaB";
      default:
        return title;
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm border-b px-4 md:px-8 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-neutral-700"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
        <h2 className="text-xl font-heading font-semibold text-neutral-800">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <button className="text-neutral-700 hover:text-primary p-1 rounded-full hover:bg-gray-100">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-medium">Notifications</h3>
              <button className="text-sm text-primary hover:text-primary-dark">
                Mark all as read
              </button>
            </div>
            <div className="py-2 max-h-[300px] overflow-auto">
              <div className="py-2 border-b">
                <p className="font-medium text-sm">Session reminder</p>
                <p className="text-xs text-neutral-600 mt-1">You have a therapy session today at 3:00 PM</p>
                <p className="text-xs text-neutral-400 mt-1">10 minutes ago</p>
              </div>
              <div className="py-2 border-b">
                <p className="font-medium text-sm">New exercise added</p>
                <p className="text-xs text-neutral-600 mt-1">Your therapist added a new shoulder exercise</p>
                <p className="text-xs text-neutral-400 mt-1">2 hours ago</p>
              </div>
              <div className="py-2">
                <p className="font-medium text-sm">Progress milestone</p>
                <p className="text-xs text-neutral-600 mt-1">Congratulations! You reached 75% recovery</p>
                <p className="text-xs text-neutral-400 mt-1">Yesterday</p>
              </div>
            </div>
            <div className="pt-2 border-t text-center">
              <button className="text-sm text-primary hover:text-primary-dark">
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover open={profileOpen} onOpenChange={setProfileOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-white font-medium">
                {user.initials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.role}</p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="px-1 py-2">
              <div className="mb-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-neutral-600">{user.role}</p>
              </div>
              <div className="space-y-1">
                <a 
                  href="/profile" 
                  className="flex items-center py-1.5 px-2 rounded-md hover:bg-neutral-100 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile Settings
                </a>
                <a 
                  href="/payments" 
                  className="flex items-center py-1.5 px-2 rounded-md hover:bg-neutral-100 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Billing
                </a>
                <div className="pt-2 mt-2 border-t">
                  <button className="flex w-full items-center py-1.5 px-2 rounded-md hover:bg-neutral-100 text-sm text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Topbar;
