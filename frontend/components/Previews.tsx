import React from 'react';

export function Previews() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full" style={{ aspectRatio: '19.5/9' }}>
        <iframe 
          src="http://localhost:19006/" 
          className="w-full h-full border-0 rounded-md"
          title="Preview"
        />
      </div>
    </div>
  );
} 