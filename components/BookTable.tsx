import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useBookStore } from '@/lib/store';
import BookRow from './BookRow';

export default function BookTable() {
  const {
    region,
    seed,
    likes,
    reviews,
    books,
    loading,
    error,
    setBooks,
    appendBooks,
    setLoading,
    setError,
    expandedBookId,
    setExpandedBookId,
  } = useBookStore();

  const [page, setPage] = useState(1);
  const { ref: bottomRef, inView } = useInView();

  // Load initial books when parameters change
  useEffect(() => {
    const loadInitialBooks = async () => {
      setLoading(true);
      setError(null);
      setPage(1); // Reset page
      
      try {
        const response = await fetch(
          `/api/books?region=${region}&seed=${seed}&likes=${likes}&reviews=${reviews}&page=1&limit=20`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        setBooks(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialBooks();
  }, [region, seed, likes, reviews]);

  // Load more books when scrolling to bottom
  useEffect(() => {
    const loadMoreBooks = async () => {
      if (inView && !loading && page > 1) {
        setLoading(true);
        
        try {
          const response = await fetch(
            `/api/books?region=${region}&seed=${seed}&likes=${likes}&reviews=${reviews}&page=${page}&limit=10`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch more books');
          }
          
          const data = await response.json();
          appendBooks(data.data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          console.error('Error loading more books:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadMoreBooks();
  }, [inView, page]);

  // Update page when scrolling to bottom
  useEffect(() => {
    if (inView && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, loading]);

  // Handle row click
  const handleRowClick = (bookId: string, index: number) => {
    const uniqueId = `${bookId}-${index}`;
    if (expandedBookId === uniqueId) {
      setExpandedBookId('');
    } else {
      setExpandedBookId(uniqueId);
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
        <p>There was an error loading the books.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                Index
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Author(s)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Publisher
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book, index) => (
              <BookRow
                key={`${book.id}-${index}`}
                book={book}
                index={index + 1}
                isExpanded={expandedBookId === `${book.id}-${index}`}
                onClick={() => handleRowClick(book.id, index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading indicator and infinite scroll trigger */}
      <div ref={bottomRef} className="py-4 flex justify-center">
        {loading && (
          <div className="loading flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
