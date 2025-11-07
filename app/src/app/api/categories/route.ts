import { NextRequest, NextResponse } from 'next/server';
import { categoryRepository } from '@/lib/repositories/category-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (eventId) {
      const categories = await categoryRepository.getCategoriesByEventId(eventId);
      return NextResponse.json(categories);
    }

    const categories = await categoryRepository.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name } = body;

    if (!eventId || !name) {
      return NextResponse.json(
        { error: 'Event ID and name are required' },
        { status: 400 }
      );
    }

    const category = await categoryRepository.createCategory({
      eventId,
      name,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
