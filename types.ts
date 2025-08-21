
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  flavors: string[];
  color: 'cyan' | 'purple' | 'pink';
}
