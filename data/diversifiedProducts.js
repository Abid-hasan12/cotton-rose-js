const imageLibrary = {
  knitwear: { src: "/images/products/knitwear.jpg", alt: "Plain cotton T-shirt representing knitwear sourcing" },
  woven: { src: "/images/products/woven-shirts.jpg", alt: "Formal woven shirts arranged on hangers" },
  sweaters: { src: "/images/products/sweaters.jpg", alt: "Folded sweaters showing knitted textures" },
  activewear: { src: "/images/products/activewear.jpg", alt: "Coordinated performance activewear set" },
  denim: { src: "/images/products/denim.jpg", alt: "Stacked denim textiles in varied indigo shades" },
  outerwear: { src: "/images/products/outerwear.jpg", alt: "Utility-inspired outerwear jacket" },
  swimwear: { src: "/images/products/swimwear.jpg", alt: "One-piece swimwear illustrating the swim category" },
  workwear: { src: "/images/products/workwear.jpg", alt: "High-visibility workwear in an industrial setting" },
  range: { src: "/images/products/product-range.jpg", alt: "Coordinated apparel range on a clothing rail" },
};

const galleryByGroup = {
  Knit: ["knitwear", "sweaters", "range", "activewear"],
  Woven: ["woven", "outerwear", "denim", "range"],
  Outerwear: ["outerwear", "workwear", "range", "woven"],
  Denim: ["denim", "woven", "outerwear", "range"],
};

const primaryImageByProduct = {
  "swimwear-board-shorts": "swimwear",
  "t-shirts": "knitwear",
  "sportswear-activewear": "activewear",
  "woven-mens-bottoms": "woven",
  "woven-kids-bottoms": "woven",
  "fleece-jackets": "outerwear",
  outerwear: "outerwear",
  "denim-kids": "denim",
  "mens-ladies-shirts": "woven",
  "denim-long-pants": "denim",
  sweaters: "sweaters",
  "polo-shirts": "knitwear",
  "dress-shirts": "woven",
  "workwear-outerwear": "workwear",
};

const makeGallery = (id, group) => {
  const primary = primaryImageByProduct[id];
  const supporting = id === "swimwear-board-shorts"
    ? ["activewear", "range", "knitwear"]
    : galleryByGroup[group];
  const keys = [primary, ...supporting.filter((key) => key !== primary)].slice(0, 4);
  return keys.map((key) => imageLibrary[key]);
};

export const diversifiedProductGroups = ["All", "Knit", "Woven", "Outerwear", "Denim"];

