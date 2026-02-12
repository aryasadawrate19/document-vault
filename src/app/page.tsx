"use client";
import { useEffect } from "react";
import { encryptFile, decryptFile } from "@/lib/encryption";

export default function Home() {
  useEffect(() => {
    async function testEncryption() {
      // Create a small test payload
      const original = new TextEncoder().encode("Hello, Document Vault! 🔐");
      console.log("Original:", new TextDecoder().decode(original));

      // Encrypt
      const password = "test-password-123";
      const { cipherText, salt, iv } = await encryptFile(original.buffer, password);
      console.log("Encrypted:", { cipherText, salt, iv });

      // Decrypt
      const decryptedBuffer = await decryptFile(cipherText, password, salt, iv);
      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      console.log("Decrypted:", decryptedText);

      // Verify
      console.log("✅ Round-trip match:", decryptedText === "Hello, Document Vault! 🔐");

      // Test wrong password (should throw)
      try {
        await decryptFile(cipherText, "wrong-password", salt, iv);
        console.error("❌ Should have thrown on wrong password!");
      } catch {
        console.log("✅ Wrong password correctly rejected (GCM integrity check)");
      }
    }

    testEncryption();
  }, []);

  return <div>Check browser console for encryption test results</div>;
}