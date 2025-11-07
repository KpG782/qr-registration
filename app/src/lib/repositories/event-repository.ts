import getDb, { generateId } from '../db';

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
  getAllEvents(): EventWithStats[] {
    const db = getDb();
    const events = db.prepare(`
      SELECT 
        e.*,
        COUNT(DISTINCT c.id) as categoryCount,
        COUNT(DISTINCT p.id) as participantCount
      FROM events e
      LEFT JOIN categories c ON c.event_id = e.id
      LEFT JOIN participants p ON p.category_id = c.id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `).all() as EventWithStats[];
    
    return events;
  }

  getEventById(id: string): EventWithStats | null {
    const db = getDb();
    const event = db.prepare(`
      SELECT 
        e.*,
        COUNT(DISTINCT c.id) as categoryCount,
        COUNT(DISTINCT p.id) as participantCount
      FROM events e
      LEFT JOIN categories c ON c.event_id = e.id
      LEFT JOIN participants p ON p.category_id = c.id
      WHERE e.id = ?
      GROUP BY e.id
    `).get(id) as EventWithStats | undefined;
    
    return event || null;
  }

  createEvent(input: CreateEventInput): Event {
    const db = getDb();
    const id = generateId();
    const date = input.date ? Math.floor(input.date.getTime() / 1000) : null;
    
    db.prepare(`
      INSERT INTO events (id, name, description, date)
      VALUES (?, ?, ?, ?)
    `).run(id, input.name, input.description || null, date);
    
    return this.getEventById(id) as Event;
  }

  updateEvent(id: string, input: UpdateEventInput): Event | null {
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.description !== undefined) {
      updates.push('description = ?');
      values.push(input.description);
    }
    if (input.date !== undefined) {
      updates.push('date = ?');
      values.push(input.date ? Math.floor(input.date.getTime() / 1000) : null);
    }
    
    if (updates.length === 0) {
      return this.getEventById(id);
    }
    
    values.push(id);
    db.prepare(`
      UPDATE events
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values);
    
    return this.getEventById(id);
  }

  deleteEvent(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const eventRepository = new EventRepository();
