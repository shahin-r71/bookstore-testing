import { createRNG,getRandomIntFromFraction } from './utils';
import { BookParams, Book, ReviewItem } from '@/types';
import { Faker, en_US, de, fr, es, it, ja, en } from '@faker-js/faker';

export const regions = ['English(US)', 'French', 'German', 'Spanish', 'Italian', 'Japanese'];

// Map region codes to Faker locales
export const regionToLocale = {
  'English(US)': en_US,
  'French': fr,
  'German': de,
  'Spanish': es,
  'Italian': it,
  'Japanese': ja
};

export class BookGenerator {
  /**
   * Generates a single book based on the provided parameters
   */
  static generateBook(params: BookParams, index: number): Book {
    try {
      const { region, seed, likes, reviews, page } = params;
      
      // Create deterministic seeds for different book properties
      const baseSeed = `${seed}_${page}_${index}`;
      const bookRng = createRNG(baseSeed);
      const likesRng = createRNG(`${baseSeed}_likes`);
      const reviewsRng = createRNG(`${baseSeed}_reviews`);
      
      // Set up locale-specific faker instance
      const locale = regionToLocale[region as keyof typeof regionToLocale] || en_US;
      
      //use fallback locale to so that alternate text is generated in different languages
      //if the specified locale is not found, use English as fallback
      const fakerInstance = new Faker({ 
        locale: [locale,en]  
      });
      
      // Convert seed to number for faker
      const numericSeed = this.hashStringToNumber(baseSeed);
      fakerInstance.seed(numericSeed);
      
      // Generate a random book title 
      const title = fakerInstance.commerce.productName();
      
      // Generate ISBN using commerce module
      const isbn = fakerInstance.commerce.isbn(13);
      
      // Generate authors
      const authors = this.generateAuthors(bookRng, fakerInstance);
      
      // Generate publisher
      const publisher = fakerInstance.company.name();
      
      // Generate likes based on the parameter
      const bookLikes = getRandomIntFromFraction(likesRng, likes);
      
      // Generate reviews based on the average specified
      const bookReviews = this.generateReviews(reviewsRng, reviews, fakerInstance);
      
      // Generate cover URL
      const coverUrl = this.generateCoverUrl(bookRng, title, authors[0]);
      
      return {
        id: `book-${page}-${index}`,
        isbn,
        title,
        authors,
        publisher,
        coverUrl,
        likes: bookLikes,
        reviews: bookReviews,
      };
    } catch (error) {
      console.error('Error in generateBook:', error);
      // Return a fallback book with minimal data to prevent breaking the UI
      return {
        id: `book-error-${index}`,
        isbn: '000-0000-0000-0',
        title: 'Error generating book',
        authors: ['System'],
        publisher: 'Error Publishing',
        coverUrl: 'https://placehold.co/400x600/ff0000/ffffff?text=Error',
        likes: 0,
        reviews: [],
      };
    }
  }
  
  /**
   * Generates a batch of books
   */
  static generateBooks(params: BookParams): Book[] {
    try {
      const { page, limit } = params;
      const books: Book[] = [];
      
      for (let i = 0; i < limit; i++) {
        const index = (page - 1) * limit + i + 1;
        books.push(this.generateBook(params, index));
      }
      
      return books;
    } catch (error) {
      console.error('Error in generateBooks:', error);
      return [];
    }
  }
    
  /**
   * Generates 1-2 authors for a book
   */
  private static generateAuthors(rng: () => number, fakerInstance: Faker): string[] {
    try {
      const authors: string[] = [];
      const numAuthors = Math.floor(rng() * 2) + 1; // 1-2 authors
      
      for (let i = 0; i < numAuthors; i++) {
        authors.push(fakerInstance.person.fullName());
      }
      return authors;
    } catch (error) {
      console.error('Error generating authors:', error);
      return ['Unknown Author'];
    }
  }

  /**
   * Generates reviews based on the average number specified
   */
  private static generateReviews(rng: () => number, avgReviews: number, fakerInstance: Faker): ReviewItem[] {
    try {
      const reviews: ReviewItem[] = [];
      const numReviews = getRandomIntFromFraction(rng, avgReviews);
      
      for (let i = 0; i < numReviews; i++) {
        const rating = Math.floor(rng() * 5) + 1; // 1-5 stars
        
        // Generate a random date within the last year
        const date = fakerInstance.date.recent({ days: 365 });
        const formattedDate = date.toLocaleDateString();
        
        reviews.push({
          id: `review-${i}-${rng().toString(36).substring(2, 8)}`,
          author: fakerInstance.person.fullName(),
          rating,
          text: fakerInstance.lorem.sentences(2),
          date: formattedDate
        });
      }
      
      return reviews;
    } catch (error) {
      console.error('Error generating reviews:', error);
      return [];
    }
  }
  
  /**
   * Generates a cover URL for a book
   */
  private static generateCoverUrl(rng: () => number, title: string, author: string): string {
    try {
      // Generate a random color
      const hue = Math.floor(rng() * 360);
      const saturation = Math.floor(rng() * 50) + 50;
      
      // Safely encode the text for URL
      const safeText = encodeURIComponent(`${title} by ${author}`);
      
      // Use placeholder for demo purposes
      return `https://placehold.co/400x600/${hue.toString(16).padStart(2, '0')}${saturation.toString(16).padStart(2, '0')}00/FFFFFF?text=${safeText}`;
    } catch (error) {
      console.error('Error generating cover URL:', error);
      return 'https://placehold.co/400x600/888888/FFFFFF?text=Book+Cover';
    }
  }
  private static hashStringToNumber(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // use unsigned right shift for non-negative integer
    }
    return hash;
  }
}
