/**
 * DELETE /api/files/delete
 *
 * Deletes an encrypted file from GridFS by its fileId.
 *
 * Request body:
 *   { fileId: string }
 *
 * Runtime: Node.js (required for GridFS)
 */

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getGridFSBucket } from "@/lib/mongodb";

interface DeleteRequestBody {
    fileId: string;
}

interface SuccessResponse {
    success: true;
    message: string;
}

interface ErrorResponse {
    success: false;
    error: string;
}

export async function DELETE(
    request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
    try {
        const body: unknown = await request.json();

        if (
            typeof body !== "object" ||
            body === null ||
            typeof (body as DeleteRequestBody).fileId !== "string"
        ) {
            return NextResponse.json(
                { success: false as const, error: "Invalid request body. Required field: fileId." },
                { status: 400 },
            );
        }

        const { fileId } = body as DeleteRequestBody;

        if (!/^[a-fA-F0-9]{24}$/.test(fileId)) {
            return NextResponse.json(
                { success: false as const, error: "Invalid fileId format." },
                { status: 400 },
            );
        }

        const bucket = await getGridFSBucket();
        await bucket.delete(new ObjectId(fileId));

        return NextResponse.json(
            { success: true as const, message: "File deleted successfully." },
            { status: 200 },
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        console.error("[Delete Route] Error:", message);
        return NextResponse.json(
            { success: false as const, error: message },
            { status: 500 },
        );
    }
}
