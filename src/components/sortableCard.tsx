import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type CardId = "notes" | "bookmarks" | "chat" | "tasks";

interface SortableCardProps {
  id: CardId;
  children: React.ReactNode;
  isEditing: boolean;
  size: { x: number; y: number };
  onResize: (id: CardId, size: { x: number; y: number }) => void;
}

export default function SortableCard({
  id,
  children,
  isEditing,
  size,
  onResize,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    gridColumn: `span ${size.x} / span ${size.x}`,
    gridRow: `span ${size.y} / span ${size.y}`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? attributes : {})}
      {...(isEditing ? listeners : {})}
    >
      <div className="relative w-full h-full">
        {children}

        {isEditing && (
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center rounded-xl">
            <div
              className="flex gap-2 items-center bg-card border rounded-xl shadow p-4"
              // Prevent dragging by disabling pointer events on resize dialog
              onPointerDown={(e) => e.stopPropagation()}
            >
              <label htmlFor={`x-${id}`}>X:</label>
              <select
                id={`x-${id}`}
                value={size.x}
                onChange={(e) =>
                  onResize(id, { x: Number(e.target.value), y: size.y })
                }
                className="border rounded px-1 text-sm"
              >
                {[1, 2, 3, 4].map((x) => (
                  <option key={x} value={x} className="text-black">
                    {x}
                  </option>
                ))}
              </select>
              <label htmlFor={`y-${id}`}>Y:</label>
              <select
                id={`y-${id}`}
                value={size.y}
                onChange={(e) =>
                  onResize(id, { x: size.x, y: Number(e.target.value) })
                }
                className="border rounded px-1 text-sm"
              >
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y} className="text-black">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
