import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Generate actual design-focused content with illustration URLs
    const designContent = Array.from({ length: 12 }, (_, i) => {
      const designTypes = [
        { 
          category: 'Vector Logo Design', 
          description: 'Professional vector logo concepts and scalable brand marks',
          imageBase: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Vector+Logo'
        },
        { 
          category: '3D Render Design', 
          description: 'Modern 3D illustrations and dimensional graphics',
          imageBase: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=3D+Render'
        },
        { 
          category: 'Game UI Design', 
          description: 'Gaming interface designs and interactive elements',
          imageBase: 'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Game+UI'
        },
        { 
          category: 'Icon Set Design', 
          description: 'Scalable vector icon collections and symbol systems',
          imageBase: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Icon+Set'
        },
        { 
          category: 'Illustration Art', 
          description: 'Digital illustrations and vector artwork',
          imageBase: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Illustration'
        },
        { 
          category: 'Brand Graphics', 
          description: 'Complete visual identity and branding elements',
          imageBase: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Brand+Graphics'
        }
      ];

      const designType = designTypes[i % designTypes.length];
      
      return {
        id: `design_${Date.now()}_${i}`,
        title: `${designType.category} Collection`,
        imageUrl: