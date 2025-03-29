import React from 'react';
import { useBookStore } from '@/lib/store';
import { unparse } from 'papaparse';
import { Book } from '@/types';

export default function ExportButton() {
  const { books } = useBookStore();

  const handleExport = () => {
    if (books.length === 0) {
      alert('No books to export');
      return;
    }

    // Format data for CSV
    const csvData = books.map((book: Book, index: number) => ({
      Index: index + 1,
      ISBN: book.isbn,
      Title: book.title,
      Authors: book.authors.join('; '),
      Publisher: book.publisher,
      Likes: book.likes,
      ReviewCount: book.reviews.length,
      Reviews: book.reviews.map(review => 
        `${review.author} (${review.rating}★): ${review.text}`
      ).join(' | ')
    }));

    // Use PapaParse to correctly handle CSV generation
    const csv = unparse(csvData, {
      quotes: true, // Use quotes around all fields
      header: true  // Include header row
    });

    // Create blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `book-data-export-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 cursor-pointer text-white font-medium py-2 px-4 rounded flex items-center"
      disabled={books.length === 0}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
        />
      </svg>
      Export to CSV
    </button>
  );
}
