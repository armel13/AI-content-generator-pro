export interface ProductDetectionResult {
  category: string;
  confidence: number;
  style: string;
  useCase: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Shoes': ['shoe', 'sneaker', 'boots', 'heels', 'sandals', 'kicks'],
  'Phone Holder': ['holder', 'stand', 'mount', 'tripod', 'grip'],
  'Clothing': ['shirt', 't-shirt', 'hoodie', 'jacket', 'pants', 'dress', 'apparel'],
  'Electronics': ['phone', 'laptop', 'tablet', 'charger', 'cable', 'earbuds', 'headphones'],
  'Skincare': ['serum', 'cream', 'lotion', 'cleanser', 'moisturizer', 'sunscreen'],
  'Home Decor': ['lamp', 'rug', 'poster', 'vase', 'pillow', 'blanket']
};

export function detectProduct(
  imageNames: string[],
  userTitleInput: string
): ProductDetectionResult {
  const allText = [...imageNames, userTitleInput].join(' ').toLowerCase();

  let bestMatch = 'Unknown';
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter(keyword => allText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category;
    }
  }

  // If no keywords matched, confidence is 0. If some matched, confidence is higher.
  const confidence = maxMatches === 0 ? 0.3 : Math.min(0.5 + (maxMatches * 0.15), 0.95);

  return {
    category: bestMatch,
    confidence,
    style: bestMatch !== 'Unknown' ? 'Modern/Trendy' : 'General',
    useCase: bestMatch !== 'Unknown' ? `Daily use for ${bestMatch.toLowerCase()}` : 'General use',
  };
}