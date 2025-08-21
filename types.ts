
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  flavors: string[];
  color: 'cyan' | 'purple' | 'pink';
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    address: string;
  };
}
