import React, { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Rnd } from 'react-rnd';
import { cn } from '../lib/utils';
import { Copy, Plus, Trash2 } from 'lucide-react';

export function CanvasArea() {
  const { 
    currentProjectId, 
    projects, 
    activeSlideIndex, 
    selectedElementId, 
    selectElement, 
    updateElement,
    addSlide,
    duplicateSlide,
    deleteSlide,
    setActiveSlide
  } = useStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  const project = projects.find(p => p.id === currentProjectId);

  // Responsive scale for the canvas
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        
        // Target size is 1080x1350
        const scaleX = clientWidth / 1080;
        const scaleY = clientHeight / 1350;
        setScale(Math.min(scaleX, scaleY));
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (!project) {
    return (
      <div className="flex-1 bg-[#111111] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-64 h-64 rounded-full bg-purple-500/5 blur-[100px] absolute" />
        <p className="text-gray-400 z-10 text-lg">Select a template from the left to start building.</p>
      </div>
    );
  }

  const currentSlide = project.slides[activeSlideIndex];

  return (
    <div className="flex-1 bg-[#111111] flex flex-col relative overflow-hidden">
      
      {/* Slides Thumbnail Bar */}
      <div className="h-20 border-b border-white/5 bg-[#090909] flex items-center px-4 gap-4 overflow-x-auto custom-scrollbar shrink-0">
        {project.slides.map((_, idx) => (
          <div 
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={cn(
              "h-14 w-12 shrink-0 rounded bg-white/5 border-2 flex items-center justify-center cursor-pointer relative group transition-colors",
              activeSlideIndex === idx ? "border-purple-500" : "border-transparent hover:border-white/20"
            )}
          >
            <span className="text-xs text-gray-400 font-medium">{idx + 1}</span>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg hidden group-hover:flex" onClick={(e) => { e.stopPropagation(); deleteSlide(idx); }}>
               <Trash2 className="w-3 h-3" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg hidden group-hover:flex" onClick={(e) => { e.stopPropagation(); duplicateSlide(idx); }}>
               <Copy className="w-3 h-3" />
            </div>
          </div>
        ))}
        <button 
          onClick={addSlide}
          className="h-14 w-12 shrink-0 rounded border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onClick={() => selectElement(null)}
      >
        <div 
          id="carousel-canvas"
          className="relative overflow-hidden transition-all duration-300 ease-out"
          style={{
            width: 1080,
            height: 1350,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            backgroundColor: project.background,
          }}
          onClick={(e) => {
            // Only stop propagation if we clicked on an element inside
            if (e.target !== e.currentTarget) {
              e.stopPropagation();
            } else {
              selectElement(null);
            }
          }}
        >
          {currentSlide?.map((element) => {
            if (element.isHidden) return null;
            
            const isSelected = selectedElementId === element.id;
            const isLocked = element.isLocked;
            
            return (
              <Rnd
                key={element.id}
                size={{ width: element.width || 'auto', height: element.height || 'auto' }}
                position={{ x: element.x, y: element.y }}
                onDragStop={(e, d) => {
                  if (!isLocked) updateElement(element.id, { x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  if (!isLocked) {
                    updateElement(element.id, {
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                      ...position,
                    });
                  }
                }}
                bounds="parent"
                enableResizing={isSelected && !isLocked}
                disableDragging={!isSelected || isLocked}
                className={cn(
                  "absolute group",
                  isSelected && "ring-2 ring-purple-500/80 ring-offset-2 ring-offset-transparent shadow-lg z-50",
                  !isSelected && !isLocked && "hover:ring-1 hover:ring-white/30",
                  isLocked && "cursor-not-allowed opacity-80"
                )}
                style={{ zIndex: element.zIndex }}
                onMouseDown={() => selectElement(element.id)}
              >
                <div 
                  className={cn(
                    "w-full h-full flex items-center",
                    element.textAlign === 'center' ? 'justify-center text-center' : element.textAlign === 'right' ? 'justify-end text-right' : 'justify-start text-left'
                  )}
                  style={{
                    color: element.color,
                    fontSize: `${element.fontSize}px`,
                    fontWeight: element.fontWeight,
                    fontFamily: element.fontFamily || 'Inter, sans-serif',
                    backgroundColor: element.backgroundColor,
                    borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
                    padding: element.backgroundColor && element.type !== 'image' ? '8px 16px' : undefined,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.2
                  }}
                >
                  {element.type === 'image' ? (
                    <img 
                      src={element.content} 
                      alt="Element" 
                      className="w-full h-full object-contain pointer-events-none" 
                      draggable={false}
                    />
                  ) : (
                    element.content
                  )}
                </div>
                
                {/* Drag Handle Overlay */}
                {!isSelected && (
                  <div className="absolute inset-0 cursor-pointer" />
                )}
              </Rnd>
            );
          })}
        </div>
      </div>
    </div>
  );
}
