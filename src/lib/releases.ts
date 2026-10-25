export const releases = [
  {
    slug: "pakosten-spevy-smutnych-lotrov",
    artist: "Pakosteň",
    title: "Spevy smutných Lotrov",
    image: "/releases/pakosten-spevy.jpg",
    year: 2026,
    format: "lp-cassette",
    catalog: "SLC011",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=1430392667/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "remdik-potkany-patria-do-diery",
    artist: "Remdik",
    title: "Potkany Patria Do Diery",
    image: "/releases/remdik.jpg",
    year: 2026,
    format: "cassette",
    catalog: "SLC012",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=3264551839/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "tschechen-sweine",
    artist: "Pakosteň / Otras / Bahratal / Chevallier Skrog",
    title: "Tschechen Sweine",
    image: "/releases/tschechen-sweine.jpg",
    year: 2026,
    format: "cassette",
    catalog: "SLC010",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=2579537489/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "tryzna-kult-falesneho-mucednictvi",
    artist: "tryzna",
    title: "kult falešného mučednictví",
    image: "/releases/tryzna.jpg",
    year: 2023,
    format: "cassette",
    catalog: "SLC009",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=2945674153/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "otras-pakosten-split",
    artist: "Otras / Pakosteň",
    title: "split",
    image: "/releases/otras-pakosten.jpg",
    year: 2022,
    format: "cassette",
    catalog: "SLC007",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=1389637829/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "endform-kronstadt",
    artist: "Endform / Kronstadt",
    title: "split",
    image: "/releases/endform-kronstadt.jpg",
    year: 2022,
    format: "seven",
    catalog: "SLC006",
    labels: "Šlinc Records, KeepHope, Sick & Twisted, Dure Réalité, DIY Factory, Cult Of The Bear, Counteract",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=3853972423/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "pakosten-zivy-bic",
    artist: "Pakosteň",
    title: "Živý Bič",
    image: "/releases/pakosten-bic.jpg",
    year: 2021,
    years: "2021 / 2022",
    format: "cassette-lathe",
    catalog: "SLC004 / SLC005",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=837911514/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "lakka-samorast",
    artist: "Lakka / Samorast",
    title: "split",
    image: "/releases/lakka.jpg",
    year: 2021,
    format: "lp-split",
    catalog: "SLC003",
    labels: "Salto Mortale Music, Šlinc Records, Animator Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=2616614003/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "plesata-zpevacka-vlasy-dievcat",
    artist: "Plešatá Zpěvačka",
    title: "Vlasy Dievčat",
    image: "/releases/plesata.jpg",
    year: 2020,
    format: "lp",
    catalog: "SLC002",
    labels: "Silver Rocket, Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=1887702760/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
  {
    slug: "hydrauliter",
    artist: "Hydrauliter",
    title: "s/t",
    image: "/releases/hydra.jpg",
    year: 2019,
    format: "lp",
    catalog: "SLC001",
    labels: "Šlinc Records",
    bandcamp:
      "https://bandcamp.com/EmbeddedPlayer/album=4080169152/size=small/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/transparent=true/",
  },
] as const;

export function catalogNumber(catalog: string) {
  const match = catalog.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function latestReleases(limit?: number) {
  const ordered = [...releases].sort(
    (a, b) => catalogNumber(b.catalog) - catalogNumber(a.catalog),
  );
  return limit ? ordered.slice(0, limit) : ordered;
}
