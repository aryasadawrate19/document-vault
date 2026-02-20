import { NextResponse, NextRequest } from "next/server";
import { findUserByEmail, verifyPassword } from "@/models/User";
import { generateToken } from "@/lib/auth";

interface LoginBody {
	email: string;
	password: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: unknown = await request.json();

		if (
			typeof body !== "object" ||
			body === null ||
			typeof (body as LoginBody).email !== "string" ||
			typeof (body as LoginBody).password !== "string"
		) {
			return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
		}

		const { email, password } = body as LoginBody;

		const user = await findUserByEmail(email);
		if (!user) {
			return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
		}

		const ok = await verifyPassword(user.passwordHash, password);
		if (!ok) {
			return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
		}

		const token = generateToken(String(user._id));

		return NextResponse.json({ success: true, token }, { status: 200 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Internal server error";
		console.error("[Login Route] Error:", message);
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

export const runtime = "nodejs";
