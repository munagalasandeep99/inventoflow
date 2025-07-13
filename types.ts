
export interface InventoryItem {
  itemId: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  salesHistory?: Sale[];
}

export interface Sale {
  saleId: string;
  date: string;
  quantitySold: number;
  pricePerItem: number;
  total: number;
}
