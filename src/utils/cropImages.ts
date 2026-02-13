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
  grape: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",
  watermelon: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&q=80",
  peas: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
  pea: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
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
  dragonfruit: "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&q=80",
  "dragon fruit": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&q=80",
  avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80",
  cherry: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80",
  peach: "https://images.unsplash.com/photo-1595124216650-1f6a35cd1e2c?w=400&q=80",
  plum: "https://images.unsplash.com/photo-1502459880755-44b8aadbaa4b?w=400&q=80",
  fig: "https://images.unsplash.com/photo-1601379760883-1bb497c558e0?w=400&q=80",
  jackfruit: "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=400&q=80",
  lychee: "https://images.unsplash.com/photo-1622490799001-1d384c2c3e4e?w=400&q=80",
  kiwi: "https://images.unsplash.com/photo-1585059895524-72f7d3b4a3e3?w=400&q=80",
  zucchini: "https://images.unsplash.com/photo-1563252722-6434563a985d?w=400&q=80",
  okra: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&q=80",
  sweetpotato: "https://images.unsplash.com/photo-1596097635121-14b63a7a8c8e?w=400&q=80",
  "sweet potato": "https://images.unsplash.com/photo-1596097635121-14b63a7a8c8e?w=400&q=80",
  turnip: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&q=80",
  celery: "https://images.unsplash.com/photo-1580391564590-aeca65c5e2d3?w=400&q=80",
  asparagus: "https://images.unsplash.com/photo-1515471209610-dae1c92d8777?w=400&q=80",
  bean: "https://images.unsplash.com/photo-1567375698348-5d9d5ae3eab2?w=400&q=80",
  chickpea: "https://images.unsplash.com/photo-1515543904279-e4b7e2e6b4c1?w=400&q=80",
  lentil: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
  groundnut: "https://images.unsplash.com/photo-1567375698348-5d9d5ae3eab2?w=400&q=80",
  peanut: "https://images.unsplash.com/photo-1567375698348-5d9d5ae3eab2?w=400&q=80",
  turmeric: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  coriander: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  mint: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80",
};

const DEFAULT_CROP_IMAGE = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80";

// ── Fuzzy matching helpers ──────────────────────────────────────────

/** Simple Levenshtein distance */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Strip trailing 's', 'es', 'ies→y' for naive depluralization */
function depluralize(word: string): string {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (word.endsWith("es")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Normalize: lowercase, trim, strip non-alpha-space, collapse spaces */
function normalize(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ── In-memory cache ─────────────────────────────────────────────────
const resolvedCache = new Map<string, string>();

const cropKeys = Object.keys(cropImageMap);

/**
 * Get a realistic image URL for a crop name.
 * Priority: exact → partial/contains → depluralized → fuzzy (Levenshtein ≤ 2) → default
 * Results are cached in memory so repeated lookups are instant.
 */
export function getCropImage(cropName: string): string {
  const raw = normalize(cropName);
  if (!raw) return DEFAULT_CROP_IMAGE;

  // Check cache first
  if (resolvedCache.has(raw)) return resolvedCache.get(raw)!;

  let result: string | undefined;

  // 1. Direct match
  result = cropImageMap[raw];

  // 2. Partial / contains match (handles "organic tomatoes", "red apple")
  if (!result) {
    for (const key of cropKeys) {
      if (raw.includes(key) || key.includes(raw)) {
        result = cropImageMap[key];
        break;
      }
    }
  }

  // 3. Depluralized match (apples → apple, potatoes → potato)
  if (!result) {
    const words = raw.split(" ");
    for (const word of words) {
      const singular = depluralize(word);
      if (cropImageMap[singular]) {
        result = cropImageMap[singular];
        break;
      }
      // Also check if any key contains the singular
      for (const key of cropKeys) {
        if (key.includes(singular) || singular.includes(key)) {
          result = cropImageMap[key];
          break;
        }
      }
      if (result) break;
    }
  }

  // 4. Fuzzy match via Levenshtein distance (handles typos like "mengo" → "mango")
  if (!result) {
    let bestDist = Infinity;
    let bestKey = "";
    const words = raw.split(" ");
    for (const word of words) {
      const singular = depluralize(word);
      for (const key of cropKeys) {
        const dist = Math.min(levenshtein(singular, key), levenshtein(word, key));
        if (dist < bestDist) {
          bestDist = dist;
          bestKey = key;
        }
      }
    }
    // Accept if distance ≤ 2 (handles 1-2 char typos)
    if (bestDist <= 2 && bestKey) {
      result = cropImageMap[bestKey];
    }
  }

  const url = result || DEFAULT_CROP_IMAGE;
  resolvedCache.set(raw, url);
  return url;
}
