import { NextRequest, NextResponse } from 'next/server';
import { participantRepository } from '@/lib/repositories';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participant = participantRepository.checkInParticipant(id);

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(participant);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check in participant' },
      { status: 500 }
    );
  }
}
