import type { ProductDetectionResult } from "./detection";

export interface GeneratedContent {
  hook: string;
  script: string;
  cta: string;
  caption: string;
  hashtags: string;
}

const HOOKS = [
  "Sumpah nyesel banget baru tau ada barang sekeren ini! 😱", // FOMO
  "Sering bete karena masalah ini? Sini aku kasih tau solusinya! 💡", // Problem
  "Rahasia terbongkar! Ini dia barang yang lagi viral banget! 🔥", // Curiosity
  "Pasti kamu belum tau kan fungsi asli dari barang ini? 🤔", // Curiosity
  "Udah nyobain segala cara tapi gagal? Wajib tonton sampai habis! 🛑" // Problem
];

const MAIN_SCRIPTS = [
  "Jadi ini tuh {product}, cocok banget buat {audience}. Desainnya cakep, bahannya premium, dan yang paling penting fungsinya beneran kepake buat sehari-hari. Nggak heran kalau ini selalu sold out dimana-mana.",
  "Jujur awalnya skeptis, tapi pas nyobain {product} ini, gila sih! Buat kamu para {audience}, ini ngebantu banget bikin aktivitas makin gampang. Kualitasnya juara banget, nggak kaleng-kaleng.",
  "Ini dia {product} yang bikin hidup makin praktis! Spesial buat {audience}, kalian wajib banget punya. Bener-bener ngerubah cara aku ngerjain hal ini setiap hari. Super worth it!"
];

const CTAS = [
  "Langsung aja cek keranjang kuning sebelum kehabisan! 🛒",
  "Klik link di bio aku ya buat langsung order! ✨",
  "Buruan checkout sekarang mumpung lagi diskon gede-gedean! 🏃‍♂️",
  "Jangan sampai nyesel, buruan klik keranjang di bawah! 👇"
];

const CAPTIONS = [
  "Penemuan terbaik bulan ini! Kalian wajib punya juga nih. Cek link di bio ya! 🤩",
  "Nggak nyangka barang sebagus ini harganya murah banget. Langsung checkout! 💸",
  "Solusi buat masalah kalian selama ini. Wajib banget masuk wishlist! ✨"
];

function getRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateScript(
  title: string,
  audience: string,
  detection: ProductDetectionResult
): GeneratedContent {
  // In a real app, you would send this to OpenAI/Anthropic
  // e.g., const response = await openai.chat.completions.create({...})

  const targetAudience = audience.trim() || 'semua orang';
  const productName = title.trim() || detection.category;

  const scriptTemplate = getRandom(MAIN_SCRIPTS);
  const script = scriptTemplate
    .replace('{product}', productName)
    .replace('{audience}', targetAudience);

  const categoryHashtags = detection.category.toLowerCase().replace(/\s+/g, '');

  return {
    hook: getRandom(HOOKS),
    script,
    cta: getRandom(CTAS),
    caption: getRandom(CAPTIONS),
    hashtags: `#${categoryHashtags} #racuntiktok #barangunik #rekomendasi #fyp`
  };
}