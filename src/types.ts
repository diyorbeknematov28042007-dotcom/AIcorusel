export type ElementType = 'headline' | 'body' | 'subline' | 'username' | 'pageNumber' | 'logo' | 'image' | 'badge' | 'customNote';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  fontFamily?: string;
  opacity?: number;
  isHidden?: boolean;
  isLocked?: boolean;
  zIndex: number;
  backgroundColor?: string;
  borderRadius?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface Template {
  id: string;
  name: string;
  category: string;
  background: string;
  elements: CanvasElement[];
}

export interface Project {
  id: string;
  name: string;
  updatedAt: number;
  slides: CanvasElement[][]; // Each slide is an array of elements
  background: string;
  templateId: string;
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  activeSlideIndex: number;
  selectedElementId: string | null;
}
