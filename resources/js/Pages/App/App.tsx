// resources/js/Pages/App/app.tsx
import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/providers";
import { AppRoutes } from "./routes"; // Fixed import path
import { Toaster } from "@/components/ui/sonner";

export function App() {
  useEffect(() => {
    const root = document.getElementById('root');
    const loginSuccess = root?.dataset.loginSuccess === 'true';
    
    if (loginSuccess) {
      toast.success('Login successful!');
    }
  }, []);

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
        <Toaster position="top-center" />
      </AppProviders>
    </BrowserRouter>
  );
}
