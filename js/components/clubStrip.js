const clubLogos = [
    { name: 'Independiente',      image: 'assets/img/clubs/independiente.webp' },
    { name: 'Boca Juniors',       image: 'assets/img/clubs/boca.webp' },
    { name: 'River Plate',        image: 'assets/img/clubs/river.webp' },
    { name: 'Peñarol',            image: 'assets/img/clubs/penarol.webp' },
    { name: 'Racing Club',        image: 'assets/img/clubs/racing.webp' },
    { name: 'Nacional',           image: 'assets/img/clubs/nacional.webp' },
    { name: 'San Lorenzo',        image: 'assets/img/clubs/sanlorenzo.webp' },
    { name: 'Vélez Sársfield',    image: 'assets/img/clubs/velez.webp' },
    { name: 'Rosario Central',    image: 'assets/img/clubs/rosariocentral.webp' },
    { name: "Newell's Old Boys",  image: 'assets/img/clubs/newells.webp' },
    { name: 'Huracán',            image: 'assets/img/clubs/huracan.svg' },
    { name: 'Belgrano',           image: 'assets/img/clubs/belgrano.webp' },
    { name: 'Deportivo Morón',    image: 'assets/img/clubs/moron.webp' },
    { name: 'Argentinos Juniors', image: 'assets/img/clubs/argentinos.webp' },
    { name: 'Almirante Brown',    image: 'assets/img/clubs/almirante.webp' },
    { name: 'Nueva Chicago',      image: 'assets/img/clubs/nuevachicago.webp' },
];

const createLogoItems = (logos) => logos.map((club) => `
    <article class="club-strip__item" aria-label="${club.name}">
        <img src="${club.image}" alt="${club.name}" loading="lazy" decoding="async">
    </article>
`).join('');

export const createClubStrip = () => {
    const section = document.createElement('section');
    section.className = 'club-strip';
    section.id = 'club-strip';

    section.innerHTML = `
        <div class="club-strip__shell">
            <p class="club-strip__eyebrow">Clubes y referencias</p>
            <h2>Trabajamos inspirados en estadios y escudos de todo el futbol</h2>
            <div class="club-strip__marquee">
                <div class="club-strip__track">
                    ${createLogoItems(clubLogos)}
                    ${createLogoItems(clubLogos)}
                </div>
            </div>
        </div>
    `;

    return section;
};
