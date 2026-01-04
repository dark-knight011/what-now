"use client";

interface Task {
    id: string;
    action: string;
    durationMinutes: number;
}

export default function NowView({
    task,
    onDone,
    onStuck,
}: {
    task: Task;
    onDone: () => void;
    onStuck: () => void;
}) {
    return (
        <div className="bg-background text-foreground font-body selection:bg-primary/30 overflow-hidden min-h-screen w-full relative flex items-center justify-center">
            {/* Background decorative gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-mesh pointer-events-none w-full h-full opacity-60"></div>

            {/* Main Container - Centered Group */}
            <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-6 justify-center min-h-screen py-12 gap-12">

                {/* Central Content: The Task */}
                <div className="flex flex-col justify-center items-center text-center px-4 shrink-0">
                    {/* Icon - Balanced size */}
                    <div className="mb-6 sm:mb-8 p-4 rounded-full bg-surface/40 border border-white/10 backdrop-blur-md shadow-xl animate-pulse ring-1 ring-white/5">
                        <span className="material-symbols-outlined text-primary text-3xl drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">target</span>
                    </div>

                    {/* Task Text - Prominent but not shouting */}
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-3xl leading-tight tracking-tight text-foreground drop-shadow-sm max-w-md mx-auto">
                        {task.action}
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-4 sm:mt-6 text-foreground/50 text-xs sm:text-sm font-semibold tracking-widest uppercase opacity-70">
                        Focus now
                    </p>
                </div>

                {/* Action Stack - Grouped with content, not at bottom edge */}
                <div className="w-full flex flex-col gap-3 sm:gap-4 shrink-0">
                    {/* Primary Action: Done */}
                    <button
                        onClick={onDone}
                        className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 hover:h-[58px] bg-accent hover:bg-emerald-400 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(38,217,166,0.25)] hover:shadow-[0_0_30px_rgba(38,217,166,0.4)] border border-white/10"
                    >
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="material-symbols-outlined mr-2 text-white font-bold text-xl">check</span>
                        <span className="text-white text-base font-bold tracking-wide font-body">Done</span>
                    </button>

                    {/* Secondary Action: I'm Stuck */}
                    <button
                        onClick={onStuck}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-12 bg-surface/30 border border-white/5 hover:bg-surface/50 hover:border-white/10 active:bg-surface/60 text-foreground/70 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined mr-2 text-lg opacity-70">help</span>
                        <span className="text-sm font-medium tracking-wide font-body">I'm stuck</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
