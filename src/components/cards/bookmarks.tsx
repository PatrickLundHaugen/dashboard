import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { RxCross2 } from "react-icons/rx";

function Bookmarks() {
  const [link, setLink] = useState<string>("");
  const [links, setLinks] = useState<string[]>(() => {
    const storedLinks = localStorage.getItem("bookmarks");
    if (storedLinks) {
      try {
        return JSON.parse(storedLinks);
      } catch {
        return [];
      }
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(links));
  }, [links]);

  const handleSubmit = () => {
    if (link.trim()) {
      const formattedLink =
        link.startsWith("http://") || link.startsWith("https://")
          ? link
          : `https://${link.trim()}`;

      if (!links.includes(formattedLink)) {
        setLinks((prevLinks) => [...prevLinks, formattedLink]);
      }
      setLink("");
    }
  };

  const handleRemove = (indexToRemove: number) => {
    setLinks((prevLinks) =>
      prevLinks.filter((_, index) => index !== indexToRemove),
    );
  };

  const getHostname = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch (error) {
      console.warn(`Could not parse URL: ${url}`, error);
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const hostname = getHostname(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return "";
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Bookmarks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://google.com"
          />
          <Button className="cursor-pointer" onClick={handleSubmit}>
            Add
          </Button>
        </div>
        {links.length > 0 && (
          <div className="mt-4">
            <ul className="flex flex-col gap-2 overflow-y-auto">
              {links.map((submittedLink, index) => (
                <li key={index} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={getFaviconUrl(submittedLink)}
                      alt="Favicon"
                      className="size-4 rounded"
                    />
                    <a
                      href={submittedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4 truncate max-w-44"
                    >
                      {getHostname(submittedLink)}
                    </a>
                  </div>
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                  >
                    <RxCross2 />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Bookmarks;
