const clubLogos = [
    {
        name: 'Club 01',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg/3840px-Escudo_del_Club_Atl%C3%A9tico_Independiente.svg.png'
    },
    {
        name: 'Club 02',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boca_Juniors_logo18.svg/1920px-Boca_Juniors_logo18.svg.png'
    },
    {
        name: 'Club 03',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Club_Atl%C3%A9tico_River_Plate_logo.svg/1280px-Club_Atl%C3%A9tico_River_Plate_logo.svg.png'
    },
    {
        name: 'Club 04',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Escudo-club-atletico-penarol.png'
    },
    {
        name: 'Club 05',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/1920px-Escudo_de_Racing_Club_%282014%29.svg.png'
    },
    {
        name: 'Club 06',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Club_Nacional_de_Football%27s_logo.png'
    },
    {
        name: 'Club 07',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.png'
    },
    {
        name: 'Club 08',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg/1920px-Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg.png'
    },
    {
        name: 'Club 09',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/RosarioCentral.png'
    },
    {
        name: 'Club 10',
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Escudo_Newells.png'
    },
    {
        name: 'Club 11',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg/500px-Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg.png'
    },
    {
        name: 'Club 12',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Escudo_Oficial_del_Club_Atl%C3%A9tico_Belgrano.png'
    },
    {
        name: 'Club 13',
        image: 'https://deportivomoron.com.ar/wp-content/uploads/2025/05/Club-Deportivo-Moron-Escudo-oficial-HD.png'
    },
    {
        name: 'Club 14',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg/3840px-Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg.png'
    },
    {
        name: 'Club 15',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Escudo_del_Club_Almirante_Brown.svg/1920px-Escudo_del_Club_Almirante_Brown.svg.png'
    },
    {
        name: 'Club 16',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escudo_del_Club_Atl%C3%A9tico_Nueva_Chicago.svg/500px-Escudo_del_Club_Atl%C3%A9tico_Nueva_Chicago.svg.png'
    }
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
