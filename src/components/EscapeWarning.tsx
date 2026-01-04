"use client";

export default function EscapeWarning({
    strike,
    onContinue,
    onLeave,
}: {
    strike: 1 | 2;
    onContinue: () => void;
    onLeave: () => void;
}) {
    const messages = {
        1: {
            title: "Trying to escape?",
            body: (
                <>
                    Stay focused. This is <span className="text-primary font-semibold">Strike 1</span>.<br />
                    You are building a habit.
                </>
            ),
        },
        2: {
            title: "This is the second warning.",
            body: (
                <>
                    One more and the session ends.<br />
                    <span className="text-warning font-semibold">Strike 2</span> of 3.
                </>
            ),
        },
    };

    const message = messages[strike];

    return (
        <div className="absolute inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            {/* Background Context (blurred app) */}
            <div aria-hidden="true" className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                {/* Abstract gradient blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] opacity-30"></div>
            </div>

            {/* Central Glass Card */}
            <div className="relative w-full max-w-[340px] glass rounded-3xl p-8 flex flex-col items-center text-center transform transition-all shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                {/* Decorative inner glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none"></div>

                {/* Icon Visual */}
                <div className="relative mb-6 group">
                    {/* Icon Glow */}
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl scale-110 group-hover:scale-125 transition-transform duration-700"></div>

                    {/* Icon Container */}
                    <div className="relative flex items-center justify-center w-20 h-20 bg-background border border-white/10 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-primary text-[40px] drop-shadow-[0_0_8px_rgba(107,70,255,0.8)]">
                            shield_lock
                        </span>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="font-heading text-foreground text-[32px] font-bold leading-tight mb-3 tracking-tight">
                    {message.title}
                </h1>

                {/* Body Text */}
                <p className="text-foreground/70 text-[15px] font-normal leading-relaxed mb-8 px-2 tracking-wide">
                    {message.body}
                </p>

                {/* Primary Button (Continue Session) */}
                <div className="w-full mb-4">
                    <button
                        onClick={onContinue}
                        className="relative w-full flex items-center justify-center overflow-hidden rounded-xl h-[56px] bg-primary text-white text-[17px] font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/25"
                    >
                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shine_1.5s_infinite]"></div>
                        <span>Continue Session</span>
                    </button>
                </div>

                {/* Secondary Button (Leave anyway) */}
                <button
                    onClick={onLeave}
                    className="flex items-center justify-center rounded-lg h-auto py-2 px-4 bg-transparent text-foreground/50 hover:text-foreground/70 text-sm font-medium leading-normal tracking-wide transition-colors"
                >
                    <span>Leave anyway</span>
                </button>
            </div>
        </div>
    );
}
