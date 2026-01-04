import { NextRequest, NextResponse } from "next/server";
import { shrinkTask } from "@/lib/openrouter";
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
        const { task } = body;

        if (!task || typeof task !== "string" || task.trim().length === 0) {
            return NextResponse.json(
                { error: "Task text is required" },
                { status: 400 }
            );
        }

        const shrunkTask = await shrinkTask(task, user.openRouterKey);

        return NextResponse.json({
            success: true,
            task: {
                id: crypto.randomUUID(),
                action: shrunkTask.action,
                durationMinutes: shrunkTask.durationMinutes,
                status: "pending" as const,
                createdAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Error shrinking task:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to shrink task" },
            { status: 500 }
        );
    }
}
