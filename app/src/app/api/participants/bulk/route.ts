import { NextRequest, NextResponse } from 'next/server';
import { participantRepository } from '@/lib/repositories/participant-repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, participants } = body;

    if (!categoryId || !participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: 'Category ID and participants array are required' },
        { status: 400 }
      );
    }

    // Validate email format for all participants
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const participant of participants) {
      if (!participant.email || !emailRegex.test(participant.email)) {
        return NextResponse.json(
          { error: `Invalid email format: ${participant.email}` },
          { status: 400 }
        );
      }
      if (!participant.fullName) {
        return NextResponse.json(
          { error: 'Full name is required for all participants' },
          { status: 400 }
        );
      }
    }

    const result = await participantRepository.bulkCreateParticipants(
      participants.map((p: any) => ({
        categoryId,
        email: p.email,
        fullName: p.fullName,
        schoolInstitution: p.schoolInstitution,
      }))
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to bulk create participants' },
      { status: 500 }
    );
  }
}
