export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    animals: number;
  };
}

export interface Animal {
  id: string;
  name: string;
  imageUrl: string;
  imagePublicId?: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: boolean;
}

export interface CreateAnimalPayload {
  name: string;
  categoryId: string;
  file?: File;
  imageUrl?: string;
}
