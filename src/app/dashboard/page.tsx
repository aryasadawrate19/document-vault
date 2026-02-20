"use client";

import { useEffect, useState } from "react";

interface FileItem {
	fileId: string;
	fileName: string;
	uploadedAt: string;
	length: number;
}

export default function DashboardPage() {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			setError(null);
			try {
				const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
				const res = await fetch("/api/files/list", {
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to load files");
				setFiles(data.files ?? []);
			} catch (err: unknown) {
				setError(err instanceof Error ? err.message : String(err));
			}
		}
		load();
	}, []);

	return (
		<div className="max-w-3xl mx-auto mt-10">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			{error && <div className="text-red-600 mb-4">{error}</div>}
			<table className="w-full border">
				<thead>
					<tr>
						<th className="border px-2 py-1">File</th>
						<th className="border px-2 py-1">Uploaded At</th>
						<th className="border px-2 py-1">Size</th>
					</tr>
				</thead>
				<tbody>
					{files.map((f) => (
						<tr key={f.fileId}>
							<td className="border px-2 py-1">{f.fileName}</td>
							<td className="border px-2 py-1">{f.uploadedAt}</td>
							<td className="border px-2 py-1">{f.length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
