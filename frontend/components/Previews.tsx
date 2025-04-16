import React from 'react';

export function Previews() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-[#fafafafa]">
      <div className="mx-auto" style={{ width: '320px', height: '693px' }}>
        <iframe 
          src="http://localhost:19006/" 
          width="320"
          height="693"
          className="border-0 rounded-md"
          title="Preview"
        />
      </div>
    </div>
  );
} 