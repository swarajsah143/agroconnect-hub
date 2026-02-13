const cropImageMap: Record<string, string> = {
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82ber630?w=400&q=80",
  tomato: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&q=80",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80",
  cucumber: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  cabbage: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&q=80",
  cauliflower: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
  brinjal: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80",
  eggplant: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80",
  chili: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80",
  pepper: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80",
  garlic: "https://images.unsplash.com/photo-1615477550927-6ec8445b4a1a?w=400&q=80",
  ginger: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  orange: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80",
  grapes: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",
  watermelon: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&q=80",
  peas: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
  lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80",
  coconut: "https://images.unsplash.com/photo-1580984969071-a8da8df82a36?w=400&q=80",
  sugarcane: "https://images.unsplash.com/photo-1600626333392-59e39a0e0a88?w=400&q=80",
  soybean: "https://images.unsplash.com/photo-1599690925058-90e1a0b56154?w=400&q=80",
  mushroom: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400&q=80",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  pineapple: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80",
  papaya: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&q=80",
  guava: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&q=80",
  pomegranate: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  beetroot: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&q=80",
  radish: "https://images.unsplash.com/photo-1585163360992-e8b5a30ad3f3?w=400&q=80",
  lettuce: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80",
  broccoli: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80",
  pumpkin: "https://images.unsplash.com/photo-1506917728037-b6af01a7d403?w=400&q=80",
};

const DEFAULT_CROP_IMAGE = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80";

export function getCropImage(cropName: string): string {
  const key = cropName.trim().toLowerCase();
  // Direct match
  if (cropImageMap[key]) return cropImageMap[key];
  // Partial match (e.g. "organic tomatoes" matches "tomato")
  for (const [crop, url] of Object.entries(cropImageMap)) {
    if (key.includes(crop) || crop.includes(key)) return url;
  }
  return DEFAULT_CROP_IMAGE;
}
