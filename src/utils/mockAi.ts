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

const mockCategories = ["Elektronik", "Fashion", "Kecantikan", "Rumah Tangga", "Lainnya"];
const mockStyles = ["Modern", "Minimalis", "Kasual", "Mewah", "Unik"];
const mockUseCases = ["Sehari-hari", "Liburan", "Kerja", "Olahraga", "Pesta"];
const mockProducts = ["Sepatu Sneakers", "Phone Holder", "Kemeja Flanel", "Tas Selempang", "Earphone TWS"];

export const detectProduct = async (_imageFile: File): Promise<ProductDetails> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate random product details based on "analysis"
  const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
  const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
  const randomStyle = mockStyles[Math.floor(Math.random() * mockStyles.length)];
  const randomUseCase = mockUseCases[Math.floor(Math.random() * mockUseCases.length)];

  return {
    title: randomProduct,
    category: randomCategory,
    style: randomStyle,
    useCase: randomUseCase,
  };
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
