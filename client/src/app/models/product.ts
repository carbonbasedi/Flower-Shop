export interface Category {
  id: number;
  title: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  pictureUrl?: string;
  categoryId: number;
  category: string;
  isFeatured: boolean;
  discount: number;
}

export interface ProductParams {
  orderBy: string;
  searchTerm?: string;
  categories: string[];
  pageNumber: number;
  pageSize: number;
}
