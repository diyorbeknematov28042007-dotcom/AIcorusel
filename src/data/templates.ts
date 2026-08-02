import { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'Minimal',
    background: '#090909',
    elements: [
      { type: 'username', x: 60, y: 60, content: '@username', color: '#9a9a9a', fontSize: 24, zIndex: 1, id: '' },
      { type: 'headline', x: 60, y: 300, content: 'Domen nima?', color: '#ffffff', fontSize: 72, fontWeight: '700', zIndex: 1, id: '' },
      { type: 'body', x: 60, y: 500, content: 'Saytingizning internetdagi manzili.', color: '#9a9a9a', fontSize: 32, zIndex: 1, id: '' },
      { type: 'subline', x: 60, y: 700, content: 'O’z domen = ishonch + brend.', color: '#a855f7', fontSize: 28, fontWeight: '600', zIndex: 1, id: '' },
      { type: 'pageNumber', x: 960, y: 1250, content: '01', color: '#9a9a9a', fontSize: 24, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    category: 'Light',
    background: '#ffffff',
    elements: [
      { type: 'username', x: 60, y: 60, content: '@username', color: '#666666', fontSize: 24, zIndex: 1, id: '' },
      { type: 'headline', x: 60, y: 300, content: 'Clean Design', color: '#111111', fontSize: 72, fontWeight: '700', zIndex: 1, id: '' },
      { type: 'body', x: 60, y: 500, content: 'Simplicity is the ultimate sophistication.', color: '#666666', fontSize: 32, zIndex: 1, id: '' },
      { type: 'pageNumber', x: 960, y: 1250, content: '02', color: '#666666', fontSize: 24, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'purple-tech',
    name: 'Purple Tech',
    category: 'Tech',
    background: '#1a1025',
    elements: [
      { type: 'username', x: 80, y: 80, content: '@tech_guru', color: '#e5e7eb', fontSize: 24, zIndex: 1, id: '' },
      { type: 'headline', x: 80, y: 400, content: 'AI is changing everything', color: '#ffffff', fontSize: 72, fontWeight: '700', zIndex: 1, id: '' },
      { type: 'body', x: 80, y: 600, content: 'Are you ready for the future?', color: '#d1d5db', fontSize: 32, zIndex: 1, id: '' },
      { type: 'pageNumber', x: 940, y: 1220, content: '01', color: '#a855f7', fontSize: 32, fontWeight: '700', zIndex: 1, id: '' }
    ]
  },
  {
    id: 'apple-style',
    name: 'Apple Style',
    category: 'Apple Style',
    background: '#f5f5f7',
    elements: [
      { type: 'headline', x: 0, y: 400, content: 'Pro cameras.\nPro display.\nPro performance.', color: '#1d1d1f', fontSize: 64, fontWeight: '700', textAlign: 'center', width: 1080, zIndex: 1, id: '' },
      { type: 'body', x: 0, y: 650, content: 'Meet the new generation.', color: '#86868b', fontSize: 32, textAlign: 'center', width: 1080, zIndex: 1, id: '' },
      { type: 'username', x: 60, y: 60, content: '@apple_fan', color: '#86868b', fontSize: 20, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'startup-bold',
    name: 'Startup',
    category: 'Startup',
    background: '#f8fafc',
    elements: [
      { type: 'badge', x: 60, y: 100, content: 'TUTORIAL', color: '#ffffff', backgroundColor: '#3b82f6', fontSize: 20, zIndex: 1, id: '', borderRadius: 8 },
      { type: 'headline', x: 60, y: 200, content: 'How to build an app', color: '#0f172a', fontSize: 84, fontWeight: '800', zIndex: 1, id: '' },
      { type: 'body', x: 60, y: 500, content: 'Step by step guide for beginners.', color: '#475569', fontSize: 36, zIndex: 1, id: '' },
      { type: 'username', x: 60, y: 1200, content: '@startup_founder', color: '#64748b', fontSize: 24, zIndex: 1, id: '' },
      { type: 'pageNumber', x: 960, y: 1200, content: '1/8', color: '#0f172a', fontSize: 24, fontWeight: '700', zIndex: 1, id: '' }
    ]
  },
  {
    id: 'legal-serif',
    name: 'Legal Serif',
    category: 'Legal',
    background: '#f4f1ea',
    elements: [
      { type: 'headline', x: 80, y: 250, content: 'Terms you need to know', color: '#2c3e50', fontSize: 68, fontWeight: '600', fontFamily: 'serif', zIndex: 1, id: '' },
      { type: 'body', x: 80, y: 450, content: 'A quick guide to reading contracts.', color: '#34495e', fontSize: 28, fontFamily: 'serif', zIndex: 1, id: '' },
      { type: 'subline', x: 80, y: 1150, content: 'Disclaimer: Not legal advice.', color: '#7f8c8d', fontSize: 18, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'education-cards',
    name: 'Education',
    category: 'Education',
    background: '#eff6ff',
    elements: [
      { type: 'badge', x: 60, y: 120, content: 'LESSON 1', color: '#1e40af', backgroundColor: '#dbeafe', fontSize: 18, fontWeight: '700', zIndex: 1, id: '', borderRadius: 4 },
      { type: 'headline', x: 60, y: 220, content: 'Understanding React State', color: '#1e3a8a', fontSize: 72, fontWeight: '700', zIndex: 1, id: '' },
      { type: 'body', x: 60, y: 450, content: 'State is like the memory of a component.', color: '#3b82f6', fontSize: 32, zIndex: 1, id: '' },
      { type: 'username', x: 60, y: 1220, content: '@code_teacher', color: '#93c5fd', fontSize: 22, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'gradient-pop',
    name: 'Gradient Pop',
    category: 'Gradient',
    background: '#ffecd2',
    elements: [
      { type: 'headline', x: 60, y: 350, content: 'Stand Out', color: '#fcb69f', fontSize: 96, fontWeight: '900', zIndex: 1, id: '' },
      { type: 'body', x: 60, y: 550, content: 'Be different in a sea of sameness.', color: '#333333', fontSize: 36, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'modern-black',
    name: 'Modern Black',
    category: 'Modern',
    background: '#000000',
    elements: [
      { type: 'headline', x: 80, y: 300, content: 'FUTURE.', color: '#ffffff', fontSize: 120, fontWeight: '900', zIndex: 1, id: '' },
      { type: 'subline', x: 80, y: 500, content: 'It is already here.', color: '#555555', fontSize: 40, fontWeight: '400', zIndex: 1, id: '' }
    ]
  },
  {
    id: 'notion-style',
    name: 'Notion Style',
    category: 'Modern',
    background: '#ffffff',
    elements: [
      { type: 'username', x: 80, y: 80, content: '📝 Notes', color: '#37352f', fontSize: 28, zIndex: 1, id: '' },
      { type: 'headline', x: 80, y: 250, content: 'How I organize my life', color: '#37352f', fontSize: 64, fontWeight: '700', zIndex: 1, id: '' },
      { type: 'body', x: 80, y: 450, content: '- Daily planner\n- Habit tracker\n- Reading list', color: '#37352f', fontSize: 32, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'linear-style',
    name: 'Linear Style',
    category: 'Dark',
    background: '#131318',
    elements: [
      { type: 'badge', x: 80, y: 150, content: 'Changelog', color: '#8a8f98', backgroundColor: 'transparent', fontSize: 18, zIndex: 1, id: '' },
      { type: 'headline', x: 80, y: 250, content: 'Introducing Cycles', color: '#ffffff', fontSize: 64, fontWeight: '600', zIndex: 1, id: '' },
      { type: 'body', x: 80, y: 400, content: 'A better way to plan your work.', color: '#8a8f98', fontSize: 32, zIndex: 1, id: '' }
    ]
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'Modern',
    background: '#1f2937', // We would normally use a complex bg here
    elements: [
      { type: 'badge', x: 100, y: 100, content: 'New Trend', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)', fontSize: 18, zIndex: 1, id: '', borderRadius: 20 },
      { type: 'headline', x: 100, y: 300, content: 'Glass UI', color: '#f3f4f6', fontSize: 80, fontWeight: 'bold', zIndex: 1, id: '' },
      { type: 'body', x: 100, y: 500, content: 'Translucent, frosted-glass effects.', color: '#9ca3af', fontSize: 36, zIndex: 1, id: '' }
    ]
  }
];

export const categories = ['All', 'Minimal', 'Startup', 'Education', 'Legal', 'Tech', 'Gradient', 'Apple Style', 'Modern', 'Dark', 'Light'];
