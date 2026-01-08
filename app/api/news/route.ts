import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/aggregator';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    const articles = await fetchAllNews();

    let filtered = articles;

    // Filter by source
    if (source && source !== 'all') {
      filtered = filtered.filter((article) => article.source === source);
    }

    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter((article) => article.category === category);
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error in news API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
