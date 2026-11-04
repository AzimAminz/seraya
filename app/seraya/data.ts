export type Category = "Bawal" | "Shawl" | "Instant";

export type Product = {
  id: string;
  category: Category;
  name: string;
  colour: string;
  swatch: string;
  /** Deep contrasting ground behind the tudung illustration on hover */
  deep: string;
  fabric: string;
  size: string;
  price: number;
  note: string;
  img: string;
  alt: string;
};

// Sample catalogue: names, fabrics and prices to be confirmed by the brand before launch.
export const products: Product[] = [
  {
    id: "embun",
    category: "Bawal",
    name: "Bawal Embun",
    colour: "Hijau sage",
    swatch: "#B9C7AE",
    deep: "#2F4A3A",
    fabric: "Chiffon",
    size: "45 × 45 inci",
    price: 69,
    note: "Hijau daun muda lepas hujan. Ringan, dan tak licin bila dililit.",
    img: "/images/sage-1.jpg",
    alt: "Wanita bertudung hijau sage berdiri di hadapan dinding putih",
  },
  {
    id: "mawar",
    category: "Shawl",
    name: "Shawl Mawar",
    colour: "Merah jambu",
    swatch: "#E7C3C6",
    deep: "#8E2F55",
    fabric: "Satin silk",
    size: "1.8 × 0.7 m",
    price: 89,
    note: "Warna pucuk baru. Berkilat sikit bila kena lampu.",
    img: "/images/rose-1.jpg",
    alt: "Wanita bertudung merah jambu lembut dan berbaju putih",
  },
  {
    id: "senja",
    category: "Shawl",
    name: "Shawl Senja",
    colour: "Mauve",
    swatch: "#CDB4B4",
    deep: "#5B2E45",
    fabric: "Crinkle chiffon",
    size: "1.8 × 0.7 m",
    price: 79,
    note: "Kainnya memang berkedut, jadi tak payah gosok langsung.",
    img: "/images/mauve-1.jpg",
    alt: "Wanita bertudung mauve memegang beg tangan di taman",
  },
  {
    id: "kopi",
    category: "Bawal",
    name: "Bawal Kopi Susu",
    colour: "Mocha",
    swatch: "#B89A80",
    deep: "#3E2A20",
    fabric: "Cotton voile",
    size: "45 × 45 inci",
    price: 59,
    note: "Warna kulit batang seraya. Nipis dan sejuk masa panas terik.",
    img: "/images/mocha-1.jpg",
    alt: "Wanita bertudung mocha dan berkot coklat menyentuh bunga",
  },
  {
    id: "kabus",
    category: "Shawl",
    name: "Shawl Kabus",
    colour: "Lilac kelabu",
    swatch: "#C9C4D4",
    deep: "#3B3550",
    fabric: "Jersi premium",
    size: "1.7 × 0.6 m",
    price: 75,
    note: "Macam kabus pagi atas hutan. Kainnya regang, senang nak lilit.",
    img: "/images/lilac-1.jpg",
    alt: "Wanita bertudung lilac berdiri di antara pokok",
  },
  {
    id: "pasir",
    category: "Instant",
    name: "Instant Pasir",
    colour: "Krim",
    swatch: "#EDE3D2",
    deep: "#7A3B4C",
    fabric: "Jersi",
    size: "Satu saiz",
    price: 65,
    note: "Sarung, siap dalam sepuluh saat. Untuk pagi yang kelam-kabut.",
    img: "/images/cream-1.jpg",
    alt: "Wanita bertudung krim tersenyum di tepi pantai",
  },
  {
    id: "batu",
    category: "Shawl",
    name: "Shawl Batu",
    colour: "Kelabu",
    swatch: "#BDB7B5",
    deep: "#2B2B30",
    fabric: "Chiffon",
    size: "1.8 × 0.7 m",
    price: 69,
    note: "Kelabu batu sungai. Masuk dengan hampir semua baju dalam almari.",
    img: "/images/grey-1.jpg",
    alt: "Wanita bertudung kelabu di hadapan pintu hijau",
  },
];

export const credits = [
  { title: "Woman in white hijab standing near white wall", by: "Muhammad Ruqi Yaddin", licence: "Unsplash", url: "https://unsplash.com/photos/L9ZVO0K0sco" },
  { title: "Woman in pink hijab and white long sleeve dress", by: "M. Ghufanil Muta Ali", licence: "Unsplash", url: "https://unsplash.com/photos/vAyDuvcjXcs" },
  { title: "A woman smiles, wearing hijab, outdoors", by: "Muhammad Faiz Zulkeflee", licence: "Unsplash", url: "https://unsplash.com/photos/jG6_fnFi6w8" },
  { title: "A woman in a hijab is holding a flower", by: "Agung Setiawan", licence: "Unsplash", url: "https://unsplash.com/photos/FgoOkdwrIXg" },
  { title: "A woman in a long dress standing in a park", by: "Lobar Qudratovna", licence: "Unsplash", url: "https://unsplash.com/photos/gfRh-XrYn4A" },
  { title: "Woman in white hijab standing on beach", by: "Irham Setyaki", licence: "Unsplash", url: "https://unsplash.com/photos/zbFWB8xztzs" },
  { title: "Person in white hijab and black long sleeve shirt", by: "Nada", licence: "Unsplash", url: "https://unsplash.com/photos/fBlplGY3TxA" },
  { title: "Woman wearing grey hijab", by: "Fahri Ramdani", licence: "Unsplash", url: "https://unsplash.com/photos/IRPBoFtGLFM" },
  { title: "A woman in a pink hijab walking down a walkway", by: "Faisal Hanafi", licence: "Unsplash", url: "https://unsplash.com/photos/lroh-oQeOew" },
  { title: "Taman Negara, Malaysia, Tall trees in canopy", by: "Vyacheslav Argenberg", licence: "CC BY 4.0", url: "https://commons.wikimedia.org/w/index.php?curid=91170239" },
  { title: "Taman Negara, Malaysia, Tree Canopy", by: "Vyacheslav Argenberg", licence: "CC BY 4.0", url: "https://commons.wikimedia.org/w/index.php?curid=91170242" },
  { title: "Silk weaving in Thailand", by: "Olena Zakharian", licence: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Silk_weaving_in_Thailand.webm" },
];
