export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  address?: Address;
  phone?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  unit: string;
  stock: number;
  discount?: number;
  featured?: boolean;
  organic?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: Address;
  paymentMethod: 'cash_on_delivery';
  estimatedDelivery?: string;
}

export type Category = 
  | 'fruits' 
  | 'vegetables' 
  | 'dairy' 
  | 'bakery' 
  | 'meat' 
  | 'seafood' 
  | 'frozen' 
  | 'pantry' 
  | 'beverages' 
  | 'snacks' 
  | 'household';