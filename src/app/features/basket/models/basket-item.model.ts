export interface BasketItem {
    id: number;
    productId: number;
    userId: string;
    quantity: number;
    product: {
      id: number;
      title: string;
      price: number;
      thumbnail: string;
    };
  }
  