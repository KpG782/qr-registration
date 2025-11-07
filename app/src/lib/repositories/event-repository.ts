import { supabase } from '../supabase';

export interface Event {
  id: string;
  name: string;
  description: string | null;
  date: number | null;
  created_at: number;
}

export interface CreateEventInput {
  name: string;
  description?: string;
  date?: Date;
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  date?: Date;
}

export interface EventWithStats extends Event {
  categoryCount: number;
  participantCount: number;
}

class EventRepository {
  async getAllEvents(): Promise<EventWithStats[]> {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllEvents error:', error);
      throw error;
    }
    
    if (!events) return [];

    // Return with zero stats for performance
    return events.map(event => ({
      ...event,
      categoryCount: 0,
      participantCount: 0,
    }));
  }

  async getEventById(id: string): Promise<EventWithStats | null> {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('getEventById error:', error);
      throw error;
    }

    // Get counts
    const { count: categoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id);

    return {
      ...event,
      categoryCount: categoryCount || 0,
      participantCount: 0,
    };
  }

  async createEvent(input: CreateEventInput): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert({
        name: input.name,
        description: input.description || null,
        date: input.date ? Math.floor(input.date.getTime() / 1000) : null,
      })
      .select()
      .single();

    if (error) {
      console.error('createEvent error:', error);
      throw error;
    }
    
    return data;
  }

  async updateEvent(id: string, input: UpdateEventInput): Promise<Event | null> {
    const updates: any = {};
    
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.date !== undefined) {
      updates.date = input.date ? Math.floor(input.date.getTime() / 1000) : null;
    }

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('updateEvent error:', error);
      throw error;
    }

    return data;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('deleteEvent error:', error);
      throw error;
    }
    
    return true;
  }
}

export const eventRepository = new EventRepository();
