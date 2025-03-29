'use client';

import React from 'react';
import ControlPanel from '@/components/ControlPanel';
import BookTable from '@/components/BookTable';
import GalleryView from '@/components/GalleryView';
import ExportButton from '@/components/ExportButton';
import { useBookStore } from '@/lib/store';

export default function Home() {
  const { viewMode } = useBookStore();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bookstore Testing Environment
        </h1>
        <p className="text-gray-600">
          Generate realistic book data with customizable parameters for testing purposes.
        </p>
      </div>
      
      <ControlPanel />
      
      <div className="mb-4 flex justify-end">
        <ExportButton />
      </div>
      
      {viewMode === 'table' ? <BookTable /> : <GalleryView />}
      
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Bookstore Testing Environment &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
