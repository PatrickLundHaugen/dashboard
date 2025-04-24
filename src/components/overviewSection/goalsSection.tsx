import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LiaPlusSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa";
import { Separator } from "@/components/ui/separator.tsx";
import { Input } from "@/components/ui/input.tsx";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";

interface Goal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  // Load goals from localStorage on page load
  useEffect(() => {
    const storedGoals: Goal[] = JSON.parse(
      localStorage.getItem("goals") || "[]",
    );
    setGoals(storedGoals);
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.trim() || !newDescription.trim()) return;

    const updatedGoals: Goal[] = [
      ...goals,
      {
        id: Date.now(),
        title: newGoal,
        description: newDescription,
        completed: false,
      },
    ];
    setGoals(updatedGoals);
    setNewGoal("");
    setNewDescription("");
  };

  const toggleGoal = (id: number) => {
    const updatedGoals: Goal[] = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal,
    );
    setGoals(updatedGoals);
  };

  const deleteGoal = (id: number) => {
    const updatedGoals: Goal[] = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex-row justify-between">
          <CardTitle>Goals</CardTitle>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="icon">
                <LiaPlusSolid />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add goal</DialogTitle>
                <DialogDescription>
                  Add a future goal you can work towards.
                </DialogDescription>
              </DialogHeader>
              <label className="text-sm font-medium leading-none">Goal</label>
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter a goal"
                maxLength={50}
              />
              <label className="text-sm font-medium leading-none">
                Description
              </label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add a description"
                maxLength={50}
              />
              <DialogFooter>
                <Button onClick={addGoal}>Add goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="flex flex-col">
          {goals.length === 0 ? (
            <p className="flex text-muted-foreground">No goals added yet.</p>
          ) : (
            goals.map((goal) => (
              <>
                <div key={goal.id} className="flex justify-between">
                  <div className="flex gap-4">
                    <label className="flex items-center relative">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleGoal(goal.id)}
                        className="peer size-8 transition-all appearance-none rounded shadow-sm border checked:bg-green-600 focus-visible:outline-none focus-visible:ring-2"
                      />
                      <span className="absolute opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaCheck className="p-0.5" />
                      </span>
                    </label>
                    <div className="flex flex-col">
                      <p className="font-semibold leading-none tracking-tight">
                        {goal.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500"
                  >
                    <RxCross2 />
                  </Button>
                </div>
                <Separator className="my-2" />
              </>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default GoalsSection;
