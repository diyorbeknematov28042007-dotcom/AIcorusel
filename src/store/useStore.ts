import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, CanvasElement, Template } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { templates } from '../data/templates';

interface StoreState {
  projects: Project[];
  currentProjectId: string | null;
  activeSlideIndex: number;
  selectedElementId: string | null;
  theme: string;
  isMobileSidebarOpen: boolean;
  setTheme: (theme: string) => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  createProject: (template: Template) => void;
  loadProject: (id: string) => void;
  updateProjectName: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  addSlide: () => void;
  duplicateSlide: (index: number) => void;
  deleteSlide: (index: number) => void;
  setActiveSlide: (index: number) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  addElement: (element: Partial<CanvasElement>) => void;
  selectElement: (id: string | null) => void;
  closeProject: () => void;
  updateProjectBackground: (bg: string) => void;
  applyThemeToProject: (color: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      activeSlideIndex: 0,
      selectedElementId: null,
      theme: 'dark',
      isMobileSidebarOpen: false,
      
      setTheme: (theme) => set({ theme }),
      setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),

      createProject: (template) => {
        const newProject: Project = {
          id: uuidv4(),
          name: 'Untitled Project',
          updatedAt: Date.now(),
          slides: [
            template.elements.map(el => ({ ...el, id: uuidv4() }))
          ],
          background: template.background,
          templateId: template.id
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id,
          activeSlideIndex: 0,
          selectedElementId: null
        }));
      },

      loadProject: (id) => {
        set({ currentProjectId: id, activeSlideIndex: 0, selectedElementId: null });
      },

      closeProject: () => {
        set({ currentProjectId: null, activeSlideIndex: 0, selectedElementId: null });
      },

      updateProjectName: (id, name) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: Date.now() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
        }));
      },

      duplicateProject: (id) => {
        const state = get();
        const projectToDuplicate = state.projects.find(p => p.id === id);
        if (projectToDuplicate) {
          const newProject = {
            ...projectToDuplicate,
            id: uuidv4(),
            name: `${projectToDuplicate.name} (Copy)`,
            slides: projectToDuplicate.slides.map(slide => slide.map(el => ({ ...el, id: uuidv4() }))),
            updatedAt: Date.now()
          };
          set({ projects: [...state.projects, newProject] });
        }
      },

      addSlide: () => {
        const state = get();
        if (!state.currentProjectId) return;
        
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project) return;
        
        const template = templates.find(t => t.id === project.templateId) || templates[0];
        
        const newSlide = template.elements.map(el => ({ ...el, id: uuidv4() }));
        
        set((state) => ({
          projects: state.projects.map(p => {
            if (p.id === state.currentProjectId) {
              return { ...p, slides: [...p.slides, newSlide], updatedAt: Date.now() };
            }
            return p;
          }),
          activeSlideIndex: project.slides.length
        }));
      },
      
      duplicateSlide: (index) => {
        const state = get();
        if (!state.currentProjectId) return;
        
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project) return;
        
        const slideToDuplicate = project.slides[index];
        const newSlide = slideToDuplicate.map(el => ({ ...el, id: uuidv4() }));
        
        const newSlides = [...project.slides];
        newSlides.splice(index + 1, 0, newSlide);
        
        set((state) => ({
          projects: state.projects.map(p => {
            if (p.id === state.currentProjectId) {
              return { ...p, slides: newSlides, updatedAt: Date.now() };
            }
            return p;
          }),
          activeSlideIndex: index + 1
        }));
      },

      deleteSlide: (index) => {
        set((state) => {
          if (!state.currentProjectId) return state;
          
          return {
            projects: state.projects.map(p => {
              if (p.id === state.currentProjectId) {
                const newSlides = [...p.slides];
                if (newSlides.length > 1) {
                  newSlides.splice(index, 1);
                }
                return { ...p, slides: newSlides, updatedAt: Date.now() };
              }
              return p;
            }),
            activeSlideIndex: Math.max(0, state.activeSlideIndex >= index ? state.activeSlideIndex - 1 : state.activeSlideIndex)
          };
        });
      },

      setActiveSlide: (index) => set({ activeSlideIndex: index, selectedElementId: null }),
      
      selectElement: (id) => set((state) => ({ 
        selectedElementId: id,
        isMobileSidebarOpen: id !== null ? true : state.isMobileSidebarOpen
      })),

      updateElement: (id, updates) => {
        set((state) => {
          if (!state.currentProjectId) return state;
          
          return {
            projects: state.projects.map(p => {
              if (p.id === state.currentProjectId) {
                const newSlides = [...p.slides];
                const slide = newSlides[state.activeSlideIndex];
                
                newSlides[state.activeSlideIndex] = slide.map(el => 
                  el.id === id ? { ...el, ...updates } : el
                );
                
                return { ...p, slides: newSlides, updatedAt: Date.now() };
              }
              return p;
            })
          };
        });
      },
      
      deleteElement: (id) => {
        set((state) => {
          if (!state.currentProjectId) return state;
          return {
            projects: state.projects.map(p => {
              if (p.id === state.currentProjectId) {
                const newSlides = [...p.slides];
                const slide = newSlides[state.activeSlideIndex];
                newSlides[state.activeSlideIndex] = slide.filter(el => el.id !== id);
                return { ...p, slides: newSlides, updatedAt: Date.now() };
              }
              return p;
            }),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
          }
        });
      },
      
      addElement: (element) => {
        set((state) => {
          if (!state.currentProjectId) return state;
          
          const newElement: CanvasElement = {
            id: uuidv4(),
            type: element.type || 'body',
            x: element.x || 100,
            y: element.y || 100,
            content: element.content || 'New Element',
            fontSize: element.fontSize || 32,
            color: element.color || '#ffffff',
            zIndex: element.zIndex || 1,
            ...element
          };

          return {
            projects: state.projects.map(p => {
              if (p.id === state.currentProjectId) {
                const newSlides = [...p.slides];
                const slide = [...newSlides[state.activeSlideIndex]];
                slide.push(newElement);
                newSlides[state.activeSlideIndex] = slide;
                return { ...p, slides: newSlides, updatedAt: Date.now() };
              }
              return p;
            }),
            selectedElementId: newElement.id
          }
        });
      },
      
      updateProjectBackground: (bg) => {
        set((state) => {
           if (!state.currentProjectId) return state;
           return {
             projects: state.projects.map(p => 
               p.id === state.currentProjectId ? { ...p, background: bg, updatedAt: Date.now() } : p
             )
           }
        });
      },
      
      applyThemeToProject: (color) => {
        set((state) => {
          if (!state.currentProjectId) return state;
          return {
             projects: state.projects.map(p => {
               if (p.id === state.currentProjectId) {
                 const updatedSlides = p.slides.map(slide => 
                   slide.map(el => {
                     // Very simple theme apply: if it's a headline, badge, or specific element, we might color it.
                     // A better approach is to change the accent color for specific types
                     if (el.type === 'badge' || el.type === 'headline' && el.color !== '#ffffff') {
                       return { ...el, color };
                     }
                     if (el.backgroundColor && el.backgroundColor !== 'transparent') {
                       return { ...el, backgroundColor: color };
                     }
                     return el;
                   })
                 );
                 return { ...p, slides: updatedSlides, updatedAt: Date.now() }
               }
               return p;
             })
          }
        });
      }
    }),
    {
      name: 'carousel-builder-storage',
    }
  )
);
