import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ai } from "@/components/cards/chatAI/textGeneration";
import { GenerateContentResponse } from "@google/genai";
import { FaArrowUp } from "react-icons/fa6";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import ReactMarkdown from "react-markdown";

interface ChatSession {
  sendMessageStream: (options: {
    message: string;
  }) => Promise<AsyncIterable<GenerateContentResponse>>;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

function Chat() {
  const chatRef = useRef<ChatSession | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const initializeChat = useCallback(() => {
    chatRef.current = ai.chats.create({
      model: "gemini-1.5-pro",
      history: [],
    });
    setMessages([]);
    setLoading(false);
    setText("");
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!text.trim() || loading || !chatRef.current?.sendMessageStream) return;

    const userMessage: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    const stream = await chatRef.current.sendMessageStream({ message: text });

    let aiText = "";
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    for await (const chunk of stream) {
      const content = chunk.text;
      if (content !== undefined && content !== null) {
        aiText += content;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "ai") {
            updated[updated.length - 1] = { role: "ai", text: aiText };
          }
          return updated;
        });
      }
    }

    setLoading(false);
  }, [text, loading]);

  const handleReset = useCallback(() => {
    initializeChat();
  }, [initializeChat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleSendClick = useCallback(() => {
    handleSend();
  }, [handleSend]);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-row justify-between">
        <CardTitle>Chat</CardTitle>
        <Button
          aria-label="Reset chat"
          variant="outline"
          size="icon"
          onClick={handleReset}
        >
          <IoMdRefresh />
        </Button>
      </CardHeader>

      <CardContent
        ref={scrollRef}
        className="flex-1 flex flex-col gap-4 overflow-auto scroll-smooth"
        aria-live="polite"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.role === "user"
                ? "ml-auto bg-primary-foreground w-fit p-4 rounded-xl" // user style
                : "mr-auto" // AI style
            }`}
          >
            {msg.role === "ai" && msg.text ? (
              <ReactMarkdown
                components={{
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mt-1 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  p: ({ children }) => (
                    <p className="mb-1 last:mb-0">{children}</p>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
            Gemini is thinking...
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Input
          placeholder="Ask Gemini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat input"
          className={`${
            loading ? "pointer-events-none focus-visible:ring-0" : ""
          }`}
          readOnly={loading}
        />

        <Button
          className="shrink-0"
          size="icon"
          onClick={handleSendClick}
          disabled={loading}
          aria-label="Send message"
        >
          <FaArrowUp />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Chat;
