import { Order, CartItem, Address } from '../types';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: 'cash_on_delivery';
}

export const createOrder = async (params: CreateOrderParams): Promise<Order> => {
  try {
    // Create a new order in Firestore
    const orderData = {
      userId: params.userId,
      items: params.items.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      subtotal: params.subtotal,
      tax: params.tax,
      deliveryFee: params.deliveryFee,
      total: params.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryAddress: params.deliveryAddress,
      paymentMethod: params.paymentMethod,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    return {
      _id: docRef.id,
      ...orderData
    } as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    // Query Firestore for user's orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    
    // For demo purposes, we'll return some sample orders
    // In a real app, you would map the query results to Order objects
    
    // Sample orders for demonstration
    const sampleOrders: Order[] = [
      {
        _id: 'order1',
        userId: userId,
        items: [
          {
            product: {
              _id: '1',
              name: 'Organic Bananas',
              description: 'Sweet and yellow organic bananas.',
              price: 2.99,
              image: 'https://images.pexels.com/photos/47305/bananas-banana-shrub-fruits-yellow-47305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'fruits',
              unit: 'bunch',
              stock: 50,
              organic: true
            },
            quantity: 2
          },
          {
            product: {
              _id: '4',
              name: 'Fresh Broccoli',
              description: 'Fresh, crisp broccoli.',
              price: 1.99,
              image: 'https://images.pexels.com/photos/161514/brocoli-vegetables-salad-green-161514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'vegetables',
              unit: 'head',
              stock: 40
            },
            quantity: 1
          }
        ],
        subtotal: 7.97,
        tax: 0.64,
        deliveryFee: 5.99,
        total: 14.60,
        status: 'delivered',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'cash_on_delivery'
      },
      {
        _id: 'order2',
        userId: userId,
        items: [
          {
            product: {
              _id: '7',
              name: 'Organic Milk',
              description: 'Fresh, organic whole milk.',
              price: 4.99,
              image: 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'dairy',
              unit: 'half gallon',
              stock: 20,
              organic: true
            },
            quantity: 1
          },
          {
            product: {
              _id: '10',
              name: 'Sourdough Bread',
              description: 'Freshly baked sourdough bread.',
              price: 4.49,
              image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'bakery',
              unit: 'loaf',
              stock: 15
            },
            quantity: 1
          }
        ],
        subtotal: 9.48,
        tax: 0.76,
        deliveryFee: 5.99,
        total: 16.23,
        status: 'shipped',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'cash_on_delivery'
      }
    ];
    
    return sampleOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch orders');
  }
};