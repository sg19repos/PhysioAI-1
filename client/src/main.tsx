import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// This ensures all the MediaPipe models are loaded after the app loads
import "@tensorflow/tfjs";
import "@tensorflow-models/pose-detection";

createRoot(document.getElementById("root")!).render(<App />);
