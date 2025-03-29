import { NextRequest, NextResponse } from 'next/server';
import { BookGenerator } from '@/lib/bookGenerator';
import { BookParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get parameters from URL
    const params = new URL(request.url).searchParams;
    
    const region = params.get('region') || 'English(US)';
    const seed = params.get('seed') || "42";
    const likes = parseFloat(params.get('likes') || '0');
    const reviews = parseFloat(params.get('reviews') || '0');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '20', 10);

    console.log('Received API request with params:', { region, seed, likes, reviews, page, limit });

    // Generate book data using our BookGenerator
    const bookParams: BookParams = {
      region,
      seed,
      likes,
      reviews,
      page,
      limit
    };

    const books = await BookGenerator.generateBooks(bookParams);
    
    return NextResponse.json({ 
      success: true, 
      data: books,
      params: bookParams 
    });
  } catch (error) {
    console.error('Error generating books:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate books' },
      { status: 500 }
    );
  }
}
