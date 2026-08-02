import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { templates, categories } from '../data/templates';
import { Search, Plus, Layers, Layout, Clock, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { Template } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectsModal } from './ProjectsModal';

export function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const { createProject, projects } = useStore();

  const filteredTemplates = templates.filter(t => 
    (activeCategory === 'All' || t.category === activeCategory) &&
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-[#090909] text-white flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-black/20 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Carousel<span className="text-purple-400">Builder</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowProjects(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Recent Projects</span>
            {projects.length > 0 && (
               <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                 {projects.length}
               </span>
            )}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Header Section */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Start with a template
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Choose from our collection of professionally designed templates to kickstart your next social media carousel.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-5 py-2 rounded-full text-sm font-medium transition-all",
                        activeCategory === cat 
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" 
                          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search templates..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTemplates.map(template => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={template.id} 
                    className="group flex flex-col gap-4 cursor-pointer"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-white/5 overflow-hidden relative transition-all group-hover:border-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                      
                      {/* Simple visual representation of the template */}
                      <div className="w-full h-full relative" style={{ background: template.background }}>
                        {template.elements.map((el, idx) => {
                           if (el.type === 'headline' || el.type === 'body') {
                              return (
                                <div 
                                  key={el.id || idx}
                                  className="absolute w-full px-8 opacity-70"
                                  style={{
                                    top: `${el.y / 2}px`,
                                    fontSize: `${Math.max(12, (el.fontSize || 32) / 3)}px`,
                                    fontWeight: el.fontWeight || 'normal',
                                    color: el.color || '#fff'
                                  }}
                                >
                                  {el.content}
                                </div>
                              );
                           }
                           return null;
                        })}
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                        <button className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                          <Play className="w-4 h-4 fill-black" />
                          Preview
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider">{template.category}</div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{template.name}</h3>
                    </div>
                  </motion.div>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-500">
                    <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No templates found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedTemplate(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-5xl h-[90vh] md:h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10"
            >
              <div className="w-full md:w-2/3 h-1/2 md:h-full bg-black/50 p-4 md:p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                {/* Simulated Canvas for Preview */}
                <div 
                  className="aspect-[4/5] h-full max-h-[800px] rounded-xl overflow-hidden relative shadow-2xl"
                  style={{ background: selectedTemplate.background }}
                >
                  {selectedTemplate.elements.map((el, idx) => (
                    <div
                      key={el.id || idx}
                      className="absolute"
                      style={{
                        left: `${el.x}px`,
                        top: `${el.y}px`,
                        color: el.color || '#fff',
                        fontSize: `${el.fontSize}px`,
                        fontWeight: el.fontWeight || 'normal',
                        backgroundColor: el.backgroundColor,
                        borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                        padding: el.backgroundColor && el.type !== 'image' ? '8px 16px' : undefined,
                        zIndex: el.zIndex || 1,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {el.type === 'image' ? (
                        <img 
                          src={el.content} 
                          alt="Template Element" 
                          className="w-full h-full object-contain" 
                          draggable={false}
                        />
                      ) : (
                        el.content
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/3 h-1/2 md:h-full p-6 md:p-8 flex flex-col justify-between bg-[#111111] overflow-y-auto">
                <div>
                  <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider mb-4 md:mb-6">
                    {selectedTemplate.category}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4">{selectedTemplate.name}</h2>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6 md:mb-8">
                    A beautiful, ready-to-use template for your next carousel. Start with this design and customize it to match your brand.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Layers className="w-5 h-5 text-gray-500" />
                      <span>{selectedTemplate.elements.length} customizable elements</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Layout className="w-5 h-5 text-gray-500" />
                      <span>Optimized for Instagram (1080x1350)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <button 
                    onClick={() => {
                      createProject(selectedTemplate);
                    }}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-lg shadow-xl shadow-white/10"
                  >
                    <Plus className="w-5 h-5" />
                    Use this Template
                  </button>
                  <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="w-full py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
      </AnimatePresence>
    </div>
  );
}
