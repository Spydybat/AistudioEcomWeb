import { Product, Category } from "../types";

export const CATEGORIES: Category[] = [
  {
    id: "all",
    name: "All Collections",
    description: "Explore the full luxury apparel range.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"
  },
  {
    id: "outerwear",
    name: "Outerwear",
    description: "Structured coats and jackets made for transitioning seasons.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"
  },
  {
    id: "knitwear",
    name: "Knitwear",
    description: "Italian spun merino and pure cashmere layers.",
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800"
  },
  {
    id: "tailoring",
    name: "Tailoring",
    description: "Sartorial craftsmanship redefined for the modern silhouettes.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800"
  },
  {
    id: "essentials",
    name: "Essentials",
    description: "Ethical baseline wardrobe foundational garments.",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "merino-trench-coat",
    name: "Sartorial Double-Breasted Trench",
    price: 495,
    originalPrice: 580,
    category: "outerwear",
    rating: 4.9,
    reviews: 48,
    badge: "Seasonal Icon",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800"
    ],
    colors: [
      { name: "Sand Camel", hex: "#C19A6B" },
      { name: "Obsidian Black", hex: "#1A1A1A" },
      { name: "Sage Olive", hex: "#556B2F" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A masterful reinterpretation of the classic trench coat, tailored in Italy from a heavy, water-repellent organic cotton and fine merino wool blend. Features structured storm flaps, tortoiseshell buttons, and an adjustable waist belt to shape a modern, tailored drape.",
    details: [
      "Shell: 70% Organic Cotton, 30% Merino Wool",
      "Spun and hand-tailored in Milan, Italy",
      "Double-breasted storm flap button enclosure",
      "Water-repellent lining with inner passport pocket",
      "Dry clean by luxury apparel experts only"
    ]
  },
  {
    id: "italian-linen-blazer",
    name: "Deconstructed Linen-Wool Blazer",
    price: 320,
    category: "tailoring",
    rating: 4.8,
    reviews: 32,
    badge: "Limited Release",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800"
    ],
    colors: [
      { name: "Natural Ecru", hex: "#F3EFE0" },
      { name: "Midnight Navy", hex: "#1D2A44" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "An unlined blazer prioritizing breathability and relaxed elegance. Spun from high-grade Irish linen and premium fine virgin wool, this jacket incorporates unstructured shoulders and patch pockets, establishing a sophisticated profile.",
    details: [
      "Fabric: 55% Irish Linen, 45% Virgin Wool",
      "Completely unlined core with bound interior seams",
      "Genuine Italian horn buttons and patch chest pocket",
      "Double vents at the rear of the hem",
      "Sustainably sourced and climate-neutral certified"
    ]
  },
  {
    id: "cashmere-crewneck",
    name: "Grade-A Mongolian Cashmere Sweater",
    price: 260,
    category: "knitwear",
    rating: 5.0,
    reviews: 64,
    badge: "Must Have",
    images: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800"
    ],
    colors: [
      { name: "Oatmeal Melange", hex: "#D2B48C" },
      { name: "Warm Charcoal", hex: "#4A4A4A" },
      { name: "Alabaster White", hex: "#F2F0EA" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Knitted from the finest 12-gauge, two-ply Mongolian cashmere fibers. Renowned for its unparalleled softness and exceptional warmth-to-weight ratio, this sweater features a tight-ribbed neckline, cuffs, and hem to retain its structural integrity over time.",
    details: [
      "100% Grade-A Mongolian Cashmere (12-Gauge, 2-Ply)",
      "Ethic-Sourced certified shearing standards",
      "Standard classic fit with elegant raglan styling",
      "Hypoallergenic and highly insulating core",
      "Wrapped in hand-embossed cedar luxury storage box"
    ]
  },
  {
    id: "tailored-wool-trouser",
    name: "Sartorial Pleated Wool Trouser",
    price: 185,
    category: "tailoring",
    rating: 4.7,
    reviews: 29,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800"
    ],
    colors: [
      { name: "Suited Charcoal", hex: "#333333" },
      { name: "Pebble Beige", hex: "#C5B9AC" }
    ],
    sizes: ["28", "30", "32", "34", "36"],
    description: "A meticulously draped trouser styled with single sharp forward pleats, a buttoned tab waistband adjuster, and an unfinished hem ready to be tailored to your absolute custom fit. Constructed from lightweight, breathable super-100s wool.",
    details: [
      "Super-100s Breathable Merino Wool",
      "Real horn side waistband tabs and functional buttons",
      "Single pleats with neat pressed front creases",
      "French fly with inside hook-and-bar closure",
      "Tailoring-ready unhemmed leg opening (34\" standard inseam)"
    ]
  },
  {
    id: "organic-cotton-shirt",
    name: "Classic Oxford Tailored Shirt",
    price: 110,
    category: "essentials",
    rating: 4.8,
    reviews: 112,
    badge: "Eco-Conscious",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800"
    ],
    colors: [
      { name: "Crisp Blue", hex: "#D4E6F1" },
      { name: "Optic Linen White", hex: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "The foundational piece of any sophisticated closet. Rendered from 100% long-staple organic GOTS-certified Egyptian cotton. Its structured yet supple oxford weave achieves a soft sheen while ensuring heavy durability and breathability.",
    details: [
      "100% GOTS Certified Long-Staple Egyptian Cotton",
      "Subtle modern cutaway collar with matching internal stays",
      "Single-needle stitch tailoring for pristine clean seams",
      "Premium mother-of-pearl buttons",
      "Pre-washed to protect size alignment and eliminate shrinking"
    ]
  },
  {
    id: "shearling-jacket",
    name: "Italian Aviator Shearling Flight Jacket",
    price: 850,
    originalPrice: 995,
    category: "outerwear",
    rating: 4.9,
    reviews: 14,
    badge: "Heritage Masterpiece",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800"
    ],
    colors: [
      { name: "Tobacco Suede", hex: "#8B5A2B" },
      { name: "Noir Shearling", hex: "#111111" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "An absolute pinnacle of outerwear investment. Handmade from heavyweight, top-grain Italian lamb shearling suede with soft, dense insulating wool inside. Accented with brass zippers and adjustable double-ring buckle collar straps.",
    details: [
      "100% Italian Lambskin Shearling Suede",
      "Naturally moisture-wicking and ultra-insulating shearling wool interior",
      "Solid heavy brass YKK zippers",
      "Double buckle collar fastenings and belted hips",
      "Handcrafted by third-generation tanners in Tuscany"
    ]
  },
  {
    id: "cashmere-lounge-pant",
    name: "Rib-Knit Cashmere Tapered Pant",
    price: 210,
    category: "knitwear",
    rating: 4.6,
    reviews: 19,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800"
    ],
    colors: [
      { name: "Cream Melange", hex: "#ECEBE4" },
      { name: "Warm Charcoal", hex: "#4A4A4A" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Redefine comfort with these soft knitted trousers. Carefully detailed with an adjustable braided drawstring waistband, subtle flat side slip pockets, and flat tailored rib-knit cuffs to maintain an exquisite profile.",
    details: [
      "85% Mongolian Cashmere, 15% Mulberry Silk blend",
      "Cozy medium-weight rib-knit texture",
      "Elastic waist with internal silk knit drawcord",
      "Tapered legs ending in snug rib-knit cuffs",
      "Made under carbon-neutral certified production workflows"
    ]
  },
  {
    id: "tuscan-leather-boot",
    name: "Handcrafted Chelsea Tuscan Boot",
    price: 340,
    category: "essentials",
    rating: 4.9,
    reviews: 57,
    badge: "Craft Favorite",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800"
    ],
    colors: [
      { name: "Rich Espresso Leather", hex: "#3E2723" },
      { name: "Classic Noir Calfskin", hex: "#1C1C1C" }
    ],
    sizes: ["8", "9", "10", "11", "12"],
    description: "An sleek Chelsea silhouette meticulously shaped from supple, hand-burnished oil-treated calf leather. Styled with premium elastic side panels, front/back woven pull-tabs, and a durable Goodyear welt structure to endure standard resolution wear.",
    details: [
      "Superb Italian Full-Grain Calfskin Leather",
      "Genuine cork filled leather midsole that contours to your foot shape",
      "Durable non-slip rubber studded leather outsole",
      "Resilient Goodyear welt construction allowing complete resoling",
      "Drenched in custom-formulated protective natural oils"
    ]
  }
];
