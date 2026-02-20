"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	const testCases = [
		{ label: "Valid (example)", email: "alice@example.com", password: "S3cretPass!" },
		{ label: "Invalid email (no at)", email: "aliceexample.com", password: "S3cretPass!" },
		{ label: "Short password", email: "bob@example.com", password: "123" },
		{ label: "Missing domain", email: "carol@", password: "Password1" },
		{ label: "SQL injection-like", email: "eve@example.com", password: "' OR 1=1 --" },
	];

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const errs = validateInputs(email, password);
		setValidationErrors(errs);
		if (errs.length > 0) return;

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Login failed");

			// Save token to localStorage
			localStorage.setItem("token", data.token);

			// Navigate to dashboard
			router.push("/dashboard");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : String(err));
		}
	}

	function applyTestCase(tc: { email: string; password: string }) {
		setEmail(tc.email);
		setPassword(tc.password);
		setValidationErrors(validateInputs(tc.email, tc.password));
	}

	function validateInputs(emailVal: string, passwordVal: string): string[] {
		const errs: string[] = [];
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailVal)) errs.push("Invalid email format.");
		if (passwordVal.length < 8) errs.push("Password must be at least 8 characters.");
		return errs;
	}

	return (
		<div className="max-w-md mx-auto mt-20">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm">Email</label>
					<input className="w-full border px-2 py-1" value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm">Password</label>
					<input type="password" className="w-full border px-2 py-1" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				{validationErrors.length > 0 && (
					<div className="text-red-600">
						{validationErrors.map((v, i) => (
							<div key={i}>{v}</div>
						))}
					</div>
				)}
				{error && <div className="text-red-600">{error}</div>}
				<div className="mt-2">
					<div className="text-sm font-semibold">Test cases:</div>
					<div className="flex gap-2 mt-1 flex-wrap">
						{testCases.map((tc) => (
							<button key={tc.label} type="button" onClick={() => applyTestCase(tc)} className="px-2 py-1 border rounded text-sm">
								{tc.label}
							</button>
						))}
					</div>
				</div>
				<div>
					<button className="px-4 py-2 bg-blue-600 text-white">Login</button>
				</div>
			</form>
		</div>
	);
}
