import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "CHANGE_ME_REPLACE_IN_PROD";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? "1h";

export function generateToken(userId: string): string {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } {
	const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
	return payload;
}

export async function requireAuth(request: NextRequest): Promise<string> {
	const auth = request.headers.get("authorization") || request.headers.get("Authorization");
	if (!auth) {
		throw new Error("Unauthorized: missing Authorization header");
	}

	const parts = auth.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		throw new Error("Unauthorized: invalid Authorization format");
	}

	try {
		const payload = verifyToken(parts[1]);
		return payload.userId;
	} catch (err) {
		throw new Error("Unauthorized: invalid or expired token");
	}
}

export default { generateToken, verifyToken, requireAuth };
