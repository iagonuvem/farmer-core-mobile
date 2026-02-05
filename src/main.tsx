import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { seedDatabase } from "./data/db";

// Seed database on app start
seedDatabase().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
