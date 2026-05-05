export interface ProductDetails {
  title: string;
  category: string;
  style: string;
  useCase: string;
}

export interface GeneratedScript {
  id: string;
  hook: string;
  main: string;
  cta: string;
  caption: string;
  hashtags: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const detectProduct = async (imageFile: File): Promise<ProductDetails> => {
  try {
    const base64Image = await fileToBase64(imageFile);

    // Call the AI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: For a real production app, never expose the API key in frontend code.
        // It should be routed through a secure backend or use an environment variable.
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI product detection system. Your task is to analyze the provided image and output a JSON object with the following fields: "title" (a concise and descriptive product name), "category" (the product category, e.g., Elektronik, Fashion, Kecantikan, Rumah Tangga, Lainnya), "style" (the design style, e.g., Modern, Minimalis, Kasual, Mewah, Unik), and "useCase" (the primary use case, e.g., Sehari-hari, Liburan, Kerja, Olahraga, Pesta). Make sure the JSON is valid.'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this image and identify the product details in JSON format.' },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 300,
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to communicate with AI API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      title: parsed.title || 'Unknown Product',
      category: parsed.category || 'Lainnya',
      style: parsed.style || 'Modern',
      useCase: parsed.useCase || 'Sehari-hari',
    };
  } catch (error) {
    console.error('Error detecting product:', error);
    // Fallback to empty/unknown values instead of random to prevent random outputs
    return {
      title: 'Unknown Product',
      category: 'Lainnya',
      style: 'Modern',
      useCase: 'Sehari-hari',
    };
  }
};

const hooks = [
  "Bro, sumpah ini barang yang lo cari-cari selama ini! 😱",
  "Nyesel banget baru tau ada produk sekeren ini sekarang! 😭",
  "Stop scroll! Kalo lo lagi cari {product}, ini wajib banget lo tonton! 🔥",
  "Gila sih, nemu {product} yang bikin hidup makin gampang! 🤯",
  "Siapa yang suka ribet? Mending cobain ini deh! 👇"
];

const mains = [
  "Jadi kemaren gue lagi pusing banget nyari {product} yang pas buat {audience}. Eh pas nyobain ini, langsung jatuh cinta! Desainnya {style} banget, cocok buat {useCase}.",
  "Pernah nggak sih ngerasa {product} lo yang lama tuh kurang greget? Nah, yang satu ini beda banget! Kualitasnya mantep, fiturnya juara, dan pastinya bikin lo makin PD.",
  "Ini rahasia gue bisa selalu {useCase} dengan nyaman. Gampang banget pakenya, kualitas bahan nggak usah diragukan lagi. Worth it banget pokoknya!",
  "Dari sekian banyak {product} yang gue coba, ini yang paling the best! Cocok banget buat lo para {audience}. Nggak percaya? Cobain sendiri deh!",
  "Gue kasih tau nih, barang ini bakal ngebantu banget aktivitas lo. Tinggal pake, masalah beres. Bener-bener life hack yang wajib lo tau!"
];

const ctas = [
  "Buruan klik keranjang kuning sekarang sebelum kehabisan! 🛒💨",
  "Langsung aja cek link di bio gue buat dapetin promo menariknya! 🏃‍♂️",
  "Jangan sampai nyesel, checkout sekarang juga ya bestie! ✨",
  "Save video ini biar nggak lupa, terus klik link di bawah! 📌",
  "Tag temen lo yang butuh barang ini di kolom komentar! 👇"
];

const captions = [
  "Nemu harta karun lagi nih! Beneran deh, ini {product} andalan aku sekarang. Kamu wajib punya juga! 😍 #racuntiktok",
  "Rekomendasi {product} terbaik buat {audience}. Gak bakal nyesel beli ini! Checkout sekarang yuk! 💸",
  "Akhirnya nemu yang pas! Kualitasnya top banget, harganya juga affordable. Langsung kepoin keranjang kuning ya! 🛍️",
  "Bikin hidup makin gampang dengan {product} ini! Cocok buat nemenin hari-hari kamu. Yuk beli sekarang! ✨",
  "Wajib masuk wishlist kamu nih! Jangan lupa checkout ya sebelum kehabisan stoknya. Happy shopping! 🛒"
];

export const generateScript = async (
  product: ProductDetails,
  audience: string = "semua orang"
): Promise<GeneratedScript> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const randomHook = hooks[Math.floor(Math.random() * hooks.length)]
    .replace(/{product}/g, product.title);

  const randomMain = mains[Math.floor(Math.random() * mains.length)]
    .replace(/{product}/g, product.title)
    .replace(/{audience}/g, audience || "semua orang")
    .replace(/{style}/g, product.style)
    .replace(/{useCase}/g, product.useCase);

  const randomCta = ctas[Math.floor(Math.random() * ctas.length)];

  const randomCaption = captions[Math.floor(Math.random() * captions.length)]
    .replace(/{product}/g, product.title)
    .replace(/{audience}/g, audience || "semua orang");

  const baseHashtags = `#${product.title.replace(/\s+/g, '')} #${product.category.replace(/\s+/g, '')} #RacunTikTok #GayaDiTikTok #TikTokShop`;
  const additionalHashtags = audience ? ` #${audience.replace(/\s+/g, '')}` : '';

  return {
    id: Math.random().toString(36).substring(2, 9),
    hook: randomHook,
    main: randomMain,
    cta: randomCta,
    caption: randomCaption,
    hashtags: baseHashtags + additionalHashtags,
  };
};
