/**
 * MongoDB Connection & GridFS Bucket
 *
 * Provides a cached MongoClient connection and a GridFSBucket instance
 * for storing/retrieving encrypted file binaries.
 *
 * Environment variable:
 *   MONGODB_URI — Full MongoDB connection string (e.g. mongodb://localhost:27017/document-vault)
 *
 * IMPORTANT:
 *  - This module is server-side only (Node.js runtime).
 *  - Never import this from client components.
 */

import { MongoClient, Db, GridFSBucket } from "mongodb";

// ─── Environment Validation ─────────────────────────────────────────────────

const MONGODB_URI: string = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
    throw new Error(
        "Missing MONGODB_URI environment variable. " +
        "Set it in .env.local (e.g. mongodb://localhost:27017/document-vault).",
    );
}

// ─── Module-Level Caching ────────────────────────────────────────────────────
//
// In Next.js dev mode, API routes are re-evaluated on each request but the
// Node.js module cache persists. We attach a cached promise to `globalThis`
// to avoid creating a new connection on every hot-reload.

interface MongoGlobal {
    _mongoClientPromise?: Promise<MongoClient>;
}

const g = globalThis as unknown as MongoGlobal;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development, reuse the cached promise across hot reloads
    if (!g._mongoClientPromise) {
        const client = new MongoClient(MONGODB_URI);
        g._mongoClientPromise = client.connect();
    }
    clientPromise = g._mongoClientPromise;
} else {
    // In production, create a single connection
    const client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
}

// ─── Public Helpers ──────────────────────────────────────────────────────────

/**
 * Get the default database from the connection string.
 *
 * @returns The Db instance for the database specified in MONGODB_URI.
 */
export async function getDatabase(): Promise<Db> {
    const client: MongoClient = await clientPromise;
    return client.db(); // uses the database name from the URI
}

/**
 * Get a GridFS bucket for encrypted file storage.
 *
 * @param bucketName  Optional bucket name prefix (default: "encryptedFiles").
 * @returns           A GridFSBucket configured for the default database.
 */
export async function getGridFSBucket(
    bucketName: string = "encryptedFiles",
): Promise<GridFSBucket> {
    const db: Db = await getDatabase();
    return new GridFSBucket(db, { bucketName });
}

export { clientPromise };
