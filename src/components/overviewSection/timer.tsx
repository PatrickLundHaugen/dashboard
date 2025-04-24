import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

function Timer() {
  const [timers, setTimers] = useState<{ name: string; time: string }[]>(() => {
    const storedTimers = localStorage.getItem("timers");
    if (storedTimers) {
      try {
        return JSON.parse(storedTimers);
      } catch {
        return [];
      }
    } else {
      return [];
    }
  });

  const [newTimer, setNewTimer] = useState<string>("");
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");
  const [currentTimer, setCurrentTimer] = useState<string | null>("00:00:00");
  const [currentTimerName, setCurrentTimerName] = useState<string>("Timer");
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem("timers", JSON.stringify(timers));
  }, [timers]);

  const formatTime = (timeInSeconds: number): string => {
    const h = Math.floor(timeInSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((timeInSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const addTimer = () => {
    if (!newTimer.trim() || !hours.trim() || !minutes.trim() || !seconds.trim())
      return;
    const time = formatTime(
      Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds),
    );
    setTimers((prevTimers) => [...prevTimers, { name: newTimer, time }]);
    setNewTimer("");
    setHours("00");
    setMinutes("00");
    setSeconds("00");
  };

  const selectTimer = (time: string, name: string) => {
    setCurrentTimer(time);
    setCurrentTimerName(name);
    const [h, m, s] = time.split(":").map(Number);
    setRemainingTime(h * 3600 + m * 60 + s);
  };

  const startTimer = () => {
    if (timerRef.current) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else if (currentTimer !== null && currentTimer !== "00:00:00") {
      startTimer();
    }
  };

  useEffect(() => {
    if (currentTimer !== null) {
      setCurrentTimer(formatTime(remainingTime));
    }
  }, [currentTimer, remainingTime]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {currentTimerName !== "Timer" ? (
            <>
              Timer -{" "}
              <span className="text-muted-foreground">{currentTimerName}</span>
            </>
          ) : (
            "Timer"
          )}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-4xl text-center">
          {currentTimer || "00:00:00"}
        </p>
      </CardContent>
      <CardFooter className="flex gap-4 *:w-full *:cursor-pointer">
        <Button onClick={toggleTimer}>
          {isRunning ? "Stop timer" : "Start timer"}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Change timer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change timer</DialogTitle>
            </DialogHeader>
            {timers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No timers available. Please add a timer.
              </p>
            ) : (
              <ul className="flex flex-col gap-6">
                {timers.map((timer, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {timer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timer.time}
                      </p>
                    </div>
                    <div className="flex gap-2 *:cursor-pointer">
                      <Button
                        variant="destructive"
                        onClick={() =>
                          setTimers(timers.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() => selectTimer(timer.time, timer.name)}
                      >
                        Select
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Separator />

            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Add title
            </p>
            <Input
              value={newTimer}
              onChange={(e) => setNewTimer(e.target.value)}
              placeholder="10 Minutes"
            />

            <div className="flex gap-2 *:grow">
              <div>
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="00"
                  min="0"
                  max="99"
                />
                <label className="text-sm text-muted-foreground">Hours</label>
              </div>
              <div>
                <Input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="00"
                  min="0"
                  max="59"
                />
                <label className="text-sm text-muted-foreground">Minutes</label>
              </div>
              <div>
                <Input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="00"
                  min="0"
                  max="59"
                />
                <label className="text-sm text-muted-foreground">Seconds</label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addTimer} className="cursor-pointer">
                Add timer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default Timer;
