import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Download, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const { currentProjectId, projects, activeSlideIndex } = useStore();
  const project = projects.find(p => p.id === currentProjectId);
  
  const [format, setFormat] = useState<'png' | 'jpg' | 'pdf'>('png');
  const [scope, setScope] = useState<'current' | 'all'>('current');
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    if (!project) return;
    setIsPreviewLoading(true);
    
    const slideToPreview = project.slides[activeSlideIndex];
    renderHiddenSlideAndCapture(slideToPreview, project.background).then(url => {
      if (mounted) {
        setPreviewUrl(url);
        setIsPreviewLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [project, activeSlideIndex]);

  if (!project) return null;

  const renderHiddenSlideAndCapture = async (slideElements: any[], background: string): Promise<string> => {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      container.style.width = '1080px';
      container.style.height = '1350px';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.backgroundColor = background;
      container.style.overflow = 'hidden';
      
      slideElements.forEach(el => {
        if (el.isHidden) return;
        const child = document.createElement('div');
        child.style.position = 'absolute';
        child.style.left = `${el.x}px`;
        child.style.top = `${el.y}px`;
        child.style.width = el.width ? `${el.width}px` : 'auto';
        child.style.height = el.height ? `${el.height}px` : 'auto';
        child.style.color = el.color || '#ffffff';
        child.style.fontSize = `${el.fontSize}px`;
        child.style.fontWeight = el.fontWeight || 'normal';
        child.style.fontFamily = el.fontFamily || 'Inter, sans-serif';
        if (el.backgroundColor) child.style.backgroundColor = el.backgroundColor;
        if (el.borderRadius) child.style.borderRadius = `${el.borderRadius}px`;
        if (el.backgroundColor) child.style.padding = '8px 16px';
        child.style.zIndex = el.zIndex || 1;
        child.style.whiteSpace = 'pre-wrap';
        child.style.wordBreak = 'break-word';
        child.style.lineHeight = '1.2';
        
        let align = 'flex-start';
        if (el.textAlign === 'center') align = 'center';
        if (el.textAlign === 'right') align = 'flex-end';
        
        child.style.display = 'flex';
        child.style.alignItems = 'center';
        child.style.justifyContent = align;
        if (el.textAlign) child.style.textAlign = el.textAlign;
        
        if (el.type === 'image') {
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';
          img.src = el.content;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          child.appendChild(img);
        } else {
          child.innerText = el.content;
        }
        container.appendChild(child);
      });
      
      document.body.appendChild(container);
      
      // Wait for fonts/styles to apply
      setTimeout(async () => {
        try {
          const dataUrl = await (format === 'jpg' 
            ? htmlToImage.toJpeg(container, { quality: 0.95, width: 1080, height: 1350, pixelRatio: 1 })
            : htmlToImage.toPng(container, { quality: 1, width: 1080, height: 1350, pixelRatio: 1 }));
          document.body.removeChild(container);
          resolve(dataUrl);
        } catch (e) {
          console.error("html-to-image error", e);
          document.body.removeChild(container);
          resolve('');
        }
      }, 500);
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (scope === 'current') {
        const slideToExport = project.slides[activeSlideIndex];
        const dataUrl = await renderHiddenSlideAndCapture(slideToExport, project.background);
        
        if (!dataUrl) throw new Error("Failed to generate image data");
          
        if (format === 'pdf') {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [1080, 1350]
          });
          pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1350);
          pdf.save(`${project.name || 'slide'}.pdf`);
        } else {
          const link = document.createElement('a');
          link.download = `${project.name || 'slide'}.${format}`;
          link.href = dataUrl;
          link.click();
        }
      } else {
        // Export all slides
        if (format === 'pdf') {
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1350] });
          for (let i = 0; i < project.slides.length; i++) {
            const dataUrl = await renderHiddenSlideAndCapture(project.slides[i], project.background);
            if (!dataUrl) continue;
            if (i > 0) pdf.addPage([1080, 1350], 'portrait');
            pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1350);
          }
          pdf.save(`${project.name || 'carousel'}.pdf`);
        } else {
           for (let i = 0; i < project.slides.length; i++) {
            const dataUrl = await renderHiddenSlideAndCapture(project.slides[i], project.background);
            if (!dataUrl) continue;
            const link = document.createElement('a');
            link.download = `${project.name || 'slide'}-${i + 1}.${format}`;
            link.href = dataUrl;
            link.click();
            // Add a small delay between downloads
            await new Promise(r => setTimeout(r, 200));
          }
        }
      }
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
      onClose();
    }
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
        className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-4xl h-[90vh] md:h-[80vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10"
      >
        {/* Preview Side */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black/50 p-4 md:p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
          
          <div className="w-full h-full max-h-full flex items-center justify-center relative">
            {isPreviewLoading ? (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <p className="text-sm font-medium">Generating preview...</p>
              </div>
            ) : previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Export preview" 
                className="w-auto h-auto max-w-[85%] max-h-[90%] object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
              />
            ) : null}
          </div>
        </div>

        {/* Settings Side */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-[#111111]">
          <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-bold text-white">Export Project</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Format</label>
                <p className="text-xs text-gray-400 mt-1 mb-3">Choose the file format for your export.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['png', 'jpg', 'pdf'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={cn(
                      "py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all uppercase tracking-wider",
                      format === f ? "bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-sm font-semibold text-white">Scope</label>
                <p className="text-xs text-gray-400 mt-1 mb-3">Export just this slide or the entire carousel.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setScope('current')}
                  className={cn(
                    "py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all",
                    scope === 'current' ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  Current Slide
                </button>
                <button
                  onClick={() => setScope('all')}
                  className={cn(
                    "py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all",
                    scope === 'all' ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  All Slides
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-4 rounded-xl text-base font-bold bg-white text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98]"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isExporting ? 'Exporting...' : 'Export Now'}
            </button>
            <button 
              onClick={onClose}
              className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
