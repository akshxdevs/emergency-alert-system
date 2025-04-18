import { useState, useRef, useEffect } from 'react';

export const SlideToConfirm = ({ onConfirm }: { onConfirm: () => void }) => {
  const [dragX, setDragX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const knobWidth = 48;

  const handleDrag = (clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.min(
      Math.max(clientX - rect.left, 0),
      rect.width - knobWidth
    );
    setDragX(newX);
  };

  const handleMouseDown = () => {
    if (!confirmed) {
      isDragging.current = true;
    }
  };

  const handleEnd = () => {
    if (!containerRef.current) return;
    isDragging.current = false;

    const rect = containerRef.current.getBoundingClientRect();
    const threshold = rect.width - knobWidth - 10;

    if (dragX >= threshold) {
      setConfirmed(true);
      onConfirm();
    } else {
      setDragX(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => handleDrag(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleDrag(e.touches[0].clientX);

  useEffect(() => {
    const handleMouseUp = () => handleEnd();
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragX]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative w-full max-w-md h-14 mx-auto px-2 rounded-full select-none overflow-hidden transition-colors duration-300 ${
        confirmed ? 'bg-green-600' : 'bg-gray-200'
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className={`text-sm font-medium ${confirmed ? 'text-white' : 'text-gray-700'}`}>
          {confirmed ? 'Reported!' : 'Slide to Report'}
        </p>
      </div>

      {!confirmed && (
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.3s ease',
          }}
          className="absolute top-1 left-0 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer z-10"
        >
          <img
            src="https://img.icons8.com/dotty/80/1A1A1A/forward.png"
            alt="slide"
            width="20"
            height="20"
          />
        </div>
      )}
    </div>
  );
};
