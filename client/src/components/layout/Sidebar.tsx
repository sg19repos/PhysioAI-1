import { Link, useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  BarChart2,
  Settings,
  Zap,
  Menu,
  X
} from "lucide-react";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
};

const NavItem = ({ href, icon, children, isActive, onClick, className }: NavItemProps) => {
  return (
    <Link href={href}>
      <a 
        onClick={onClick}
        className={cn(
          "flex items-center px-4 py-2 rounded-md group",
          isActive 
            ? "text-white bg-primary-dark" 
            : "text-neutral-300 hover:bg-neutral-700",
          className
        )}
      >
        <span className="mr-3 h-5 w-5">{icon}</span>
        {children}
      </a>
    </Link>
  );
};

const Sidebar = () => {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          {mobileOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "md:flex md:flex-shrink-0 transform transition-transform duration-300 ease-in-out",
        mobileOpen ? "fixed inset-y-0 left-0 z-40 w-64 flex" : "hidden"
      )}>
        <div className="flex flex-col w-64 bg-neutral-800 border-r border-neutral-700">
          <div className="px-6 pt-8 pb-4 flex items-center">
            <span className="text-white font-bold text-xl">PhysioAI</span>
          </div>
          
          {/* User Profile Summary */}
          <div className="px-6 py-4 border-b border-neutral-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white font-semibold">
                DR
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">Dr. Sarah Reynolds</p>
                <p className="text-neutral-400 text-sm">Physiotherapist</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavItem 
              href="/" 
              icon={<Home />} 
              isActive={location === '/'} 
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </NavItem>
            
            <NavItem 
              href="/patients" 
              icon={<Users />} 
              isActive={location === '/patients'}
              onClick={() => setMobileOpen(false)}
            >
              Patients
            </NavItem>
            
            <NavItem 
              href="/exercises" 
              icon={<FileText />} 
              isActive={location === '/exercises'}
              onClick={() => setMobileOpen(false)}
            >
              Exercise Library
            </NavItem>
            
            <NavItem 
              href="/session" 
              icon={<BarChart2 />} 
              isActive={location === '/session'}
              onClick={() => setMobileOpen(false)}
            >
              Active Session
            </NavItem>
            
            <NavItem 
              href="/settings" 
              icon={<Settings />} 
              isActive={location === '/settings'}
              onClick={() => setMobileOpen(false)}
            >
              Settings
            </NavItem>

            <div className="pt-4 border-t border-neutral-700">
              <NavItem 
                href="/gutrehab" 
                icon={<Zap />} 
                isActive={location === '/gutrehab'}
                onClick={() => setMobileOpen(false)}
                className="text-accent-light hover:bg-neutral-700"
              >
                GutrehaB Program
              </NavItem>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
