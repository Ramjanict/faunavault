import { ApiResponse, Category, Animal, CreateAnimalPayload } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Fetch all categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    const json: ApiResponse<Category[]> = await res.json();
    return json.data || [];
  },

  // Fetch all animals with optional filtering
  async getAnimals(categoryId?: string, search?: string): Promise<Animal[]> {
    const params = new URLSearchParams();
    if (categoryId && categoryId !== 'all') {
      params.append('categoryId', categoryId);
    }
    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/api/animals${queryString}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch animals: ${res.statusText}`);
    }
    const json: ApiResponse<Animal[]> = await res.json();
    return json.data || [];
  },

  // Create a new category
  async createCategory(name: string): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to create category');
    }
    return json.data;
  },

  // Create a new animal with image upload
  async createAnimal(payload: CreateAnimalPayload): Promise<Animal> {
    let res: Response;

    if (payload.file) {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('categoryId', payload.categoryId);
      formData.append('file', payload.file);

      res = await fetch(`${API_BASE_URL}/api/animals`, {
        method: 'POST',
        body: formData,
      });
    } else {
      res = await fetch(`${API_BASE_URL}/api/animals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          categoryId: payload.categoryId,
          imageUrl: payload.imageUrl,
        }),
      });
    }

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to create animal');
    }
    return json.data;
  },

  // Delete an animal
  async deleteAnimal(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/animals/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to delete animal');
    }
  },
};
