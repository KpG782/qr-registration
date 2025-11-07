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

class CategoryRepository {
  async getAllCategories(): Promise<CategoryWithStats[]> {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllCategories error:', error);
      throw error;
    }

    if (!categories) return [];

    // Get participant counts separately for performance
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('participants')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);

        return {
          ...category,
          participantCount: count || 0,
        };
      })
    );

    return categoriesWithStats;
  }

  async getCategoriesByEventId(eventId: string): Promise<CategoryWithStats[]> {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getCategoriesByEventId error:', error);
      throw error;
    }

    if (!categories) return [];

    // Get participant counts separately for performance
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('participants')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);

        return {
          ...category,
          participantCount: count || 0,
        };
      })
    );

    return categoriesWithStats;
  }

  async getCategoryById(id: string): Promise<CategoryWithStats | null> {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('getCategoryById error:', error);
      throw error;
    }

    // Get participant count
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    return {
      ...category,
      participantCount: count || 0,
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

    if (error) {
      console.error('createCategory error:', error);
      throw error;
    }

    return data;
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const updates: any = {};

    if (input.name !== undefined) updates.name = input.name;

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('updateCategory error:', error);
      throw error;
    }

    return data;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('deleteCategory error:', error);
      throw error;
    }

    return true;
  }
}

export const categoryRepository = new CategoryRepository();
