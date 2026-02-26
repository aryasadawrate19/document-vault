"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

            {/* ───────── Navigation Bar ───────── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/70 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            DocVault
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="relative text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-250 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-250">Features</a>
                        <a href="#security" className="relative text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-250 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all after:duration-250">Security</a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-250"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-250"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                        <span className={`block w-5 h-0.5 bg-gray-700 rounded-full mt-1 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}></span>
                        <span className={`block w-5 h-0.5 bg-gray-700 rounded-full mt-1 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
                    </button>
                </div>

                {/* Mobile Menu Panel */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="container mx-auto px-6 py-4 flex flex-col gap-3 border-t border-gray-100 bg-white/90 backdrop-blur-xl">
                        <a href="#features" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#security" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Security</a>
                        <hr className="border-gray-100" />
                        <Link href="/login" className="py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
                        <Link href="/register" className="py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* ───────── Hero Section ───────── */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden bg-white">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
                    {/* Radial highlight behind headline */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(167,139,250,0.15) 0%, rgba(196,181,253,0.06) 50%, transparent 80%)" }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-8 border border-indigo-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        New: Enhanced encryption standards
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-[1.1]">
                        Secure Document Vault <br />
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            style={{ filter: "drop-shadow(0 0 24px rgba(139,92,246,0.18))" }}
                        >
                            Your files. Your control.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl mx-auto leading-loose">
                        End-to-end encrypted file storage designed for privacy-first teams and individuals. Store, manage, and share with complete confidence.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-9 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-250 ease-out"
                        >
                            Start for Free
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-9 py-4 text-lg font-medium text-gray-600 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 hover:shadow-md transition-all duration-250 ease-out"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </section>

            {/* ───────── Wave Divider: Hero → Features ───────── */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
                    <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 48C1200 48 1320 40 1380 36L1440 32V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V80Z" fill="white" />
                </svg>
            </div>

            {/* ───────── Features Section ───────── */}
            <section id="features" className="py-28 bg-gray-50 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Enterprise-grade security for everyone
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            We&apos;ve built our platform from the ground up to ensure your data remains private, secure, and always accessible when you need it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="group flex flex-col h-full p-10 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-in-out">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 shadow-inner ring-1 ring-inset ring-indigo-100/50 flex flex-shrink-0 items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Client-Side Encryption
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Your files are encrypted on your device before they ever touch our servers. Only you hold the keys to your data.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group flex flex-col h-full p-10 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-[0_8px_30px_rgba(147,51,234,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-in-out">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 shadow-inner ring-1 ring-inset ring-purple-100/50 flex flex-shrink-0 items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Secure Storage
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Reliable, redundant cloud storage ensures your documents are safe against data loss and accessible from anywhere.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group flex flex-col h-full p-10 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-[0_8px_30px_rgba(236,72,153,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-in-out">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-50 to-rose-50 shadow-inner ring-1 ring-inset ring-pink-100/50 flex flex-shrink-0 items-center justify-center text-pink-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Private Access
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Granular sharing controls allow you to share documents securely with expiring links and password protection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── Wave Divider: Features → CTA ───────── */}
            <div className="relative -mt-1">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
                    <path d="M0 0L60 12C120 24 240 48 360 56C480 64 600 56 720 48C840 40 960 32 1080 32C1200 32 1320 40 1380 44L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V0Z" fill="#f9fafb" />
                </svg>
            </div>

            {/* ───────── CTA Section ───────── */}
            <section id="security" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #eff6ff 100%)" }}>
                {/* Soft decorative blurred orbs */}
                <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Start Protecting Your Files Today
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of users who trust DocVault with their most sensitive documents. No credit card required.
                    </p>
                    <div className="relative inline-block">
                        {/* Subtle glow behind button */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-2xl blur-xl opacity-20 scale-110 pointer-events-none"></div>
                        <Link
                            href="/register"
                            className="relative inline-block px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl hover:from-indigo-700 hover:to-violet-700 hover:scale-[1.03] active:scale-[0.98] transition-all duration-250 ease-out shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ───────── Footer ───────── */}
            <footer className="bg-gray-50 border-t border-gray-200 py-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Left: Logo + tagline */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900">DocVault</span>
                                <span className="hidden sm:inline text-gray-400 mx-2">·</span>
                                <span className="hidden sm:inline text-sm text-gray-500">Secure document management</span>
                            </div>
                        </div>

                        {/* Right: Social icons */}
                        <div className="flex items-center gap-3">
                            {/* Twitter / X */}
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all duration-200" aria-label="Twitter">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            {/* GitHub */}
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all duration-200" aria-label="GitHub">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all duration-200" aria-label="LinkedIn">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} DocVault. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

