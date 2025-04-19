'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const createAndRedirect = async () => {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'New Project' })
        });
        
        if (!response.ok) throw new Error('Failed to create project');
        
        const project = await response.json();
        console.log('Created project:', project);
        
        if (!project.id) {
          throw new Error('No project ID received');
        }
        
        router.push(`/p/${project.id}`);
      } catch (error) {
        console.error('Error creating project:', error);
      }
    };

    createAndRedirect();
  }, [router]);

  return (
    <div className="container mx-auto p-6 flex items-center justify-center h-screen">
      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
