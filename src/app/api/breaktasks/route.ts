import { NextRequest, NextResponse } from "next/server";
import { breakIntoTasks } from "@/lib/openrouter";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db/server";

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user's API key
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { openRouterKey: true },
        });

        if (!user || !user.openRouterKey) {
            return NextResponse.json(
                { error: "OpenRouter API key not found." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { dump } = body;

        if (!dump || typeof dump !== "string" || dump.trim().length === 0) {
            return NextResponse.json(
                { error: "Brain dump text is required" },
                { status: 400 }
            );
        }

        // Call AI to break tasks
        const tasks = await breakIntoTasks(dump, user.openRouterKey);

        // Add IDs and status
        const tasksWithIds = tasks.map((t) => ({
            id: crypto.randomUUID(),
            action: t.action,
            durationMinutes: t.durationMinutes,
            status: "pending" as const,
        }));

        return NextResponse.json({
            success: true,
            tasks: tasksWithIds,
        });
    } catch (error) {
        console.error("Error breaking tasks:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to break tasks" },
            { status: 500 }
        );
    }
}
