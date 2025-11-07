import getDb, { generateId } from '../db';

export interface Participant {
  id: string;
  category_id: string;
  email: string;
  full_name: string;
  school_institution: string | null;
  attendance_status: 'pending' | 'checked_in';
  checked_in_at: number | null;
  winner_rank: number | null;
  created_at: number;
}

export interface CreateParticipantInput {
  categoryId: string;
  email: string;
  fullName: string;
  schoolInstitution?: string;
}

export interface UpdateParticipantInput {
  email?: string;
  fullName?: string;
  schoolInstitution?: string;
  attendanceStatus?: 'pending' | 'checked_in';
  winnerRank?: number | null;
}

class ParticipantRepository {
  getAllParticipants(): Participant[] {
    const db = getDb();
    const participants = db.prepare(`
      SELECT * FROM participants
      ORDER BY created_at DESC
    `).all() as Participant[];
    
    return participants;
  }

  getParticipantsByCategoryId(categoryId: string): Participant[] {
    const db = getDb();
    const participants = db.prepare(`
      SELECT * FROM participants
      WHERE category_id = ?
      ORDER BY created_at DESC
    `).all(categoryId) as Participant[];
    
    return participants;
  }

  getParticipantById(id: string): Participant | null {
    const db = getDb();
    const participant = db.prepare(`
      SELECT * FROM participants WHERE id = ?
    `).get(id) as Participant | undefined;
    
    return participant || null;
  }

  getParticipantByEmailAndCategory(email: string, categoryId: string): Participant | null {
    const db = getDb();
    const participant = db.prepare(`
      SELECT * FROM participants
      WHERE email = ? AND category_id = ?
    `).get(email, categoryId) as Participant | undefined;
    
    return participant || null;
  }

  createParticipant(input: CreateParticipantInput): Participant {
    const db = getDb();
    const id = generateId();
    
    db.prepare(`
      INSERT INTO participants (id, category_id, email, full_name, school_institution)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id,
      input.categoryId,
      input.email,
      input.fullName,
      input.schoolInstitution || null
    );
    
    return this.getParticipantById(id) as Participant;
  }

  bulkCreateParticipants(participants: CreateParticipantInput[]): { success: number; failed: number; errors: string[] } {
    const db = getDb();
    const errors: string[] = [];
    let success = 0;
    let failed = 0;

    const insertStmt = db.prepare(`
      INSERT INTO participants (id, category_id, email, full_name, school_institution)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const participant of participants) {
      try {
        const id = generateId();
        insertStmt.run(
          id,
          participant.categoryId,
          participant.email,
          participant.fullName,
          participant.schoolInstitution || null
        );
        success++;
      } catch (error: any) {
        failed++;
        if (error.message.includes('UNIQUE constraint failed')) {
          errors.push(`Duplicate email: ${participant.email}`);
        } else {
          errors.push(`Failed to add ${participant.email}: ${error.message}`);
        }
      }
    }

    return { success, failed, errors };
  }

  updateParticipant(id: string, input: UpdateParticipantInput): Participant | null {
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (input.email !== undefined) {
      updates.push('email = ?');
      values.push(input.email);
    }
    if (input.fullName !== undefined) {
      updates.push('full_name = ?');
      values.push(input.fullName);
    }
    if (input.schoolInstitution !== undefined) {
      updates.push('school_institution = ?');
      values.push(input.schoolInstitution);
    }
    if (input.attendanceStatus !== undefined) {
      updates.push('attendance_status = ?');
      values.push(input.attendanceStatus);
      if (input.attendanceStatus === 'checked_in') {
        updates.push('checked_in_at = ?');
        values.push(Math.floor(Date.now() / 1000));
      }
    }
    if (input.winnerRank !== undefined) {
      updates.push('winner_rank = ?');
      values.push(input.winnerRank);
    }
    
    if (updates.length === 0) {
      return this.getParticipantById(id);
    }
    
    values.push(id);
    db.prepare(`
      UPDATE participants
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values);
    
    return this.getParticipantById(id);
  }

  checkInParticipant(id: string): Participant | null {
    const db = getDb();
    const now = Math.floor(Date.now() / 1000);
    
    db.prepare(`
      UPDATE participants
      SET attendance_status = 'checked_in', checked_in_at = ?
      WHERE id = ?
    `).run(now, id);
    
    return this.getParticipantById(id);
  }

  deleteParticipant(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM participants WHERE id = ?').run(id);
    return result.changes > 0;
  }

  getParticipantStats(categoryId: string): { total: number; checkedIn: number; pending: number } {
    const db = getDb();
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN attendance_status = 'checked_in' THEN 1 ELSE 0 END) as checkedIn,
        SUM(CASE WHEN attendance_status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM participants
      WHERE category_id = ?
    `).get(categoryId) as { total: number; checkedIn: number; pending: number };
    
    return stats;
  }
}

export const participantRepository = new ParticipantRepository();
