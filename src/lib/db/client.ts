// Dexie Client-Side Database
// Stores sessions and tasks locally (privacy-first, no keys)

import Dexie, { type EntityTable } from 'dexie';

// Types
export interface Session {
    id: string;
    rawDump: string;
    status: 'active' | 'completed' | 'abandoned';
    createdAt: Date;
    escapeStrikes: number; // 0-3
}

export interface Task {
    id: string;
    sessionId: string;
    order: number;
    action: string;
    durationMinutes: number;
    status: 'locked' | 'active' | 'done';
}

// Database
const db = new Dexie('WhatNowDB') as Dexie & {
    sessions: EntityTable<Session, 'id'>;
    tasks: EntityTable<Task, 'id'>;
};

// Schema
db.version(1).stores({
    sessions: 'id, status, createdAt',
    tasks: 'id, sessionId, order, status',
});

export { db };

// Helper functions
export async function getActiveSession(): Promise<Session | undefined> {
    return await db.sessions.where('status').equals('active').first();
}

export async function getSessionTasks(sessionId: string): Promise<Task[]> {
    return await db.tasks
        .where('sessionId')
        .equals(sessionId)
        .sortBy('order');
}

export async function getCurrentTask(sessionId: string): Promise<Task | undefined> {
    const tasks = await getSessionTasks(sessionId);
    return tasks.find(t => t.status === 'active' || t.status === 'locked');
}

export async function completeTask(taskId: string): Promise<void> {
    await db.tasks.update(taskId, { status: 'done' });
}

export async function activateNextTask(sessionId: string): Promise<Task | null> {
    const tasks = await getSessionTasks(sessionId);
    const currentIndex = tasks.findIndex(t => t.status === 'active');

    if (currentIndex === -1) {
        // No active task, activate first locked task
        const firstLocked = tasks.find(t => t.status === 'locked');
        if (firstLocked) {
            await db.tasks.update(firstLocked.id, { status: 'active' });
            return firstLocked;
        }
        return null;
    }

    // Mark current as done
    await db.tasks.update(tasks[currentIndex].id, { status: 'done' });

    // Activate next locked task
    const nextTask = tasks[currentIndex + 1];
    if (nextTask && nextTask.status === 'locked') {
        await db.tasks.update(nextTask.id, { status: 'active' });
        return nextTask;
    }

    return null;
}

export async function incrementEscapeStrikes(sessionId: string): Promise<number> {
    const session = await db.sessions.get(sessionId);
    if (!session) return 0;

    const newStrikes = session.escapeStrikes + 1;
    await db.sessions.update(sessionId, { escapeStrikes: newStrikes });

    if (newStrikes >= 3) {
        await db.sessions.update(sessionId, { status: 'abandoned' });
    }

    return newStrikes;
}

export async function createSession(dump: string, tasks: Omit<Task, 'id' | 'sessionId'>[]): Promise<string> {
    const sessionId = crypto.randomUUID();

    await db.sessions.add({
        id: sessionId,
        rawDump: dump,
        status: 'active',
        createdAt: new Date(),
        escapeStrikes: 0,
    });

    // Add tasks
    for (const task of tasks) {
        await db.tasks.add({
            ...task,
            id: crypto.randomUUID(),
            sessionId,
        });
    }

    return sessionId;
}

export async function completeSession(sessionId: string): Promise<void> {
    await db.sessions.update(sessionId, { status: 'completed' });
}
