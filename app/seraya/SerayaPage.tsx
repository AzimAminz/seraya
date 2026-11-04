"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { products, type Category } from "./data";
import { Logo } from "./Logo";
import Loader from "./Loader";
import CardReveal from "./CardReveal";
import { useMotion } from "./useMotion";

const slides = [
  {
    title: "Tudung lembut, setinggi Seraya",
    text: "Tujuh warna lembut yang kami ambil dari hutan. Chiffon, satin dan jersi, dari RM59 sehelai.",
    cta: "Beli Bawal Embun",
    product: "embun",
  },
  {
    title: "Shawl Mawar dah sampai",
    text: "Satin silk merah jambu yang berkilat lembut. Tak melekat di pipi walaupun dipakai seharian. RM89.",
    cta: "Beli Shawl Mawar",
    product: "mawar",
  },
  {
    title: "Sejuk untuk hari panas",
    text: "Bawal Kopi Susu dalam cotton voile yang nipis dan berangin. Sesuai untuk tengah hari di KL. RM59.",
    cta: "Beli Bawal Kopi Susu",
    product: "kopi",
  },
];

const categories: { name: Category; img: string; alt: string; from: number }[] = [
  { name: "Bawal", img: "/images/sage-2.jpg", alt: "Wanita bertudung bawal hijau sage di bawah pokok", from: 59 },
  { name: "Shawl", img: "/images/mauve-1.jpg", alt: "Wanita memakai shawl mauve di taman", from: 69 },
  { name: "Instant", img: "/images/cream-1.jpg", alt: "Wanita memakai tudung instant krim di tepi pantai", from: 65 },
];

const byId = (id: string) => products.find((p) => p.id === id)!;

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICON = {
  bag: "M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01",
  swap: "M7 7h11l-3-3M17 17H6l3 3",
  leaf: "M5 19c0-8 5-14 14-14 0 9-6 14-14 14Zm0 0 7-7",
  lock: "M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3",
};

