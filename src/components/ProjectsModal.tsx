import React from 'react';
import { useStore } from '../store/useStore';
import { X, Copy, Trash2, Edit2, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsModalProps {
  onClose: () => void;
}

export function ProjectsModal({ onClose }: ProjectsModalProps) {
  const { projects, currentProjectId, loadProject, deleteProject, duplicateProject, updateProjectName } = useStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');

  const handleEdit = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveName = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editName.trim()) {
      updateProjectName(id, editName);
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl relative z-10"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Projects</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-4">
          <AnimatePresence>
            {projects.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-500">
                No projects yet. Create one from a template!
              </motion.div>
            ) : (
              projects.map(project => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={project.id}
                  onClick={() => {
                    loadProject(project.id);
                    onClose();
                  }}
                  className={cn(
                    "group p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                    currentProjectId === project.id 
                      ? "bg-purple-500/10 border-purple-500/50" 
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  )}
                >
                  <div className="flex-1">
                    {editingId === project.id ? (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <input 
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSaveName(project.id)}
                          autoFocus
                          className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-purple-500"
                        />
                        <button onClick={(e) => handleSaveName(project.id, e)} className="p-1 text-green-400 hover:text-green-300">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-white">{project.name}</h3>
                        <button 
                          onClick={(e) => handleEdit(project.id, project.name, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity p-1"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span>{project.slides.length} slides</span>
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); duplicateProject(project.id); }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
