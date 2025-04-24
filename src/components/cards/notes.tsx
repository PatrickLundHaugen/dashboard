import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import React, { useEffect, useRef, useState } from "react";

function Notes() {
  const localStorageKey = "userNotes";
  const [noteContent, setNoteContent] = useState<string>(() => {
    try {
      const savedNotes = localStorage.getItem(localStorageKey);
      return savedNotes || "";
    } catch (error) {
      console.error("Failed to read notes from localStorage:", error);
      return "";
    }
  });

  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, noteContent);
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  }, [noteContent]);

  useEffect(() => {
    if (
      contentEditableRef.current &&
      contentEditableRef.current.innerHTML !== noteContent
    ) {
      contentEditableRef.current.innerHTML = noteContent;
    }
  }, [noteContent]);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const currentContent = event.currentTarget.innerHTML;
    if (currentContent !== noteContent) {
      setNoteContent(currentContent);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={contentEditableRef}
          className="gutter bg-[linear-gradient(var(--primary)_0.1px,transparent_0.1rem)] bg-[length:100%_2rem] bg-[0_calc(1rem+0.6rem)] leading-[2rem] h-48 overflow-auto whitespace-pre-wrap focus:outline-none"
          contentEditable="true"
          spellCheck="false"
          onInput={handleInput}
        ></div>
      </CardContent>
    </Card>
  );
}

export default Notes;
