import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Order interfaces
export interface OrderItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: string;
  quantity: number;
  specifications?: string[];
  features?: string[];
  dimensions?: string;
  material?: string;
  weight?: string;
  warranty?: string;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'upi' | 'cash' | 'bank_transfer';
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  notes?: string;
  createdAt: any;
  updatedAt: any;
}

// Contact form interfaces
export interface ContactForm {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: 'residential' | 'commercial' | 'industrial' | 'custom';
  message: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: any;
  updatedAt: any;
}

// Order Service
export class OrderService {
  private static readonly COLLECTION_NAME = 'orders';

  // Create a new order
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const orderWithTimestamp = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), orderWithTimestamp);
      console.log('Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get orders for a specific user
  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  // Get a specific order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Order;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const orderRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  // Update payment status
  static async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    try {
      const orderRef = doc(db, this.COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        paymentStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }
}

// Contact Service
export class ContactService {
  private static readonly COLLECTION_NAME = 'contacts';

  // Submit a contact form
  static async submitContactForm(contactData: Omit<ContactForm, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const contactWithTimestamp = {
        ...contactData,
        status: 'new' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), contactWithTimestamp);
      console.log('Contact form submitted with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form');
    }
  }

  // Get all contact forms (for admin)
  static async getAllContactForms(): Promise<ContactForm[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const contacts: ContactForm[] = [];
      
      querySnapshot.forEach((doc) => {
        contacts.push({
          id: doc.id,
          ...doc.data()
        } as ContactForm);
      });
      
      return contacts;
    } catch (error) {
      console.error('Error fetching contact forms:', error);
      throw new Error('Failed to fetch contact forms');
    }
  }

  // Get contact forms for a specific user
  static async getUserContactForms(userId: string): Promise<ContactForm[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const contacts: ContactForm[] = [];
      
      querySnapshot.forEach((doc) => {
        contacts.push({
          id: doc.id,
          ...doc.data()
        } as ContactForm);
      });
      
      return contacts;
    } catch (error) {
      console.error('Error fetching user contact forms:', error);
      throw new Error('Failed to fetch contact forms');
    }
  }

  // Update contact form status
  static async updateContactStatus(contactId: string, status: ContactForm['status']): Promise<void> {
    try {
      const contactRef = doc(db, this.COLLECTION_NAME, contactId);
      await updateDoc(contactRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw new Error('Failed to update contact status');
    }
  }
}

// Utility functions
export const calculateOrderTotal = (items: OrderItem[], shipping: number = 500): {
  subtotal: number;
  tax: number;
  total: number;
} => {
  const subtotal = items.reduce((total, item) => {
    const price = parseFloat(item.price?.replace(/[₹,]/g, '') || '0');
    return total + (price * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    total: Math.round(total)
  };
};

export default { OrderService, ContactService, calculateOrderTotal };
