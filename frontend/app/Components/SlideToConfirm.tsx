import { useState, useRef } from 'react';

const SlideToConfirm = ({ onConfirm }: { onConfirm: () => void }) => {
  const [dragX, setDragX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current && dragX > containerRef.current.offsetWidth - 80) {
      setConfirmed(true);
      onConfirm();
    } else {
      setDragX(0); // Reset position if not fully dragged
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width - 60);
      setDragX(newX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-12 ${confirmed ? "bg-red-700" : "bg-gray-200"} select-none overflow-hidden`}
    >
      {!confirmed && (
        <p className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-gray-900 text-md">
          Slide to Report..
        </p>
      )}
      {confirmed && (
        <p className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-green-600 font-semibold">
          Reported!
        </p>
      )}

      {!confirmed && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-1/2 transform -translate-y-1/2 left-0 w-12 h-12 bg-white mx-2 shadow-md cursor-pointer transition-all"
          style={{ transform: `translate(${dragX}px, -50%)` }}
        ></div>
      )}
    </div>
  );
};

export default SlideToConfirm;
