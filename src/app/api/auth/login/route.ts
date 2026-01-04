import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Use Better Auth to sign in
        const signInResponse = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        if (!signInResponse || !signInResponse.user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Return session info
        // Return session info and set cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: signInResponse.user.id,
                email: signInResponse.user.email,
                name: signInResponse.user.name,
            },
        });

        // Manually set the session cookie
        if (signInResponse.token) {
            response.cookies.set("whatnow.session_token", signInResponse.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        );
    }
}
