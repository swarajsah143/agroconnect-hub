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
  },
  {
    id: '7',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Bananas',
    category: 'Fruits',
    quantity: 500,
    unit: 'kg',
    price: 50,
    location: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
    description: 'Ripe yellow bananas'
  },
  {
    id: '8',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Red Onions',
    category: 'Vegetables',
    quantity: 600,
    unit: 'kg',
    price: 35,
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    description: 'Fresh red onions'
  },
  {
    id: '9',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Sweet Corn',
    category: 'Vegetables',
    quantity: 400,
    unit: 'kg',
    price: 40,
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
    description: 'Fresh sweet corn'
  },
  {
    id: '10',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Carrots',
    category: 'Vegetables',
    quantity: 450,
    unit: 'kg',
    price: 45,
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    description: 'Organic carrots'
  },
  {
    id: '11',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Green Peas',
    category: 'Vegetables',
    quantity: 300,
    unit: 'kg',
    price: 60,
    location: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1588167056734-c109a8f2e5c0?w=400',
    description: 'Fresh green peas'
  },
  {
    id: '12',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Cauliflower',
    category: 'Vegetables',
    quantity: 350,
    unit: 'kg',
    price: 38,
    location: 'Haryana',
    image: 'https://images.unsplash.com/photo-1568584711271-ca11d6bf55c6?w=400',
    description: 'Fresh white cauliflower'
  },
  {
    id: '13',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Spinach',
    category: 'Vegetables',
    quantity: 200,
    unit: 'kg',
    price: 40,
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    description: 'Green leafy spinach'
  },
  {
    id: '14',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Fresh Oranges',
    category: 'Fruits',
    quantity: 500,
    unit: 'kg',
    price: 70,
    location: 'Nagpur',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400',
    description: 'Juicy oranges'
  },
  {
    id: '15',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Green Grapes',
    category: 'Fruits',
    quantity: 250,
    unit: 'kg',
    price: 90,
    location: 'Nashik',
    image: 'https://images.unsplash.com/photo-1599819177626-c8e5c9e7f3d7?w=400',
    description: 'Sweet green grapes'
  },
  {
    id: '16',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Cabbage',
    category: 'Vegetables',
    quantity: 550,
    unit: 'kg',
    price: 28,
    location: 'West Bengal',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400',
    description: 'Green cabbage'
  },
  {
    id: '17',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Green Chillies',
    category: 'Vegetables',
    quantity: 150,
    unit: 'kg',
    price: 80,
    location: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1583663721523-3e7b2e98e2c7?w=400',
    description: 'Hot green chillies'
  },
  {
    id: '18',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Fresh Ginger',
    category: 'Vegetables',
    quantity: 200,
    unit: 'kg',
    price: 100,
    location: 'Kerala',
    image: 'https://images.unsplash.com/photo-1613149373574-e74c4c29d0c7?w=400',
    description: 'Organic ginger root'
  },
  {
    id: '19',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Garlic',
    category: 'Vegetables',
    quantity: 250,
    unit: 'kg',
    price: 120,
    location: 'Gujarat',
    image: 'https://images.unsplash.com/photo-1619521911292-f02b07051fd7?w=400',
    description: 'White garlic bulbs'
  },
  {
    id: '20',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Fresh Cucumbers',
    category: 'Vegetables',
    quantity: 400,
    unit: 'kg',
    price: 32,
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400',
    description: 'Crisp green cucumbers'
  },
  {
    id: '21',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Bell Peppers',
    category: 'Vegetables',
    quantity: 220,
    unit: 'kg',
    price: 75,
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
    description: 'Colorful bell peppers'
  },
  {
    id: '22',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Pumpkin',
    category: 'Vegetables',
    quantity: 320,
    unit: 'kg',
    price: 42,
    location: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400',
    description: 'Large orange pumpkins'
  },
  {
    id: '23',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Watermelon',
    category: 'Fruits',
    quantity: 800,
    unit: 'kg',
    price: 25,
    location: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784833?w=400',
    description: 'Sweet juicy watermelon'
  },
  {
    id: '24',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Fresh Papaya',
    category: 'Fruits',
    quantity: 300,
    unit: 'kg',
    price: 50,
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400',
    description: 'Ripe papaya'
  },
  {
    id: '25',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Pomegranate',
    category: 'Fruits',
    quantity: 200,
    unit: 'kg',
    price: 150,
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    description: 'Fresh pomegranates'
  },
  {
    id: '26',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Fresh Beetroot',
    category: 'Vegetables',
    quantity: 280,
    unit: 'kg',
    price: 48,
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
    description: 'Red beetroot'
  },
  {
    id: '27',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Fresh Radish',
    category: 'Vegetables',
    quantity: 320,
    unit: 'kg',
    price: 36,
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1596789038026-21d6fcb3c997?w=400',
    description: 'White radish'
  },
  {
    id: '28',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Lemons',
    category: 'Fruits',
    quantity: 400,
    unit: 'kg',
    price: 60,
    location: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400',
    description: 'Tangy lemons'
  },
  {
    id: '29',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Fresh Mushrooms',
    category: 'Vegetables',
    quantity: 100,
    unit: 'kg',
    price: 200,
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1551461831-ed7ae4e63f2c?w=400',
    description: 'Button mushrooms'
  },
  {
    id: '30',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Fresh Broccoli',
    category: 'Vegetables',
    quantity: 180,
    unit: 'kg',
    price: 85,
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400',
    description: 'Green broccoli'
  },
  {
    id: '31',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Eggplant',
    category: 'Vegetables',
    quantity: 350,
    unit: 'kg',
    price: 42,
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=400',
    description: 'Purple eggplant'
  },
  {
    id: '32',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Sweet Potatoes',
    category: 'Vegetables',
    quantity: 500,
    unit: 'kg',
    price: 38,
    location: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1568568916229-06d60e96c7d2?w=400',
    description: 'Orange sweet potatoes'
  },
  {
    id: '33',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Fresh Guava',
    category: 'Fruits',
    quantity: 280,
    unit: 'kg',
    price: 65,
    location: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400',
    description: 'Fresh guava'
  },
  {
    id: '34',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Pineapple',
    category: 'Fruits',
    quantity: 200,
    unit: 'kg',
    price: 55,
    location: 'Kerala',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400',
    description: 'Sweet pineapple'
  },
  {
    id: '35',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Fresh Coconut',
    category: 'Fruits',
    quantity: 300,
    unit: 'pieces',
    price: 40,
    location: 'Kerala',
    image: 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=400',
    description: 'Fresh coconuts'
  },
  {
    id: '36',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Green Beans',
    category: 'Vegetables',
    quantity: 250,
    unit: 'kg',
    price: 52,
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1604686112055-37cad098b88f?w=400',
    description: 'Fresh green beans'
  },
  {
    id: '37',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Lettuce',
    category: 'Vegetables',
    quantity: 180,
    unit: 'kg',
    price: 58,
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400',
    description: 'Crisp lettuce'
  },
  {
    id: '38',
    farmerId: 'farmer2',
    farmerName: 'Sarah Green',
    name: 'Fresh Celery',
    category: 'Vegetables',
    quantity: 150,
    unit: 'kg',
    price: 68,
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1552635813-9b41271e4d47?w=400',
    description: 'Fresh celery stalks'
  },
  {
    id: '39',
    farmerId: 'farmer3',
    farmerName: 'Mike Brown',
    name: 'Fresh Strawberries',
    category: 'Fruits',
    quantity: 120,
    unit: 'kg',
    price: 180,
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    description: 'Sweet strawberries'
  },
  {
    id: '40',
    farmerId: 'farmer1',
    farmerName: 'John Farmer',
    name: 'Fresh Kiwi',
    category: 'Fruits',
    quantity: 100,
    unit: 'kg',
    price: 220,
    location: 'Arunachal Pradesh',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
    description: 'Fresh kiwi fruits'
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
