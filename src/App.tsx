/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { SidebarRight } from './components/SidebarRight';
import { CanvasArea } from './components/CanvasArea';
import { Dashboard } from './components/Dashboard';
import { useStore } from './store/useStore';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { currentProjectId, isMobileSidebarOpen, setMobileSidebarOpen } = useStore();

  if (!currentProjectId) {
    return <Dashboard />;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-black overflow-hidden font-sans">
      <Navbar />
      <div className="flex-1 flex overflow-hidden relative">
        <CanvasArea />
        
        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden absolute bottom-6 right-6 z-40 bg-purple-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <SlidersHorizontal className="w-6 h-6" />
        </button>

        <div className={cn(
          "absolute inset-y-0 right-0 z-50 md:relative md:z-0 transform transition-transform duration-300 ease-in-out h-full shadow-2xl md:shadow-none",
          isMobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
          <SidebarRight onClose={() => setMobileSidebarOpen(false)} />
        </div>
        
        {/* Mobile overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
