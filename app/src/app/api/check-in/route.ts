import { NextRequest, NextResponse } from 'next/server';
import { participantRepository, categoryRepository } from '@/lib/repositories';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, email } = body;

    if (!categoryId || !email) {
      return NextResponse.json(
        { error: 'Category ID and email are required' },
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

    // Check if participant exists
    const participant = await participantRepository.getParticipantByEmailAndCategory(
      email,
      categoryId
    );

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found. Please check your email or contact the organizer.' },
        { status: 404 }
      );
    }

    // Get category info
    const category = await categoryRepository.getCategoryById(categoryId);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      participant: {
        id: participant.id,
        email: participant.email,
        full_name: participant.full_name,
        school_institution: participant.school_institution,
        attendance_status: participant.attendance_status,
        checked_in_at: participant.checked_in_at,
      },
      category: {
        id: category.id,
        name: category.name,
      },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId } = body;

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    // Mark participant as checked in
    const participant = await participantRepository.checkInParticipant(participantId);

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        email: participant.email,
        full_name: participant.full_name,
        attendance_status: participant.attendance_status,
        checked_in_at: participant.checked_in_at,
      },
    });
  } catch (error) {
    console.error('Check-in confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm check-in' },
      { status: 500 }
    );
  }
}