const catalogue = [
  ["swimwear-board-shorts", "Swimwear / Board Shorts", "Swimwear", "Woven", "Performance swim pieces and quick-dry board shorts engineered for comfort and movement.", ["Recycled polyester", "Nylon stretch", "Quick-dry microfiber", "Mesh lining"], ["1560089000-7433a4ebbd64", "1571019613454-1cb2f99b2d8b", "1502680390469-be75c86b636f", "1596755389378-c31d21fd1273"]],
  ["t-shirts", "T-Shirts", "T-Shirts", "Knit", "Everyday and fashion tees in versatile weights, fits, finishes, and responsible fibers.", ["Cotton jersey", "Organic cotton", "Cotton elastane", "Recycled blends"], ["1521572163474-6864f9cf17ab", "1583743814966-8936f37f4ec5", "1562157873-818bc0726f68", "1576566588028-4147f3842f27"]],
  ["sportswear-activewear", "Sportswear / Activewear", "Activewear", "Knit", "Technical activewear designed around stretch, breathability, and lasting performance.", ["Polyester elastane", "Nylon elastane", "Moisture-wicking mesh", "Antibacterial knits"], ["1538805060514-97d9cc17730c", "1517836357463-d25dfeac3438", "1518611012118-696072aa579a", "1574680096145-d05b474e2155"]],
  ["woven-mens-bottoms", "Woven Men's Bottoms", "Men's Bottoms", "Woven", "Refined casual and utility bottoms with dependable construction and fit consistency.", ["Cotton twill", "Canvas", "Poplin", "Stretch dobby"], ["1473966968600-fa801b869a1a", "1506629082955-511b1aa562c8", "1624378439575-d8705ad7ae80", "1541099649105-f69ad21f3246"]],
  ["woven-kids-bottoms", "Woven Kids' Bottoms", "Kids' Bottoms", "Woven", "Comfort-first kids' trousers and shorts with durable, safety-conscious detailing.", ["Soft cotton twill", "Stretch canvas", "Corduroy", "Washed poplin"], ["1503919545889-aef636e10ad4", "1622290291468-a28f7a7dc6a8", "1519238263530-99bdd11df2ea", "1607453998774-d533f65dac99"]],
  ["fleece-jackets", "Fleece Jackets", "Fleece Jackets", "Outerwear", "Warm, lightweight fleece layers for lifestyle, performance, and workwear programs.", ["Polar fleece", "Sherpa fleece", "Bonded fleece", "Recycled polyester"], ["1551028719-00167b16eac5", "1548883354-7622d03aca27", "1542272604-787c3835535d", "1591047139829-d91aecb6caea"]],
  ["outerwear", "Outerwear", "Outerwear", "Outerwear", "Versatile protective layers combining weather resistance with contemporary styling.", ["Nylon taslon", "Polyester pongee", "Softshell", "PU-coated fabrics"], ["1544022613-e87ca75a784a", "1551488831-00ddcb6c6bd3", "1591047139829-d91aecb6caea", "1551028719-00167b16eac5"]],
  ["denim-kids", "Denim Kids", "Kids' Denim", "Denim", "Kid-friendly denim with soft hand feel, flexible fits, and durable wash treatments.", ["Comfort stretch denim", "Lightweight denim", "Cotton lyocell", "Recycled cotton"], ["1542272604-787c3835535d", "1541099649105-f69ad21f3246", "1548883354-7622d03aca27", "1519238263530-99bdd11df2ea"]],
  ["mens-ladies-shirts", "Men's & Ladies' Shirts", "Casual Shirts", "Woven", "Casual and fashion shirts developed for men and women across diverse fabrications.", ["Cotton poplin", "Oxford", "Viscose", "Linen blends"], ["1603252109303-2751441dd157", "1602810318383-e386cc2a3ccf", "1598033129183-c4f50c736f10", "1523381210434-271e8be1f52b"]],
  ["denim-long-pants", "Denim Long Pants", "Denim Pants", "Denim", "Classic and fashion denim bottoms in a broad range of washes, weights, and silhouettes.", ["Rigid denim", "Comfort stretch", "Power stretch", "Recycled cotton denim"], ["1542272604-787c3835535d", "1541099649105-f69ad21f3246", "1475178626620-a4d074967452", "1548883354-7622d03aca27"]],
  ["sweaters", "Sweaters", "Sweaters", "Knit", "Fine and chunky gauge knitwear combining dependable workmanship with a premium hand feel.", ["Cotton", "Acrylic", "Wool blends", "Viscose nylon"], ["1576566588028-4147f3842f27", "1512436991641-6745cdb1723f", "1434389677669-e08b4cac3105", "1608234807905-4466023792f5"]],
  ["polo-shirts", "Polo Shirts", "Polo Shirts", "Knit", "Clean, structured polos for lifestyle, uniform, and corporate programs.", ["Cotton pique", "Interlock", "Performance polyester", "Cotton elastane"], ["1521572163474-6864f9cf17ab", "1586363104862-3a5e2ab60d99", "1602810318383-e386cc2a3ccf", "1576566588028-4147f3842f27"]],
  ["dress-shirts", "Dress Shirts", "Dress Shirts", "Woven", "Precision-made formal shirts with crisp collars, polished finishing, and consistent sizing.", ["Fine poplin", "Broadcloth", "Dobby", "Easy-care cotton blends"], ["1602810318383-e386cc2a3ccf", "1598033129183-c4f50c736f10", "1603252109303-2751441dd157", "1523381210434-271e8be1f52b"]],
  ["workwear-outerwear", "Workwear / Outerwear", "Workwear", "Outerwear", "Purpose-built workwear focused on protection, mobility, durability, and brand visibility.", ["Heavy cotton twill", "Ripstop", "High-visibility fabric", "Water-resistant canvas"], ["1578681994506-b8f463449011", "1544022613-e87ca75a784a", "1551028719-00167b16eac5", "1591047139829-d91aecb6caea"]],
];

export const diversifiedProducts = catalogue.map(([id, catalogueName, shortName, group, summary, materials], index) => {
  const name = catalogueName;
  const gallery = makeGallery(id, group);
  return { id, name, shortName, group, summary, materials, gallery, image: gallery[0].src, alt: gallery[0].alt, catalogueIndex: index + 1 };
});

export function getDiversifiedProduct(category) {
  return diversifiedProducts.find((product) => product.id === category);
}
