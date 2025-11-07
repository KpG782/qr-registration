import { NextRequest, NextResponse } from 'next/server';
import { eventRepository } from '@/lib/repositories/event-repository';

export async function GET() {
  try {
    const events = await eventRepository.getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, date } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const event = await eventRepository.createEvent({
      name,
      description,
      date: date ? new Date(date) : undefined,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
