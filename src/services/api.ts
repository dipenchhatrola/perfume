import { Perfume } from '../types/perfume';

// Use environment variable with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-url.com/api';

// Enable mock data for development/testing
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock data for testing
const mockPerfumes: Perfume[] = [
  {
    id: '1',
    name: 'Midnight Rose',
    brand: 'Luxury Scents',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    description: 'A captivating blend of rose and musk',
    category: 'women',
    rating: 4.5,
    reviews: 128,
    inStock: true
  },
  {
    id: '2',
    name: 'Ocean Breeze',
    brand: 'Aqua Fresh',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1590736969956-8bc5afa6b1e9?auto=format&fit=crop&w=400&q=80',
    description: 'Fresh aquatic scent for everyday wear',
    category: 'unisex',
    rating: 4.2,
    reviews: 95,
    inStock: true
  },
  {
    id: '3',
    name: 'Royal Oak',
    brand: 'Gentleman\'s Choice',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    description: 'Woody and sophisticated fragrance',
    category: 'men',
    rating: 4.8,
    reviews: 210,
    inStock: true
  },
  {
    id: '4',
    name: 'Vanilla Dream',
    brand: 'Sweet Essence',
    price: 75.99,
    imageUrl: 'https://images.unsplash.com/photo-1590736969956-8bc5afa6b1e9?auto=format&fit=crop&w=400&q=80',
    description: 'Warm and sweet vanilla fragrance',
    category: 'women',
    rating: 4.3,
    reviews: 87,
    inStock: true
  },
  {
    id: '5',
    name: 'Citrus Burst',
    brand: 'Fresh Finds',
    price: 69.99,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    description: 'Energizing citrus blend',
    category: 'unisex',
    rating: 4.1,
    reviews: 63,
    inStock: true
  },
  {
    id: '6',
    name: 'Dark Knight',
    brand: 'Premium Scents',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    description: 'Mysterious and intense fragrance',
    category: 'men',
    rating: 4.7,
    reviews: 142,
    inStock: true
  },
  {
    id: '7',
    name: 'Lavender Fields',
    brand: 'Botanical Bliss',
    price: 95.99,
    imageUrl: 'https://images.unsplash.com/photo-1590736969956-8bc5afa6b1e9?auto=format&fit=crop&w=400&q=80',
    description: 'Calming lavender scent',
    category: 'women',
    rating: 4.4,
    reviews: 105,
    inStock: true
  },
  {
    id: '8',
    name: 'Urban Explorer',
    brand: 'Modern Scents',
    price: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    description: 'Contemporary urban fragrance',
    category: 'unisex',
    rating: 4.6,
    reviews: 178,
    inStock: true
  }
];

// Helper function to simulate API delay
const simulateDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Fetch featured perfumes
export const fetchFeaturedPerfumes = async (): Promise<Perfume[]> => {
  try {
    if (USE_MOCK_DATA) {
      // Return mock data for testing
      await simulateDelay();
      // Return first 4 perfumes as featured
      return mockPerfumes.slice(0, 4);
    }
    
    const response = await fetch(`${API_BASE_URL}/perfumes/featured`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Perfume[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch featured perfumes');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching featured perfumes:', error);
    
    // Fallback to mock data on error
    if (USE_MOCK_DATA) {
      return mockPerfumes.slice(0, 4);
    }
    
    throw error;
  }
};

// Fetch new arrivals
export const fetchNewArrivals = async (): Promise<Perfume[]> => {
  try {
    if (USE_MOCK_DATA) {
      // Return mock data for testing
      await simulateDelay();
      // Return last 4 perfumes as new arrivals
      return mockPerfumes.slice(-4);
    }
    
    const response = await fetch(`${API_BASE_URL}/perfumes/new-arrivals`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Perfume[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch new arrivals');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    
    // Fallback to mock data on error
    if (USE_MOCK_DATA) {
      return mockPerfumes.slice(-4);
    }
    
    throw error;
  }
};

// Add to cart function
export const addToCart = async (perfumeId: string, quantity: number = 1): Promise<boolean> => {
  try {
    if (USE_MOCK_DATA) {
      // Simulate API call with mock success
      await simulateDelay(500);
      console.log(`Mock: Added perfume ${perfumeId} to cart (quantity: ${quantity})`);
      return true;
    }
    
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        perfumeId,
        quantity
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    // In development with mock data, still return true
    if (USE_MOCK_DATA) {
      return true;
    }
    
    throw error;
  }
};

// Additional API functions you might need
export const fetchAllPerfumes = async (): Promise<Perfume[]> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return mockPerfumes;
    }
    
    const response = await fetch(`${API_BASE_URL}/perfumes`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Perfume[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch perfumes');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching perfumes:', error);
    
    if (USE_MOCK_DATA) {
      return mockPerfumes;
    }
    
    throw error;
  }
};

// Fetch perfume by ID
export const fetchPerfumeById = async (id: string): Promise<Perfume | null> => {
  try {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const perfume = mockPerfumes.find(p => p.id === id);
      return perfume || null;
    }
    
    const response = await fetch(`${API_BASE_URL}/perfumes/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Perfume> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch perfume');
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error fetching perfume ${id}:`, error);
    
    if (USE_MOCK_DATA) {
      const perfume = mockPerfumes.find(p => p.id === id);
      return perfume || null;
    }
    
    throw error;
  }
};