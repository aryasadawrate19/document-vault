import { NextResponse, NextRequest } from "next/server";
import { findUserByEmail, createUser } from "@/models/User";

interface RegisterBody {
	email: string;
	password: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: unknown = await request.json();

		if (
			typeof body !== "object" ||
			body === null ||
			typeof (body as RegisterBody).email !== "string" ||
			typeof (body as RegisterBody).password !== "string"
		) {
			return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
		}

		const { email, password } = body as RegisterBody;

		if (!email || !password) {
			return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
		}

		const existing = await findUserByEmail(email);
		if (existing) {
			return NextResponse.json({ success: false, error: "User already exists." }, { status: 400 });
		}

		const user = await createUser(email, password);

		return NextResponse.json({ success: true, userId: user._id }, { status: 201 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Internal server error";
		console.error("[Register Route] Error:", message);
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

export const runtime = "nodejs";
