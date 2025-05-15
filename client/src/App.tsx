import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

import Dashboard from "@/pages/dashboard";
import Session from "@/pages/session";
import Profile from "@/pages/profile";
import Exercises from "@/pages/exercises";
import Progress from "@/pages/progress";
import Therapist from "@/pages/therapist";
import Payments from "@/pages/payments";
import GutRehab from "@/pages/gutrehab";
import VRTherapy from "@/pages/vr-therapy";
import ARTherapy from "@/pages/ar-therapy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/session" component={Session} />
      <Route path="/profile" component={Profile} />
      <Route path="/exercises" component={Exercises} />
      <Route path="/progress" component={Progress} />
      <Route path="/therapist" component={Therapist} />
      <Route path="/payments" component={Payments} />
      <Route path="/gutrehab" component={GutRehab} />
      <Route path="/vr-therapy" component={VRTherapy} />
      <Route path="/ar-therapy" component={ARTherapy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
