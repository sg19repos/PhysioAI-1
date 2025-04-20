import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

// Create the root element and render the app
createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
