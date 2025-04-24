import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { RxCross2 } from "react-icons/rx";
import { IoMdRefresh } from "react-icons/io";

type Task = {
  name: string;
  interval: number;
  startDate: string;
};

function Tasks() {
  const [name, setName] = useState("");
  const [interval, setInterval] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        const parsedTasks = JSON.parse(stored);
        if (
          Array.isArray(parsedTasks) &&
          parsedTasks.every(
            (task) =>
              typeof task === "object" &&
              task !== null &&
              "name" in task &&
              "interval" in task &&
              "startDate" in task,
          )
        ) {
          return parsedTasks;
        } else {
          localStorage.removeItem("tasks");
          return [];
        }
      } else {
        return [];
      }
    } catch {
      localStorage.removeItem("tasks");
      return [];
    }
  });

  const addTask = () => {
    if (!name.trim()) return;
    const parsedInterval = parseInt(interval, 10);
    setTasks([
      ...tasks,
      {
        name: name.trim(),
        interval: isNaN(parsedInterval) ? 14 : parsedInterval,
        startDate: new Date().toISOString(),
      },
    ]);
    setName("");
    setInterval(""); // clear field after
  };

  const refreshTask = (index: number) => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      const taskToRefresh = updated[index];

      if (taskToRefresh) {
        try {
          const currentStartDate = new Date(taskToRefresh.startDate);
          const interval = taskToRefresh.interval;

          if (isNaN(currentStartDate.getTime())) {
            return prevTasks;
          }

          const currentDueDate = new Date(currentStartDate);
          currentDueDate.setDate(currentStartDate.getDate() + interval);

          updated[index] = {
            ...taskToRefresh,
            startDate: currentDueDate.toISOString(),
          };
        } catch {
          return prevTasks;
        }
      } else {
        return prevTasks;
      }
      return updated;
    });
  };

  const deleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const getDaysLeft = (startDate: string, interval: number) => {
    try {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return { daysLeft: NaN, targetDate: "Invalid Date" };
      }
      const end = new Date(start);
      end.setDate(start.getDate() + interval);
      const now = new Date();
      const diff = Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const formattedDate = `${end.getDate().toString().padStart(2, "0")}.${(
        end.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${end.getFullYear()}`;
      return { daysLeft: diff, targetDate: formattedDate };
    } catch {
      return { daysLeft: NaN, targetDate: "Error" };
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Task name"
            className="flex-1"
          />
          <Input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            placeholder="7"
            min={1}
            className="w-20"
          />
          <Button onClick={addTask}>Add</Button>
        </div>

        <ul className="flex flex-col gap-2">
          {tasks.map((task, index) => {
            const { daysLeft, targetDate } = getDaysLeft(
              task.startDate,
              task.interval,
            );
            return (
              <li key={index} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-medium">{task.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {isNaN(daysLeft)
                      ? targetDate
                      : `${targetDate} (${daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? `Today` : `${Math.abs(daysLeft)} days overdue`})`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => refreshTask(index)}
                    title="Refresh"
                  >
                    <IoMdRefresh />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTask(index)}
                    title="Delete Task"
                  >
                    <RxCross2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground">
            No tasks yet. Add one above!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default Tasks;
