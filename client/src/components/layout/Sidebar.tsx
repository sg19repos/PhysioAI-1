import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPath: string;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, children, currentPath }) => {
  const isActive = currentPath === href;
  
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center py-2 px-4 rounded-lg mb-1 transition-colors cursor-pointer",
          isActive 
            ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary" 
            : "text-neutral-700 hover:text-primary hover:bg-gray-100"
        )}
      >
        <span className="mr-3">{icon}</span>
        {children}
      </div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  
  return (
    <aside className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold font-heading text-primary-dark flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5z" 
              clipRule="evenodd" 
            />
          </svg>
          PhysioTrack
        </h1>
        <p className="text-neutral-500 text-sm">AI-Powered Rehabilitation</p>
      </div>
      
      <nav className="p-2">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-4 mb-2 px-4">
          Dashboard
        </p>
        
        <SidebarLink 
          href="/" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          }
          currentPath={location}
        >
          Home
        </SidebarLink>
        
        <SidebarLink 
          href="/profile" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          My Profile
        </SidebarLink>
        
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-4 mb-2 px-4">
          Therapy
        </p>
        
        <SidebarLink 
          href="/session" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          Start Session
        </SidebarLink>
        
        <SidebarLink 
          href="/progress" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          }
          currentPath={location}
        >
          Progress Reports
        </SidebarLink>
        
        <SidebarLink 
          href="/exercises" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
          currentPath={location}
        >
          Exercises
        </SidebarLink>
        
        <SidebarLink
          href="/therapist"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          Therapist Notes
        </SidebarLink>
        
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-4 mb-2 px-4">
          Immersive Therapy
        </p>
        
        <SidebarLink
          href="/vr-therapy"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 00-.707.293l-2.586 2.586a1 1 0 01-1.414 0L7.707 9.293A1 1 0 007 9H5a1 1 0 01-1-1V4zm5 1a1 1 0 10-2 0v1a1 1 0 102 0V5zm6 0a1 1 0 10-2 0v1a1 1 0 102 0V5z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          VR Therapy
        </SidebarLink>
        
        <SidebarLink
          href="/ar-therapy"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1h12V3a1 1 0 00-1-1H5zm-1 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H4zm5 9a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-7 4h10v-5H6v5z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          AR Therapy
        </SidebarLink>
        
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-4 mb-2 px-4">
          More
        </p>
        
        <SidebarLink
          href="/payments"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          Billing & Payments
        </SidebarLink>
        
        <SidebarLink
          href="/gutrehab"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          }
          currentPath={location}
        >
          GutrehaB
        </SidebarLink>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-primary-dark font-medium">GutrehaB</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Our one-in-all solution for gut health & mental wellbeing.
          </p>
          <Link href="/gutrehab">
            <div className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-dark cursor-pointer">
              Learn more
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
