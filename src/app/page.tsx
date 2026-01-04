"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import DumpView from "@/components/DumpView";
import NowView from "@/components/NowView";
import InterstitialView from "@/components/InterstitialView";
import FinishView from "@/components/FinishView";
import EscapeWarning from "@/components/EscapeWarning";

type ViewState = "dump" | "now" | "interstitial" | "finish";

interface Task {
  id: string;
  action: string;
  durationMinutes: number;
  status: "pending" | "done" | "skipped";
}

export default function Home() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = useSession();

  const [view, setView] = useState<ViewState>("dump");
  const [showWarning, setShowWarning] = useState(false);
  const [escapeStrikes, setEscapeStrikes] = useState<0 | 1 | 2>(0);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthPending && !session) {
      router.push("/login");
    }
  }, [session, isAuthPending, router]);

  // Get current task
  const currentTask = tasks[currentTaskIndex] || null;

  const handleDump = async (dump: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/breaktasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dump }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to break tasks");
      }

      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
        setCurrentTaskIndex(0);
        setView("now");
      } else {
        setError("Couldn't find any tasks in your brain dump. Try being more specific.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    // Mark current task as done
    setTasks((prev) =>
      prev.map((task, i) =>
        i === currentTaskIndex ? { ...task, status: "done" as const } : task
      )
    );
    setView("interstitial");
  };

  const handleStuck = async () => {
    if (!currentTask) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/shrink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: currentTask.action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shrink task");
      }

      // Replace current task with the shrunk version
      setTasks((prev) =>
        prev.map((task, i) =>
          i === currentTaskIndex
            ? { ...task, action: data.task.action, durationMinutes: data.task.durationMinutes }
            : task
        )
      );
    } catch (err) {
      console.error("Error shrinking task:", err);
      // Silently fail - user can try again
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueFromInterstitial = () => {
    // Check if there are more tasks
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length) {
      setCurrentTaskIndex(nextIndex);
      setView("now");
    } else {
      // All tasks done!
      setView("finish");
    }
  };

  const handleStartFresh = () => {
    setView("dump");
    setTasks([]);
    setCurrentTaskIndex(0);
    setEscapeStrikes(0);
    setError(null);
  };

  const handleEscapeAttempt = () => {
    if (escapeStrikes < 2) {
      setShowWarning(true);
    } else {
      // Strike 3 - end session
      setView("finish");
      setEscapeStrikes(0);
    }
  };

  const handleContinueSession = () => {
    setEscapeStrikes((prev) => (prev + 1) as 0 | 1 | 2);
    setShowWarning(false);
  };

  const handleLeaveAnyway = () => {
    setView("finish");
    setShowWarning(false);
    setEscapeStrikes(0);
  };

  // Show loading while checking auth
  if (isAuthPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated (and not pending), don't render content (useEffect will redirect)
  if (!session) {
    return null;
  }

  return (
    <>
      {view === "dump" && (
        <DumpView onSubmit={handleDump} />
      )}

      {view === "now" && currentTask && (
        <NowView
          task={currentTask}
          onDone={handleDone}
          onStuck={handleStuck}
        />
      )}

      {view === "interstitial" && (
        <InterstitialView onContinue={handleContinueFromInterstitial} />
      )}

      {view === "finish" && <FinishView onStartFresh={handleStartFresh} />}

      {/* Escape Warning Modal */}
      {showWarning && escapeStrikes < 2 && (
        <EscapeWarning
          strike={(escapeStrikes + 1) as 1 | 2}
          onContinue={handleContinueSession}
          onLeave={handleLeaveAnyway}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-error/90 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-fade-in-up">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-1 right-2 text-white/70 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-foreground/70 text-lg font-medium">Thinking...</p>
          </div>
        </div>
      )}

      {/* Dev Controls (remove in production) */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
        <button
          onClick={() => setView("dump")}
          className="px-2 py-1 text-xs bg-primary/30 hover:bg-primary/50 rounded text-white"
          title="Dump View"
        >
          D
        </button>
        <button
          onClick={() => setView("interstitial")}
          className="px-2 py-1 text-xs bg-primary/30 hover:bg-primary/50 rounded text-white"
          title="Interstitial"
        >
          I
        </button>
        <button
          onClick={() => setView("finish")}
          className="px-2 py-1 text-xs bg-primary/30 hover:bg-primary/50 rounded text-white"
          title="Finish"
        >
          F
        </button>
        <button
          onClick={handleEscapeAttempt}
          className="px-2 py-1 text-xs bg-warning/30 hover:bg-warning/50 rounded text-white"
          title={`Escape (Strike ${escapeStrikes})`}
        >
          E
        </button>
      </div>
    </>
  );
}
