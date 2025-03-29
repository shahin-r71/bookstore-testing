import React from 'react';
import { Book } from '@/types';
import { cn } from '@/lib/utils';

interface BookRowProps {
  book: Book;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

export default function BookRow({ book, index, isExpanded, onClick }: BookRowProps) {
  return (
    <>
      <tr 
        className={cn(
          "hover:bg-gray-50 cursor-pointer transition-colors",
          isExpanded ? "bg-gray-50" : ""
        )}
        onClick={onClick}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {index}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
          {book.isbn}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {book.title}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {book.authors.join(', ')}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {book.publisher}
        </td>
      </tr>
      
      {/* Expanded content */}
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book cover */}
              <div className="w-full md:w-1/4 flex-shrink-0">
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={book.coverUrl}
                    alt={`Cover for ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700">
                  {book.likes} ❤️
                </div>
              </div>
              
              {/* Book details */}
              <div className="w-full md:w-3/4">
                <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                <p className="text-gray-700 mb-2">
                  by {book.authors.join(', ')}
                </p>
                <p className="text-gray-600 mb-4">
                  Publisher: {book.publisher} | ISBN: {book.isbn}
                </p>
                
                {/* Reviews section */}
                <div className="mt-4">
                  <p className="text-lg font-semibold mb-3 flex items-center">
                    Reviews ({book.reviews.length})
                  </p>
                  
                  {book.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {book.reviews.map((review) => (
                        <div key={review.id} className="border-l-4 border-gray-200 pl-4 py-2">
                          <div className="flex items-center mb-1">
                            <div className="font-medium">{review.author}</div>
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
          </td>
        </tr>
      )}
    </>
  );
}
