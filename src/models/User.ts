import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export interface UserRecord {
	_id?: unknown;
	email: string;
	passwordHash: string;
	createdAt: string;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
	const db = await getDatabase();
	const col = db.collection("users");
	const doc = await col.findOne({ email: email.toLowerCase() });
	return doc as UserRecord | null;
}

export async function createUser(email: string, password: string): Promise<UserRecord> {
	const db = await getDatabase();
	const col = db.collection("users");

	const passwordHash = await new Promise<string>((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) return reject(err);
			resolve(hash);
		});
	});

	const user: UserRecord = {
		email: email.toLowerCase(),
		passwordHash,
		createdAt: new Date().toISOString(),
	};

	const result = await col.insertOne(user as any);
	user._id = result.insertedId;
	return user;
}

export async function verifyPassword(storedHash: string, password: string): Promise<boolean> {
	return await new Promise<boolean>((resolve) => {
		bcrypt.compare(password, storedHash, (err, res) => {
			resolve(!err && res);
		});
	});
}

export async function findUserById(id: unknown): Promise<UserRecord | null> {
	const db = await getDatabase();
	const col = db.collection("users");
	const doc = await col.findOne({ _id: id } as any);
	return doc as UserRecord | null;
}

export default { findUserByEmail, createUser, verifyPassword, findUserById };
