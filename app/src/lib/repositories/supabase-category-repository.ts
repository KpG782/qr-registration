import { supabase } from '../supabase';

export interface Category {
  id: string;
  event_id: string;
  name: string;
  created_at: number;
}

export interface CreateCategoryInput {
  eventId: string;
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

export interface CategoryWithStats extends Category {
  participantCount: number;
}

class SupabaseCategoryRepository {
  async getAllCategories(): Promise<CategoryWithStats[]> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        participants:participants(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((cat: any) => ({
      ...cat,
      participantCount: cat.participants?.[0]?.count || 0,
    }));
  }

  async getCategoriesByEventId(eventId: string): Promise<CategoryWithStats[]> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        participants:participants(count)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((cat: any) => ({
      ...cat,
      participantCount: cat.participants?.[0]?.count || 0,
    }));
  }

  async getCategoryById(id: string): Promise<CategoryWithStats | null> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        participants:participants(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      participantCount: data.participants?.[0]?.count || 0,
    };
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        event_id: input.eventId,
        name: input.name,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    if (input.name === undefined) {
      return this.getCategoryById(id) as Promise<Category | null>;
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: input.name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

export const supabaseCategoryRepository = new SupabaseCategoryRepository();
