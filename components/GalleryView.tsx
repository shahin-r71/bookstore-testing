import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useBookStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function GalleryView() {
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


  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
        <p>There was an error loading the books.</p>
      </div>
    );
  }

  return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
              <Dialog>
                <DialogTrigger className="cursor-pointer flex flex-col h-full">
                  <div className="relative h-48 bg-gray-200 w-full">
                    <img
                        src={book.coverUrl}
                        alt={`Cover for ${book.title}`}
                        className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-xs text-gray-500 mb-1">#{index + 1}</p>
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 min-h-[3rem]">{book.title}</h3>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-1 min-h-[1.5rem]">
                      {book.authors.join(', ')}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xs text-gray-500">{book.publisher}</span>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        {book.likes} ❤️
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
              
                {/* Expanded details */}
                <DialogContent className="md:max-w-xl lg:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className='text-center'></DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Book cover */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
                            <img
                              src={book.coverUrl}
                              alt={`Cover for ${book.title}`}
                              className="w-full h-full object-cover"
                            />
                            </div>
                            <div className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                              {book.likes} ❤️
                            </div>  
                        </div>  
                        
                        {/* Book details */}
                        <div className="w-full md:w-2/3">
                          <h3 className="text-xl font-bold mb-2 text-gray-800">{book.title}</h3>
                          <p className="text-gray-800 mb-2">
                            by {book.authors.join(', ')}
                          </p>
                          <p className="text-gray-800 mb-4">
                            Publisher: {book.publisher} | ISBN: {book.isbn}
                          </p>
                          
                          {/* Reviews section */}
                          <div className="mt-4">
                            <p className="text-lg font-semibold mb-3 flex items-center text-gray-800">
                              Reviews ({book.reviews.length})
                            </p>
                            
                            {book.reviews.length > 0 ? (
                              <div className="space-y-4">
                                {book.reviews.map((review) => (
                                  <div key={review.id} className="border-l-4 border-gray-200 pl-4 py-2">
                                    <div className="flex items-center mb-1">
                                      <div className="font-medium text-gray-700">{review.author}</div>
                                      <div className="text-gray-500 text-sm ml-2">
                                        {review.date}
                                      </div>
                                      <div className="ml-auto flex">
                                        {Array(review.rating)
                                          .fill(null)
                                          .map((_, i) => (
                                            <span key={i} className="text-yellow-400">★</span>
                                          ))}
                                        {Array(5 - review.rating)
                                          .fill(null)
                                          .map((_, i) => (
                                            <span key={i} className="text-gray-300">★</span>
                                          ))}
                                      </div>
                                    </div>
                                    <p className="text-gray-700">{review.text}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-500 italic">No reviews for this book.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>

        {/* Loading indicator and infinite scroll trigger */}
        <div ref={bottomRef} className="py-4 flex justify-center mt-6">
          {loading && (
            <div className="loading flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    
  );
}
