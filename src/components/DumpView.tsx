"use client";

import { useState } from "react";

export default function DumpView({ onSubmit }: { onSubmit: (dump: string) => void }) {
    const [dump, setDump] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!dump.trim()) return;
        setIsLoading(true);
        await onSubmit(dump);
        setIsLoading(false);
    };

    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center overflow-hidden antialiased selection:bg-primary selection:text-white relative p-6">
            {/* Background decorative gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-mesh pointer-events-none w-full h-full opacity-60"></div>

            {/* Main Container - Wider for Dump, Center Aligned items to prevent stretch */}
            <div className="relative z-10 flex flex-col w-full max-w-2xl mx-auto z-10 gap-12 items-center">

                {/* Header */}
                <div className="text-center shrink-0 w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/80 drop-shadow-sm mb-2">
                        Unload the noise
                    </h1>
                </div>

                {/* Textarea - Wide but standard alignment */}
                <div className="flex-1 relative group w-full shrink-0">
                    <textarea
                        value={dump}
                        onChange={(e) => setDump(e.target.value)}
                        className="w-full h-[40vh] min-h-[300px] bg-transparent rounded-xl p-0 text-3xl sm:text-4xl md:text-5xl leading-tight resize-none focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none !outline-none !border-none !ring-0 !shadow-none text-foreground transition-all duration-300 text-center font-heading font-bold"
                        placeholder=""
                        spellCheck="false"
                        autoFocus
                        style={{ outline: "none", boxShadow: "none", caretColor: dump ? "#7c3aed" : "transparent" }}
                    />

                    {/* Custom blinking cursor - always visible when empty */}
                    {!dump && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex items-center">
                                <span className="text-foreground/20 text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
                                    Type here
                                </span>
                                <span className="w-[4px] h-12 sm:h-14 md:h-16 bg-primary rounded-full animate-pulse ml-1"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button - Strictly constrained width */}
                <div className="flex-none shrink-0 w-full max-w-md px-4 sm:px-0">
                    <button
                        onClick={handleSubmit}
                        disabled={!dump.trim() || isLoading}
                        className="group w-full h-14 sm:h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-primary active:scale-[0.98] transition-all duration-200 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-white/10 relative overflow-hidden"
                    >
                        <span className="text-white font-bold text-lg sm:text-xl mr-3 relative z-10">
                            {isLoading ? "Thinking..." : "What now?"}
                        </span>
                        {!isLoading && (
                            <span className="material-icons-round text-white group-hover:translate-x-1 transition-transform duration-200 text-2xl relative z-10">
                                arrow_forward
                            </span>
                        )}

                        {/* Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
