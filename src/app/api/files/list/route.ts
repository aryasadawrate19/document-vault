/**
 * GET /api/files/list
 *
 * Lists all encrypted files stored in GridFS.
 * Returns metadata only — no decrypted content.
 *
 * Runtime: Node.js (required for GridFS)
 */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

interface FileListItem {
    fileId: string;
    fileName: string;
    uploadedAt: string;
    length: number;
}

interface SuccessResponse {
    success: true;
    files: FileListItem[];
}

interface ErrorResponse {
    success: false;
    error: string;
}

export async function GET(): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
    try {
        const db = await getDatabase();
        const filesCollection = db.collection("encryptedFiles.files");

        const cursor = filesCollection.find({}).sort({ uploadDate: -1 });
        const documents = await cursor.toArray();

        const files: FileListItem[] = documents.map((doc) => ({
            fileId: doc._id.toHexString(),
            fileName:
                (doc.metadata as { originalFileName?: string })?.originalFileName ??
                doc.filename ??
                "unknown",
            uploadedAt:
                (doc.metadata as { uploadedAt?: string })?.uploadedAt ??
                (doc.uploadDate as Date)?.toISOString() ??
                "",
            length: (doc.length as number) ?? 0,
        }));

        return NextResponse.json(
            { success: true as const, files },
            { status: 200 },
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        console.error("[List Route] Error:", message);
        return NextResponse.json(
            { success: false as const, error: message },
            { status: 500 },
        );
    }
}
