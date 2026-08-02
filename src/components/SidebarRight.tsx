import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Type, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, LayoutTemplate, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ElementType, CanvasElement } from '../types';

interface SidebarRightProps {
  onClose?: () => void;
}

export function SidebarRight({ onClose }: SidebarRightProps) {
  const { currentProjectId, projects, activeSlideIndex, selectedElementId, updateElement, deleteElement, addElement, updateProjectBackground } = useStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const project = projects.find(p => p.id === currentProjectId);
  const currentSlide = project?.slides[activeSlideIndex];
  const selectedElement = currentSlide?.find(el => el.id === selectedElementId);

  if (!project) {
    return (
      <div className="w-80 h-full border-l border-white/10 bg-[#090909] flex items-center justify-center p-6 text-center text-gray-500 text-sm">
        Select a template to start editing
      </div>
    );
  }

  const handleAddElement = (type: ElementType) => {
    let defaults: Partial<CanvasElement> = { content: 'New Text', fontSize: 32, color: '#ffffff', fontWeight: '400' };
    if (type === 'headline') defaults = { content: 'Headline', fontSize: 72, color: '#ffffff', fontWeight: '800' };
    if (type === 'body') defaults = { content: 'Body text goes here', fontSize: 32, color: '#9ca3af', fontWeight: '400' };
    if (type === 'username') defaults = { content: '@username', fontSize: 24, color: '#6b7280', fontWeight: '400' };
    if (type === 'badge') defaults = { content: 'BADGE', fontSize: 18, color: '#ffffff', fontWeight: '600', backgroundColor: '#3b82f6', borderRadius: 8 };

    addElement({
      type,
      x: 100,
      y: 100,
      ...defaults
    } as Omit<CanvasElement, 'id' | 'zIndex'>);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addElement({
        type: 'image',
        x: 100,
        y: 100,
        width: 300,
        height: 300,
        content: dataUrl,
        backgroundColor: 'transparent'
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-80 h-full border-l border-white/10 bg-[#090909] text-white flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedElement && (
            <button 
              onClick={() => useStore.getState().selectElement(null)}
              className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
              title="Back to Slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            {selectedElement ? 'Edit Element' : 'Slide Settings'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {selectedElement && (
             <button 
               onClick={() => deleteElement(selectedElement.id)}
               className="text-red-400 hover:text-red-300 transition-colors p-1"
               title="Delete Element"
             >
               <Trash2 className="w-4 h-4" />
             </button>
          )}
          {onClose && (
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {selectedElement ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Content</label>
              <textarea 
                value={selectedElement.content}
                onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 transition-colors min-h-[100px] resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Appearance</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Color</span>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                    <input 
                      type="color" 
                      value={selectedElement.color || '#ffffff'}
                      onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs text-gray-300 uppercase truncate">{selectedElement.color || '#fff'}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Size</span>
                  <input 
                    type="number" 
                    value={selectedElement.fontSize || 16}
                    onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Alignment</label>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateElement(selectedElement.id, { textAlign: align })}
                    className={cn(
                      "flex-1 p-2 flex items-center justify-center rounded-md transition-colors",
                      (selectedElement.textAlign || 'left') === align ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {selectedElement.backgroundColor !== undefined && (
               <div className="space-y-2">
                 <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Background</label>
                 <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                    <input 
                      type="color" 
                      value={selectedElement.backgroundColor || '#000000'}
                      onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs text-gray-300 uppercase truncate">{selectedElement.backgroundColor || 'none'}</span>
                  </div>
               </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Layer Controls</label>
              <div className="flex items-center gap-2">
                 <button onClick={() => updateElement(selectedElement.id, { zIndex: Math.max(0, (selectedElement.zIndex || 1) - 1) })} className="px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10">-</button>
                 <span className="flex-1 text-center font-mono text-xs">Z-Index: {selectedElement.zIndex || 1}</span>
                 <button onClick={() => updateElement(selectedElement.id, { zIndex: (selectedElement.zIndex || 1) + 1 })} className="px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10">+</button>
              </div>
               <div className="grid grid-cols-2 gap-2 mt-2">
                 <button 
                   onClick={() => updateElement(selectedElement.id, { isLocked: !selectedElement.isLocked })}
                   className={cn("p-2 rounded border text-xs font-medium transition-colors text-center", selectedElement.isLocked ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300")}
                 >
                   {selectedElement.isLocked ? 'Unlock' : 'Lock Layer'}
                 </button>
                 <button 
                   onClick={() => updateElement(selectedElement.id, { isHidden: !selectedElement.isHidden })}
                   className={cn("p-2 rounded border text-xs font-medium transition-colors text-center", selectedElement.isHidden ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300")}
                 >
                   {selectedElement.isHidden ? 'Show Layer' : 'Hide Layer'}
                 </button>
              </div>
            </div>
            
            <button
              onClick={() => useStore.getState().selectElement(null)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Done Editing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Slide Background</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <input 
                  type="color" 
                  value={project.background}
                  onChange={(e) => updateProjectBackground(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-gray-300 uppercase">{project.background}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Quick Themes</label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { name: 'Purple', bg: '#1a1025', accent: '#a855f7' },
                  { name: 'Blue', bg: '#eff6ff', accent: '#3b82f6' },
                  { name: 'Orange', bg: '#fff7ed', accent: '#f97316' },
                  { name: 'Green', bg: '#f0fdf4', accent: '#22c55e' },
                  { name: 'Dark', bg: '#090909', accent: '#ffffff' },
                  { name: 'White', bg: '#ffffff', accent: '#000000' }
                ].map((theme) => (
                   <button
                     key={theme.name}
                     onClick={() => {
                       updateProjectBackground(theme.bg);
                       useStore.getState().applyThemeToProject(theme.accent);
                     }}
                     className="w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform relative overflow-hidden group"
                     title={theme.name}
                   >
                     <div className="absolute inset-0 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(to bottom right, ${theme.bg} 50%, ${theme.accent} 50%)`}} />
                   </button>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-4">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Add Elements</label>
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => handleAddElement('headline')} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 rounded-lg flex flex-col items-center gap-2 transition-all">
                    <Type className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-300">Headline</span>
                 </button>
                 <button onClick={() => handleAddElement('body')} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 rounded-lg flex flex-col items-center gap-2 transition-all">
                    <AlignLeft className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-300">Body Text</span>
                 </button>
                 <button onClick={() => handleAddElement('username')} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 rounded-lg flex flex-col items-center gap-2 transition-all">
                    <LayoutTemplate className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-300">Username</span>
                 </button>
                 <button onClick={() => handleAddElement('badge')} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 rounded-lg flex flex-col items-center gap-2 transition-all">
                    <div className="px-2 py-1 bg-blue-500 text-white text-[10px] rounded font-bold">BADGE</div>
                    <span className="text-xs text-gray-300">Badge</span>
                 </button>
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 rounded-lg flex flex-col items-center gap-2 transition-all">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-300">Image</span>
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   accept="image/*" 
                   className="hidden" 
                 />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

