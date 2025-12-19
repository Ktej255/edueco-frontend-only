import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[var(--neutral-light-grey)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--primary-indigo)] text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold font-display tracking-wide">UPSC Admin</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/admin/upsc" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/upsc/batches" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                        Batches
                    </Link>
                    <Link href="/admin/upsc/plans" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                        Plans
                    </Link>
                    <Link href="/admin/upsc/timers" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                        Timer Settings
                    </Link>
                    <Link href="/admin/upsc/students" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                        Students
                    </Link>
                    <Link href="/admin/upsc/content" className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                        Content Bank
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-blue)] flex items-center justify-center font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-gray-400">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Top Header */}
                <header className="bg-white border-b border-[var(--neutral-cool-grey)] h-16 flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold text-[var(--neutral-dark-grey)]">
                        Overview
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <span className="sr-only">Notifications</span>
                            🔔
                        </button>
                        <button className="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                            + New Action
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
