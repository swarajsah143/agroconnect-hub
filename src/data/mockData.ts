export interface Crop {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  image: string;
  description: string;
}

export interface Inquiry {
  id: string;
  cropId: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'responded';
}

export interface ExpertPost {
  id: string;
  expertId: string;
  expertName: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  likes: number;
}

export interface Question {
  id: string;
  farmerId: string;
  farmerName: string;
  title: string;
  content: string;
  createdAt: string;
  answers: number;
}

export const mockCrops: Crop[] = [
  {
    id: '1',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Organic Tomatoes',
    category: 'Vegetables',
    quantity: 500,
    unit: 'kg',
    price: 45,
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    description: 'Fresh organic tomatoes, pesticide-free'
  },
  {
    id: '2',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Wheat',
    category: 'Grains',
    quantity: 2000,
    unit: 'kg',
    price: 25,
    location: 'Haryana',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    description: 'High-quality wheat grains'
  },
  {
    id: '3',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Apples',
    category: 'Fruits',
    quantity: 300,
    unit: 'kg',
    price: 80,
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400',
    description: 'Sweet and crispy apples'
  },
  {
    id: '4',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Basmati Rice',
    category: 'Grains',
    quantity: 1500,
    unit: 'kg',
    price: 60,
    location: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    description: 'Premium basmati rice'
  },
  {
    id: '5',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Potatoes',
    category: 'Vegetables',
    quantity: 800,
    unit: 'kg',
    price: 30,
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    description: 'Farm-fresh potatoes'
  },
  {
    id: '6',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Mangoes',
    category: 'Fruits',
    quantity: 400,
    unit: 'kg',
    price: 120,
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
    description: 'Sweet Alphonso mangoes'
  }
];

export const mockExpertPosts: ExpertPost[] = [
  {
    id: '1',
    expertId: 'expert1',
    expertName: 'Dr. Priya Patel',
    title: 'Best Practices for Organic Farming',
    content: 'Organic farming requires careful soil management and natural pest control. Here are the key principles...',
    category: 'Farming Techniques',
    createdAt: '2024-11-28',
    likes: 145
  },
  {
    id: '2',
    expertId: 'expert2',
    expertName: 'Prof. Raj Kumar',
    title: 'Water Conservation in Agriculture',
    content: 'Efficient water usage is crucial for sustainable farming. Drip irrigation and rainwater harvesting...',
    category: 'Sustainability',
    createdAt: '2024-11-27',
    likes: 98
  },
  {
    id: '3',
    expertId: 'expert1',
    expertName: 'Dr. Priya Patel',
    title: 'Dealing with Common Crop Diseases',
    content: 'Early detection is key. Look for yellowing leaves, spots, or wilting. Natural remedies include...',
    category: 'Crop Health',
    createdAt: '2024-11-25',
    likes: 203
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    title: 'How to prevent tomato blight?',
    content: 'My tomatoes are showing signs of blight. What organic solutions can I use?',
    createdAt: '2024-11-29',
    answers: 3
  },
  {
    id: '2',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    title: 'Best time to harvest wheat?',
    content: 'When is the optimal time to harvest wheat in North India?',
    createdAt: '2024-11-28',
    answers: 5
  }
];
