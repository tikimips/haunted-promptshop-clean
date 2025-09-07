'use client';

import { useCallback, useRef, useState } from 'react';

export default function DropZone({
  onSelect,
}: {
  onSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onSelect(file);
    },
    [onSelect]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div className="space-y-3">
      {/* Desktop drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        className={[
          'relative flex h-40 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition',
          isOver ? 'border-black bg-black/[0.03]' : 'border-gray-300 hover:bg-gray-50',
        ].join(' ')}
        onClick={() => inputRef.current?.click()}
      >
        <div className="text-center">
          <div className="text-sm font-medium">Drag & drop an image here</div>
          <div className="text-xs text-gray-600">or click to choose from your device</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>

      {/* Mobile-friendly quick actions */}
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => inputRef.current?.click()}
        >
          Choose from library
        </button>
        <button
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => cameraRef.current?.click()}
        >
          Take a photo
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
