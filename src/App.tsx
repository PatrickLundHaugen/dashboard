import "./index.css";
import NavigationBar from "@/components/navigationBar.tsx";
import { ThemeProvider } from "@/components/darkMode/theme-provider.tsx";
import Overview from "@/components/overviewSection/overview.tsx";
import EditRearrangement from "@/components/editRearrangement.tsx";
import Notes from "@/components/cards/notes.tsx";
import Bookmarks from "@/components/cards/bookmarks.tsx";
import Footer from "@/components/footer.tsx";
import Chat from "@/components/cards/chatAI/chat.tsx";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import SortableCard from "@/components/sortableCard.tsx";
import Tasks from "@/components/cards/tasks.tsx";

type CardId = "notes" | "bookmarks" | "chat" | "tasks";

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeId, setActiveId] = useState<CardId | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState<CardId[]>(() => {
    const stored = localStorage.getItem("card-order");
    return stored
      ? JSON.parse(stored)
      : ["notes", "bookmarks", "chat", "tasks"];
  });
  const [cardSizes, setCardSizes] = useState<
    Record<CardId, { x: number; y: number }>
  >(() => {
    const stored = localStorage.getItem("card-sizes");
    return stored
      ? JSON.parse(stored)
      : {
          notes: { x: 1, y: 1 },
          bookmarks: { x: 1, y: 1 },
          chat: { x: 1, y: 1 },
          tasks: { x: 1, y: 1 },
        };
  });

  const updateItems = (newItems: CardId[]) => {
    setItems(newItems);
    localStorage.setItem("card-order", JSON.stringify(newItems));
  };

  const handleResize = (id: CardId, newSize: { x: number; y: number }) => {
    setCardSizes((prev) => {
      const updated = { ...prev, [id]: newSize };
      localStorage.setItem("card-sizes", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavigationBar />
      <Overview />

      <section className="px-4">
        <div className="flex justify-end py-2">
          <EditRearrangement
            isEditing={isEditing}
            onToggle={() => setIsEditing((prev) => !prev)}
          />
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveId(active.id as CardId)}
          onDragEnd={({ active, over }) => {
            const activeId = active.id as CardId;
            const overId = over?.id as CardId;

            if (activeId !== overId && overId) {
              const oldIndex = items.indexOf(activeId);
              const newIndex = items.indexOf(overId);
              updateItems(arrayMove(items, oldIndex, newIndex));
            }
            setActiveId(null);
          }}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-5 auto-rows-[minmax(16rem,_auto)] gap-4 [grid-auto-flow:row dense]">
              {items.map((id) => {
                const size = cardSizes[id];
                return (
                  <SortableCard
                    key={id}
                    id={id}
                    isEditing={isEditing}
                    size={size}
                    onResize={handleResize}
                  >
                    {id === "notes" && <Notes />}
                    {id === "bookmarks" && <Bookmarks />}
                    {id === "chat" && <Chat />}
                    {id === "tasks" && <Tasks />}
                  </SortableCard>
                );
              })}
            </div>
            <DragOverlay adjustScale={true}>
              {activeId && (
                <div className="w-full h-full">
                  {activeId === "notes" && <Notes />}
                  {activeId === "bookmarks" && <Bookmarks />}
                  {activeId === "chat" && <Chat />}
                  {activeId === "tasks" && <Tasks />}
                </div>
              )}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      </section>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
