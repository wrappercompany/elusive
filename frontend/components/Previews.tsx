import React from 'react';
import Iphone15Pro from './magicui/iphone-15-pro';

interface PreviewsProps {
  projectId: string;
}

export function Previews({ projectId }: PreviewsProps) {
  // Use the original SVG size for the phone
  const baseWidth = 433;
  const baseHeight = 882;
  // Target display width
  const targetWidth = 300;
  const scale = targetWidth / baseWidth;

  // Screen area in SVG coordinates
  const screenX = 21.25;
  const screenY = 19.25;
  const screenWidth = 389.5;
  const screenHeight = 843.5;
  const borderRadius = 55.75;

  return (
    <div className="h-full w-full flex justify-center items-center bg-[#fafafafa]">
      <div
        className="relative"
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {/* SVG phone frame */}
        <Iphone15Pro width={baseWidth} height={baseHeight} />
        {/* Overlay for the iframe, perfectly aligned */}
        <div
          style={{
            position: 'absolute',
            left: screenX,
            top: screenY,
            width: screenWidth,
            height: screenHeight,
            borderRadius: borderRadius,
            overflow: 'hidden',
            pointerEvents: 'auto',
          }}
        >
          <iframe
            src="http://localhost:19006/"
            width={screenWidth}
            height={screenHeight}
            className="border-0 object-cover"
            title="Preview"
            style={{ borderRadius: borderRadius, width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
} 