import { NextRequest, NextResponse } from 'next/server';
import { participantRepository } from '@/lib/repositories/participant-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (categoryId) {
      const participants = participantRepository.getParticipantsByCategoryId(categoryId);
      return NextResponse.json(participants);
    }

    const participants = participantRepository.getAllParticipants();
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, email, fullName, schoolInstitution } = body;

    if (!categoryId || !email || !fullName) {
      return NextResponse.json(
        { error: 'Category ID, email, and full name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const participant = participantRepository.createParticipant({
      categoryId,
      email,
      fullName,
      schoolInstitution,
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'A participant with this email already exists in this category' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    );
  }
}
