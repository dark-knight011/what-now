import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, openRouterKey } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (!openRouterKey) {
            return NextResponse.json(
                { error: "OpenRouter API key is required" },
                { status: 400 }
            );
        }

        // Removed strict prefix check
        if (openRouterKey.length < 5) {
            return NextResponse.json(
                { error: "API key seems too short" },
                { status: 400 }
            );
        }

        // Create user via Better Auth
        // strictly pass headers so it can set cookies
        const signUpResponse = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: name || undefined,
            },
            headers: request.headers,
        });

        if (!signUpResponse || !signUpResponse.user) {
            console.error("Better Auth failed to return user object");
            return NextResponse.json(
                { error: "Failed to create user (Auth Provider Error)" },
                { status: 500 }
            );
        }

        // 2. Update user with custom key
        try {
            await prisma.user.update({
                where: { id: signUpResponse.user.id },
                data: { openRouterKey },
            });
        } catch (dbError) {
            console.error("Prisma update failed:", dbError);
            // Verify if user exists?
            return NextResponse.json(
                { error: "User created but failed to save API key" },
                { status: 500 }
            );
        }

        // Return session info
        // Return session info and set cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: signUpResponse.user.id,
                email: signUpResponse.user.email,
                name: signUpResponse.user.name,
            },
        });

        // Manually set session cookie if token exists
        const sessionToken = signUpResponse.token || (signUpResponse as any).session?.token;

        if (sessionToken) {
            response.cookies.set("whatnow.session_token", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        return response;
    } catch (error) {
        console.error("Signup error:", error);

        // Check for duplicate email
        if (error instanceof Error && error.message.includes("unique")) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to sign up" },
            { status: 500 }
        );
    }
}
