// src/app/(app)/layout.tsx
import { ContextProvider } from '@/context/MyContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ContextProvider> {/* Wrap entire layout with context provider */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </ContextProvider>
  );
};

import { ContextProvider } from '@/context/MyContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContextProvider>
      {/* Your layout structure */}
      {children}
    </ContextProvider>
  );
}

export default AppLayout;