/* Category-aware product imagery (Unsplash). Falls back gracefully. */

const IMG = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const CATEGORY_IMAGES = [
  {
    match: ["ring"],
    src: IMG("photo-1605100804763-247f67b3557e"),
  },
  {
    match: ["necklace"],
    src: IMG("photo-1599643478518-a784e5dc4c8f"),
  },
  {
    match: ["pendant"],
    src: IMG("photo-1602173574767-37ac01994b2a"),
  },
  {
    match: ["earring"],
    src: IMG("photo-1573408301185-9146fe634ad0"),
  },
  {
    match: ["bangle", "bracelet", "kadas"],
    src: IMG("photo-1611591437281-460bfbe1220a"),
  },
  {
    match: ["chain"],
    src: IMG("photo-1601121141461-9d6647bca1ed"),
  },
  {
    match: ["set", "bridal"],
    src: IMG("photo-1610694955371-d4a3e0ce4b52"),
  },
];

const FALLBACKS = [
  IMG("photo-1515562141207-7a88fb7ce338"),
  IMG("photo-1535632066927-ab7c9ab60908"),
  IMG("photo-1603561591411-07134e71a2a9"),
  IMG("photo-1600003263720-95b45a4035d5"),
];

export function productImage(product = {}) {
  // Prefer a real image URL from the backend when available
  if (product.imageUrl && /^https?:\/\//i.test(product.imageUrl)) {
    return product.imageUrl;
  }

  const haystack =
    `${product.category || ""} ${product.name || ""}`.toLowerCase();

  const hit = CATEGORY_IMAGES.find(({ match }) =>
    match.some((keyword) => haystack.includes(keyword))
  );

  if (hit) return hit.src;

  // Stable fallback per product so cards don't all look identical
  const index = Math.abs(
    String(product.id ?? product.name ?? "x")
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  );

  return FALLBACKS[index % FALLBACKS.length];
}

export const CATEGORY_TILES = [
  {
    name: "Rings",
    tag: "Eternal circles",
    src: IMG("photo-1605100804763-247f67b3557e", 700),
  },
  {
    name: "Necklaces",
    tag: "Graceful statements",
    src: IMG("photo-1599643478518-a784e5dc4c8f", 700),
  },
  {
    name: "Earrings",
    tag: "Everyday radiance",
    src: IMG("photo-1573408301185-9146fe634ad0", 700),
  },
  {
    name: "Bangles",
    tag: "Heritage craft",
    src: IMG("photo-1611591437281-460bfbe1220a", 700),
  },
];