export default function SerayaPage() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const heroText = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<Category | "Semua">("Semua");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotion(root);

  // Banner slides advance on their own until the visitor takes over.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("motion") === "0") return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const banner = root.current?.querySelector(".banner");
    if (banner) observer.observe(banner);
    const id = window.setInterval(() => {
      if (visible && !document.hidden) setSlide((s) => (s + 1) % slides.length);
    }, 6000);
    return () => {
      observer.disconnect();
      window.clearInterval(id);
    };
  }, [paused]);

  useEffect(() => {
    if (!heroText.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("motion") === "0") return;
    const tween = gsap.fromTo(
      heroText.current.querySelectorAll(".slide-in"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" },
    );
    return () => { tween.revert(); };
  }, [slide]);

  useEffect(() => {
    document.documentElement.style.overflow = cartOpen || menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, menuOpen]);

  const goSlide = (i: number) => {
    setPaused(true);
    setSlide((i + slides.length) % slides.length);
  };

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    setCartOpen(true);
  };
  const remove = (id: string) =>
    setCart((c) => {
      const n = { ...c };
      if (n[id] > 1) n[id] -= 1;
      else delete n[id];
      return n;
    });

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((a, [id, q]) => a + byId(id).price * q, 0);
  const shown = filter === "Semua" ? products : products.filter((p) => p.category === filter);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 280) + 20), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  const current = slides[slide];
  const hero = byId(current.product);

  return (
    <div ref={root} className="page">
      <Loader />
      <a className="skip" href="#koleksi">Langkau ke koleksi</a>

      <p className="announce">
        Pos percuma ke Semenanjung bila beli RM150 ke atas
      </p>

      <header className="nav">
        <div className="nav-inner">
          <button type="button" className="icon-btn nav-burger" aria-label="Buka menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Icon d={ICON.menu} />
          </button>
          <a href="#atas" className="nav-logo" aria-label="Seraya, laman utama">
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Utama">
            <a href="#koleksi" onClick={() => setFilter("Bawal")}>Bawal</a>
            <a href="#koleksi" onClick={() => setFilter("Shawl")}>Shawl</a>
            <a href="#koleksi" onClick={() => setFilter("Instant")}>Instant</a>
            <a href="#kisah">Kisah kami</a>
            <a href="#fabrik">Fabrik</a>
          </nav>
          <div className="nav-actions">
            <button type="button" className="icon-btn cart-btn" aria-label={`Beg anda, ${count} item`} onClick={() => setCartOpen(true)}>
              <Icon d={ICON.bag} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="banner" id="atas" aria-roledescription="carousel" aria-label="Sorotan Seraya">
        <div className="banner-text" ref={heroText}>
          <div className="banner-copy" aria-live="polite">
            <h1 className="banner-title slide-in">{current.title}</h1>
            <p className="banner-lead slide-in">{current.text}</p>
            <div className="banner-ctas slide-in">
              <button type="button" className="btn btn-accent" onClick={() => add(hero.id)}>
                {current.cta}
              </button>
              <a className="btn btn-ghost" href="#koleksi">
                Lihat semua warna
              </a>
            </div>
          </div>
          <div className="banner-foot">
            <div className="swatches" role="group" aria-label="Warna">
              {products.map((p) => (
                <a key={p.id} href="#koleksi" className="swatch" style={{ background: p.swatch }} title={`${p.name}, ${p.colour}`} aria-label={`${p.name}, ${p.colour}`} />
              ))}
            </div>
            <div className="dots">
              <button type="button" className="icon-btn" onClick={() => goSlide(slide - 1)} aria-label="Slaid sebelumnya">
                <Icon d={ICON.left} />
              </button>
              <span className="dots-count">
                {slide + 1} / {slides.length}
              </span>
              <button type="button" className="icon-btn" onClick={() => goSlide(slide + 1)} aria-label="Slaid seterusnya">
                <Icon d={ICON.right} />
              </button>
            </div>
          </div>
        </div>
        <div className="banner-media">
          {slides.map((s, i) => {
            const p = byId(s.product);
            return (
              <Image
                key={s.product}
                src={p.img}
                alt={i === slide ? p.alt : ""}
                aria-hidden={i !== slide}
                fill
                priority={i === 0}
                sizes="(max-width: 900px) 100vw, 50vw"
                className={`banner-img${i === slide ? " is-on" : ""}`}
              />
            );
          })}
          <div className="banner-tag">
            <span>
              <strong>{hero.name}</strong>
              <br />
              {hero.fabric} · RM{hero.price}
            </span>
            <button type="button" className="tag-add" onClick={() => add(hero.id)} aria-label={`Tambah ${hero.name} ke beg`}>
              <Icon d={ICON.bag} size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Shopper guarantees */}
      <ul className="perks" aria-label="Jaminan pembeli">
        {[
          [ICON.truck, "Hantar 2–3 hari", "Semenanjung, percuma dari RM150"],
          [ICON.swap, "Tukar dalam 14 hari", "Warna tak kena? Kami tukarkan"],
          [ICON.leaf, "Fabrik tanpa gosok", "Jersi dan crinkle, terus sarung"],
          [ICON.lock, "Bayaran selamat", "FPX, kad dan e-dompet"],
        ].map(([icon, t, s]) => (
          <li key={t} className="perk reveal">
            <Icon d={icon} size={26} />
            <span>
              <strong>{t}</strong>
              <br />
              {s}
            </span>
          </li>
        ))}
      </ul>

      {/* Categories */}
      <section className="cats" aria-labelledby="cats-h">
        <h2 id="cats-h" className="head reveal">Beli ikut gaya</h2>
        <div className="cats-grid">
          {categories.map((c) => (
            <a key={c.name} href="#koleksi" className="cat reveal" onClick={() => setFilter(c.name)}>
              <span className="cat-img">
                <Image src={c.img} alt={c.alt} fill sizes="33vw" />
              </span>
              <span className="cat-label">
                <span className="cat-name">{c.name}</span>
                <span>Dari RM{c.from}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Product carousel */}
      <section className="koleksi" id="koleksi" aria-labelledby="koleksi-h">
        <div className="koleksi-head">
          <div className="reveal">
            <h2 id="koleksi-h" className="head">Pilih warna anda</h2>
            <p className="sub">Tujuh warna, empat jenis kain. Tekan “Tambah ke beg” terus dari kad.</p>
          </div>
          <div className="koleksi-tools reveal">
            <div className="filters" role="group" aria-label="Tapis kategori">
              {(["Semua", "Bawal", "Shawl", "Instant"] as const).map((f) => (
                <button key={f} type="button" className={`filter${filter === f ? " is-on" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div className="arrows">
              <button type="button" className="icon-btn arrow" onClick={() => step(-1)} aria-label="Produk sebelumnya">
                <Icon d={ICON.left} />
              </button>
              <button type="button" className="icon-btn arrow" onClick={() => step(1)} aria-label="Produk seterusnya">
                <Icon d={ICON.right} />
              </button>
            </div>
          </div>
        </div>

        <div className="track" ref={track} data-lenis-prevent-horizontal>
          {shown.map((p) => (
            <article key={p.id} className="card">
              <div className="card-img">
                <Image src={p.img} alt={p.alt} fill sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 900px) 46vw, 22vw" />
                <CardReveal product={p} />
                <button
                  type="button"
                  className={`like${liked[p.id] ? " is-on" : ""}`}
                  aria-pressed={!!liked[p.id]}
                  aria-label={`Simpan ${p.name}`}
                  onClick={() => setLiked((l) => ({ ...l, [p.id]: !l[p.id] }))}
                >
                  <Icon d={ICON.heart} size={20} />
                </button>
                <span className="card-cat">{p.category}</span>
              </div>
              <div className="card-body">
                <h3 className="card-name">{p.name}</h3>
                <p className="card-meta">
                  <span className="dot" style={{ background: p.swatch }} />
                  {p.colour} · {p.fabric}
                </p>
                <p className="card-note">{p.note}</p>
                <div className="card-buy">
                  <span className="price">RM{p.price}</span>
                  <button type="button" className="btn btn-accent btn-sm" onClick={() => add(p.id)}>
                    Tambah ke beg
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Name story */}
      <section className="kisah" id="kisah" aria-labelledby="kisah-h">
        <div className="kisah-photo reveal">
          <Image src="/images/taman-negara-malaysia-tall-trees-in-canopy.jpg" alt="Pokok-pokok tinggi menembusi kanopi hutan hujan di Taman Negara, Malaysia" fill sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="letter">
          <h2 id="kisah-h" className="head reveal">Kenapa Seraya</h2>
          <div className="reveal">
            <p>
              Pokok seraya tumbuh di hutan hujan Semenanjung dan Borneo. Ia naik
              perlahan-lahan, lapis demi lapis kanopi, sampai pucuknya berdiri
              lebih tinggi daripada pokok lain.
            </p>
            <p>
              Kami mahu tudung yang macam itu. Tenang, tak tergesa-gesa, dan buat
              pemakainya <mark>berdiri lebih tegak</mark>.
            </p>
            <p>
              Warna kami pun datang dari hutan yang sama. Hijau sage daripada daun
              muda, merah jambu daripada pucuk baru, mocha daripada kulit batang,
              dan krim daripada kabus pagi.
            </p>
          </div>
          <p className="signoff reveal">Pasukan Seraya, Kuala Lumpur</p>
        </div>
      </section>

      {/* Fabric menu with clip */}
      <section className="menu-wrap" id="fabrik" aria-labelledby="menu-h">
        <figure className="reel reveal">
          <video className="reel-video" muted loop playsInline preload="none" poster="/images/silk-weaving-poster.jpg" width={854} height={480} aria-label="Proses menenun sutera">
            <source src="/images/silk-weaving.webm" type="video/webm" />
          </video>
          <figcaption>Benang sutera ditarik dari kepompong, Thailand.</figcaption>
        </figure>
        <div className="menu reveal">
          <h2 id="menu-h" className="head menu-title">Dalam setiap helai</h2>
          {[
            {
              group: "Fabrik",
              rows: [
                ["Chiffon", "1.8 × 0.7 m", "Ringan, dua lapis di dahi supaya tak jarang."],
                ["Satin silk", "1.8 × 0.7 m", "Berkilat lembut, tak melekat di pipi."],
                ["Jersi premium", "Tanpa gosok", "Regang ke semua arah, masih selesa sampai malam."],
                ["Cotton voile", "45 × 45 inci", "Nipis dan berangin, kena dengan cuaca kita."],
              ],
            },
            {
              group: "Kemasan",
              rows: [
                ["Jahitan tepi baby hem", "Semua shawl", "Tepi kain halus, tak berbulu walaupun selalu dibasuh."],
                ["Label dicetak pada kain", "Tak gatal", "Tak ada label yang menggaru tengkuk."],
              ],
            },
          ].map((g) => (
            <div className="menu-group" key={g.group}>
              <h3 className="menu-group-name">{g.group}</h3>
              <dl>
                {g.rows.map(([name, value, desc]) => (
                  <div className="menu-row" key={name}>
                    <dt>
                      <span className="menu-name">{name}</span>
                      <span className="menu-dots" aria-hidden="true" />
                      <span className="menu-value">{value}</span>
                    </dt>
                    <dd>{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Closing photograph */}
      <section className="akhir" aria-labelledby="akhir-h">
        <div className="akhir-photo">
          <Image src="/images/rose-walk.jpg" alt="Wanita bertudung merah jambu berjalan di laluan berbumbung" fill sizes="100vw" />
        </div>
        <div className="akhir-text">
          <h2 id="akhir-h" className="head reveal">Cari warna anda</h2>
          <p className="reveal">
            Stok pertama dihantar Januari 2027. Kalau warna yang sampai tak kena
            dengan kulit, tukar saja dalam 14 hari.
          </p>
          <div className="akhir-ctas reveal">
            <a className="btn btn-paper" href="#koleksi">Beli sekarang</a>
            <a className="btn btn-line" href="#fabrik">Panduan fabrik</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <Logo size={44} />
          <p>Tudung pastel dari Kuala Lumpur. Namanya kami ambil daripada pokok seraya.</p>
        </div>
        <nav aria-label="Kedai">
          <h3>Kedai</h3>
          <a href="#koleksi" onClick={() => setFilter("Bawal")}>Bawal</a>
          <a href="#koleksi" onClick={() => setFilter("Shawl")}>Shawl</a>
          <a href="#koleksi" onClick={() => setFilter("Instant")}>Instant</a>
        </nav>
        <nav aria-label="Bantuan">
          <h3>Bantuan</h3>
          <a href="#fabrik">Panduan fabrik</a>
          <a href="#penghantaran">Penghantaran</a>
          <a href="#tukar">Tukar barang</a>
        </nav>
        <nav aria-label="Syarikat">
          <h3>Syarikat</h3>
          <a href="#kisah">Kisah kami</a>
          <a href="mailto:hello@seraya.my">Hubungi</a>
        </nav>
        <p className="footer-end">© 2026 Seraya · <a href="#privasi">Privasi</a></p>
      </footer>

      {/* Mobile menu */}
      <div className={`sheet sheet-left${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="sheet-head">
          <Logo />
          <button type="button" className="icon-btn" aria-label="Tutup menu" onClick={() => setMenuOpen(false)}>
            <Icon d={ICON.close} />
          </button>
        </div>
        <nav className="sheet-links" aria-label="Menu telefon">
          {(["Bawal", "Shawl", "Instant"] as const).map((c) => (
            <a key={c} href="#koleksi" onClick={() => { setFilter(c); setMenuOpen(false); }}>{c}</a>
          ))}
          <a href="#kisah" onClick={() => setMenuOpen(false)}>Kisah kami</a>
          <a href="#fabrik" onClick={() => setMenuOpen(false)}>Fabrik</a>
        </nav>
      </div>

      {/* Cart drawer */}
      <div className={`sheet sheet-right${cartOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Beg anda" aria-hidden={!cartOpen} inert={!cartOpen}>
        <div className="sheet-head">
          <h2 className="sheet-title">Beg anda ({count})</h2>
          <button type="button" className="icon-btn" aria-label="Tutup beg" onClick={() => setCartOpen(false)}>
            <Icon d={ICON.close} />
          </button>
        </div>
        {count === 0 ? (
          <p className="cart-empty">Beg masih kosong. Pilih satu warna dulu.</p>
        ) : (
          <ul className="cart-list">
            {Object.entries(cart).map(([id, q]) => {
              const p = byId(id);
              return (
                <li key={id} className="cart-item">
                  <span className="cart-thumb">
                    <Image src={p.img} alt="" fill sizes="80px" />
                  </span>
                  <span className="cart-info">
                    <strong>{p.name}</strong>
                    <span>{p.colour} · RM{p.price}</span>
                    <span className="qty">
                      <button type="button" onClick={() => remove(id)} aria-label={`Kurangkan ${p.name}`}>−</button>
                      <span aria-live="polite">{q}</span>
                      <button type="button" onClick={() => add(id)} aria-label={`Tambah ${p.name}`}>+</button>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="cart-foot">
          <p className="cart-sub">
            <span>Jumlah kecil</span>
            <strong>RM{subtotal}</strong>
          </p>
          <p className="cart-ship">
            {subtotal >= 150 ? "Pesanan ini dapat pos percuma." : `Tambah RM${150 - subtotal} lagi untuk dapat pos percuma.`}
          </p>
          <a className="btn btn-accent btn-block" href="#checkout">Teruskan ke pembayaran</a>
        </div>
      </div>
      <div className={`scrim${cartOpen || menuOpen ? " is-open" : ""}`} onClick={() => { setCartOpen(false); setMenuOpen(false); }} aria-hidden="true" />
    </div>
  );
}
