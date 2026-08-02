import React, { useState } from 'react';
import { Layers, Download, Sparkles, FolderOpen, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ProjectsModal } from './ProjectsModal';
import { ExportModal } from './ExportModal';
import { AnimatePresence } from 'motion/react';

export function Navbar() {
  const { currentProjectId, projects, closeProject } = useStore();
  const currentProject = projects.find(p => p.id === currentProjectId);
  
  const [showProjects, setShowProjects] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <>
      <nav className="h-16 border-b border-white/10 bg-[#090909] text-white flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={closeProject}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Back to Templates"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">Carousel Builder</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-4">
          {currentProject && (
            <div className="text-xs md:text-sm text-gray-400 mr-2 md:mr-4 max-w-[100px] md:max-w-xs truncate">
              {currentProject.name}
            </div>
          )}
          <button 
            onClick={() => setShowProjects(true)}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2 md:px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:block">Projects</span>
          </button>
          <button 
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors px-2 md:px-3 py-2 rounded-md hover:bg-purple-500/10 flex items-center gap-2"
            onClick={() => alert('AI Generation feature is coming soon! You will be able to write "Create an 8-slide carousel about domains" and the AI will build it automatically.')}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:block">AI Magic</span>
          </button>
          <button 
            onClick={() => setShowExport(true)}
            className="text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors px-3 md:px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:block">Export</span>
          </button>
        </div>
      </nav>
      
      <AnimatePresence>
        {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      </AnimatePresence>
    </>
  );
}
