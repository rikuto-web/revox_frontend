export interface Bike {
    id: number;
    userId: number;
    manufacturer : string;
    modelName: string;
    modelCode?: string | null;
    modelYear?: number | null;
    currentMileage?: number | null;
    purchaseDate?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BikeCreateRequest {
    manufacturer: string;
    modelName: string;
    modelCode?: string | null;
    modelYear?: number | null;
    currentMileage?: number | null;
    purchaseDate?: string | null;
    imageUrl?: string | null;
}

export interface BikeUpdateRequest {
  manufacturer: string;
  modelName: string;
  modelCode?: string | null;
  modelYear?: number | null;
  currentMileage?: number | null;
  purchaseDate?: string | null;
  imageUrl?: string | null;
}