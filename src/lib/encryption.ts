/**
 * Client-Side Encryption Module
 *
 * AES-256-GCM authenticated encryption with PBKDF2 key derivation.
 * Uses the Web Crypto API exclusively — no third-party dependencies.
 *
 * Security properties:
 *  - 256-bit AES-GCM (authenticated encryption with associated data)
 *  - PBKDF2-SHA256 with 150,000 iterations for key stretching
 *  - Random 16-byte salt per encryption
 *  - Random 12-byte IV  per encryption
 *  - Decryption fails with OperationError when password is incorrect (GCM tag)
 *
 * IMPORTANT:
 *  - This module runs ONLY in the browser.
 *  - The password must NEVER leave the browser.
 *  - The server must NEVER see plaintext.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const PBKDF2_ITERATIONS = 150_000;
const SALT_LENGTH_BYTES = 16;
const IV_LENGTH_BYTES = 12;
const AES_KEY_LENGTH_BITS = 256;

// ─── Structured Output Type ──────────────────────────────────────────────────

export interface EncryptedPayload {
    /** Base-64 encoded cipher text (includes GCM auth tag) */
    cipherText: string;
    /** Base-64 encoded 16-byte salt used for PBKDF2 */
    salt: string;
    /** Base-64 encoded 12-byte IV used for AES-GCM */
    iv: string;
}

// ─── Base-64 Helpers (binary-safe, browser-only) ─────────────────────────────

/**
 * Encode an ArrayBuffer or Uint8Array to a standard base-64 string.
 * Works entirely in the browser — no Node.js `Buffer` dependency.
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes =
        buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Decode a standard base-64 string back to a Uint8Array.
 */
function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

// ─── Key Derivation ──────────────────────────────────────────────────────────

/**
 * Derive a 256-bit AES-GCM key from a user-supplied password and random salt
 * using PBKDF2-SHA256 with 150,000 iterations.
 *
 * @param password  Plain-text password (never stored or transmitted).
 * @param salt      16-byte random salt (unique per encryption).
 * @returns         A non-exportable CryptoKey usable with AES-GCM encrypt/decrypt.
 */
export async function deriveKey(
    password: string,
    salt: Uint8Array,
): Promise<CryptoKey> {
    const encoder = new TextEncoder();

    // Import the raw password bytes as PBKDF2 key material
    const keyMaterial: CryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false, // not extractable
        ["deriveKey"],
    );

    // Derive a 256-bit AES-GCM key
    const derivedKey: CryptoKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt.buffer as ArrayBuffer,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: AES_KEY_LENGTH_BITS,
        },
        false, // non-exportable — security best practice
        ["encrypt", "decrypt"],
    );

    return derivedKey;
}

// ─── Encryption ──────────────────────────────────────────────────────────────

/**
 * Encrypt an arbitrary binary buffer with AES-256-GCM.
 *
 * A fresh random salt and IV are generated for every call, ensuring that
 * encrypting the same plaintext twice never produces the same ciphertext.
 *
 * @param fileBuffer  Raw file bytes (e.g. from `FileReader.readAsArrayBuffer`).
 * @param password    User-supplied password.
 * @returns           `EncryptedPayload` with base-64 encoded fields.
 */
export async function encryptFile(
    fileBuffer: ArrayBuffer,
    password: string,
): Promise<EncryptedPayload> {
    // Generate cryptographically secure random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));

    // Derive the AES key from password + salt
    const key: CryptoKey = await deriveKey(password, salt);

    // Encrypt — output includes the 16-byte GCM authentication tag
    const cipherBuffer: ArrayBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
        key,
        fileBuffer,
    );

    return {
        cipherText: arrayBufferToBase64(cipherBuffer),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
    };
}

// ─── Decryption ──────────────────────────────────────────────────────────────

/**
 * Decrypt an AES-256-GCM encrypted payload back to an ArrayBuffer.
 *
 * If the password is incorrect the GCM authentication tag verification will
 * fail and `crypto.subtle.decrypt` will throw an `OperationError`.
 *
 * Handles any binary file type (PDF, images, DOCX, etc.).
 *
 * @param cipherText  Base-64 encoded ciphertext (from `encryptFile`).
 * @param password    The same password used during encryption.
 * @param salt        Base-64 encoded salt (from `encryptFile`).
 * @param iv          Base-64 encoded IV (from `encryptFile`).
 * @returns           The original plaintext as an `ArrayBuffer`.
 * @throws            Error if the password is incorrect or data is tampered.
 */
export async function decryptFile(
    cipherText: string,
    password: string,
    salt: string,
    iv: string,
): Promise<ArrayBuffer> {
    const saltBytes = base64ToUint8Array(salt);
    const ivBytes = base64ToUint8Array(iv);
    const cipherBytes = base64ToUint8Array(cipherText);

    // Re-derive the key from password + salt
    const key: CryptoKey = await deriveKey(password, saltBytes);

    // Decrypt — throws OperationError if authentication fails
    try {
        const plainBuffer: ArrayBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivBytes.buffer as ArrayBuffer },
            key,
            cipherBytes.buffer as ArrayBuffer,
        );
        return plainBuffer;
    } catch (error: unknown) {
        // Re-throw with a more descriptive message
        if (error instanceof DOMException && error.name === "OperationError") {
            throw new Error(
                "Decryption failed: incorrect password or corrupted data.",
            );
        }
        throw error;
    }
}
