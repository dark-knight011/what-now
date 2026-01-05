// OpenRouter API Client
// Docs: https://openrouter.ai/docs

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OpenRouterResponse {
    id: string;
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface TaskFromAI {
    action: string;
    durationMinutes: number;
}

export async function callOpenRouter(
    messages: OpenRouterMessage[],
    model: string = "google/gemini-2.0-flash-exp:free",
    options: {
        temperature?: number;
        maxTokens?: number;
        apiKey?: string; // Allow passing key directly
    } = {}
): Promise<string> {
    const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error("OpenRouter API key is missing. Please add it in Settings.");
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "What Now - ADHD Decision Killer",
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 1024,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || "";
}

/**
 * Break a brain dump into small, actionable tasks
 */
export async function breakIntoTasks(brainDump: string, apiKey?: string): Promise<TaskFromAI[]> {
    const systemPrompt = `You are an ADHD-friendly task breaker. Your job is to take a chaotic brain dump and turn it into small, clear, immediately actionable tasks.

Rules:
1. Each task must be completable in 5-15 minutes
2. Tasks must be specific and concrete (not vague)
3. Start each task with an action verb (Draft, Send, Open, Write, Call, etc.)
4. If a task is too big, break it into smaller steps
5. Limit to 5-7 tasks maximum
6. Order tasks by what should be done first

Return ONLY a valid JSON array with this format:
[
  {"action": "Draft the introduction paragraph for the report", "durationMinutes": 10},
  {"action": "Send a quick Slack message to Sarah about the meeting", "durationMinutes": 5}
]

No explanation, no markdown, just the JSON array.`;

    const userPrompt = `Here's what's on my mind:\n\n${brainDump}`;

    const response = await callOpenRouter(
        [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        undefined, // Use default model
        apiKey ? { temperature: 0.5, apiKey } : { temperature: 0.5 }
    );

    try {
        // Clean response - sometimes models wrap in markdown
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith("```json")) {
            cleanResponse = cleanResponse.slice(7);
        }
        if (cleanResponse.startsWith("```")) {
            cleanResponse = cleanResponse.slice(3);
        }
        if (cleanResponse.endsWith("```")) {
            cleanResponse = cleanResponse.slice(0, -3);
        }
        cleanResponse = cleanResponse.trim();

        const tasks: TaskFromAI[] = JSON.parse(cleanResponse);
        return tasks;
    } catch (error) {
        console.error("Failed to parse AI response:", response);
        throw new Error("Failed to parse tasks from AI response");
    }
}

/**
 * Shrink a task into something smaller when the user is stuck
 */
export async function shrinkTask(task: string, apiKey?: string): Promise<TaskFromAI> {
    const systemPrompt = `You are an ADHD-friendly task shrinker. The user is stuck on a task and needs something smaller to start.

Rules:
1. Make the task take 2-5 minutes MAX
2. Focus on just the FIRST tiny step
3. Make it so easy it feels almost stupid
4. Keep it specific and actionable

Return ONLY a valid JSON object:
{"action": "Just open the document and write ONE sentence", "durationMinutes": 3}

No explanation, no markdown, just the JSON object.`;

    const userPrompt = `I'm stuck on this task: "${task}"\n\nGive me something smaller to start with.`;

    const response = await callOpenRouter(
        [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        undefined, // Use default model
        apiKey ? { temperature: 0.5, apiKey } : { temperature: 0.5 }
    );

    try {
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith("```json")) {
            cleanResponse = cleanResponse.slice(7);
        }
        if (cleanResponse.startsWith("```")) {
            cleanResponse = cleanResponse.slice(3);
        }
        if (cleanResponse.endsWith("```")) {
            cleanResponse = cleanResponse.slice(0, -3);
        }
        cleanResponse = cleanResponse.trim();

        const shrunkTask: TaskFromAI = JSON.parse(cleanResponse);
        return shrunkTask;
    } catch (error) {
        console.error("Failed to parse AI response:", response);
        throw new Error("Failed to parse shrunk task from AI response");
    }
}
