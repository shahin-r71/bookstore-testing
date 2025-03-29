# Bookstore Testing

A dynamic book catalog application built with Next.js that demonstrates data generation and display techniques.


## Features

- **Dynamic Book Generation**: Uses Faker.js to create realistic book data with titles, authors, and publishers
- **Multiple View Options**: Toggle between Gallery and Table views
- **Internationalization**: Support for multiple languages/regions (English, French, German, Spanish, Italian, Japanese)
- **Infinite Scrolling**: Load more books as you scroll
- **Detailed Book Information**: View book details including reviews and ratings
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: Zustand for global state
- **Data Generation**: Faker.js for dynamic content
- **TypeScript**: Type-safe code throughout the application

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

use `--legacy-peer-deps` flag if installation issue occur.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: UI components including BookTable and GalleryView
- `/lib`: Utility functions and the BookGenerator class
- `/types`: TypeScript type definitions

## API

The application includes a REST API for generating book data:

```
GET /api/books?region=English(US)&seed=123&likes=5&reviews=3&page=1&limit=20
```

Parameters:

- `region`: Language/region for book data (default: "English(US)")
- `seed`: Seed for deterministic generation (default: "42")
- `likes`: Average number of likes per book (default: 0)
- `reviews`: Average number of reviews per book (default: 0)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of books per page (default: 20)
