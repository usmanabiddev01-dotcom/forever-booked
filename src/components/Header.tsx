'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 fixed top-0 left-0 right-0 z-10">
      <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Meta Ad Manager</h1>
      </Link>
    </header>
  );
}
