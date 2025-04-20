import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Session from "@/pages/Session";
import Patients from "@/pages/Patients";
import Exercises from "@/pages/Exercises";
import GutrehaB from "@/pages/GutrehaB";

function Router() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6 px-4 lg:px-8">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/session" component={Session} />
            <Route path="/patients" component={Patients} />
            <Route path="/exercises" component={Exercises} />
            <Route path="/gutrehab" component={GutrehaB} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
