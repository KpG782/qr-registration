import { supabase } from '../supabase';

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
  async getAllParticipants(): Promise<Participant[]> {
    const { data: participants, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllParticipants error:', error);
      throw error;
    }

    return participants || [];
  }

  async getParticipantsByCategoryId(categoryId: string): Promise<Participant[]> {
    const { data: participants, error } = await supabase
      .from('participants')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getParticipantsByCategoryId error:', error);
      throw error;
    }

    return participants || [];
  }

  async getParticipantById(id: string): Promise<Participant | null> {
    const { data: participant, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('getParticipantById error:', error);
      throw error;
    }

    return participant;
  }

  async getParticipantByEmailAndCategory(email: string, categoryId: string): Promise<Participant | null> {
    const { data: participant, error } = await supabase
      .from('participants')
      .select('*')
      .eq('email', email)
      .eq('category_id', categoryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('getParticipantByEmailAndCategory error:', error);
      throw error;
    }

    return participant;
  }

  async createParticipant(input: CreateParticipantInput): Promise<Participant> {
    const { data, error } = await supabase
      .from('participants')
      .insert({
        category_id: input.categoryId,
        email: input.email,
        full_name: input.fullName,
        school_institution: input.schoolInstitution || null,
      })
      .select()
      .single();

    if (error) {
      console.error('createParticipant error:', error);
      throw error;
    }

    return data;
  }

  async bulkCreateParticipants(participants: CreateParticipantInput[]): Promise<{ success: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;
    let failed = 0;

    for (const participant of participants) {
      try {
        await this.createParticipant(participant);
        success++;
      } catch (error: any) {
        failed++;
        if (error.code === '23505') { // Postgres unique constraint violation
          errors.push(`Duplicate email: ${participant.email}`);
        } else {
          errors.push(`Failed to add ${participant.email}: ${error.message}`);
        }
      }
    }

    return { success, failed, errors };
  }

  async updateParticipant(id: string, input: UpdateParticipantInput): Promise<Participant | null> {
    const updates: any = {};

    if (input.email !== undefined) updates.email = input.email;
    if (input.fullName !== undefined) updates.full_name = input.fullName;
    if (input.schoolInstitution !== undefined) updates.school_institution = input.schoolInstitution;
    if (input.attendanceStatus !== undefined) {
      updates.attendance_status = input.attendanceStatus;
      if (input.attendanceStatus === 'checked_in') {
        updates.checked_in_at = Math.floor(Date.now() / 1000);
      }
    }
    if (input.winnerRank !== undefined) updates.winner_rank = input.winnerRank;

    if (Object.keys(updates).length === 0) {
      return this.getParticipantById(id);
    }

    const { data, error } = await supabase
      .from('participants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('updateParticipant error:', error);
      throw error;
    }

    return data;
  }

  async checkInParticipant(id: string): Promise<Participant | null> {
    const now = Math.floor(Date.now() / 1000);

    const { data, error } = await supabase
      .from('participants')
      .update({
        attendance_status: 'checked_in',
        checked_in_at: now,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('checkInParticipant error:', error);
      throw error;
    }

    return data;
  }

  async deleteParticipant(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('deleteParticipant error:', error);
      throw error;
    }

    return true;
  }

  async getParticipantStats(categoryId: string): Promise<{ total: number; checkedIn: number; pending: number }> {
    const { data: participants, error } = await supabase
      .from('participants')
      .select('attendance_status')
      .eq('category_id', categoryId);

    if (error) {
      console.error('getParticipantStats error:', error);
      throw error;
    }

    const total = participants?.length || 0;
    const checkedIn = participants?.filter(p => p.attendance_status === 'checked_in').length || 0;
    const pending = participants?.filter(p => p.attendance_status === 'pending').length || 0;

    return { total, checkedIn, pending };
  }
}

export const participantRepository = new ParticipantRepository();
