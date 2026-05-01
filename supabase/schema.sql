-- ============================================================
-- TABLA PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
    id                      BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    estadio                 TEXT NOT NULL,
    club                    TEXT NOT NULL,
    escala                  TEXT NOT NULL DEFAULT '1:500',
    precio                  INTEGER NOT NULL DEFAULT 0,
    stock                   INTEGER NOT NULL DEFAULT 0,
    edicion                 TEXT NOT NULL DEFAULT '',
    material                TEXT NOT NULL DEFAULT '',
    descripcion             TEXT NOT NULL DEFAULT '',
    imagen                  TEXT NOT NULL DEFAULT '',
    galeria                 JSONB NOT NULL DEFAULT '[]',
    medidas                 JSONB DEFAULT NULL,
    destacado               BOOLEAN NOT NULL DEFAULT false,
    referencia_personalizada BOOLEAN NOT NULL DEFAULT false,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer
CREATE POLICY "lectura_publica" ON productos
    FOR SELECT TO anon, authenticated USING (true);

-- Solo autenticados pueden escribir
CREATE POLICY "escritura_autenticada" ON productos
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "actualizacion_autenticada" ON productos
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "eliminacion_autenticada" ON productos
    FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SEED DATA — 26 productos
-- ============================================================
INSERT INTO productos (estadio, club, escala, precio, stock, edicion, material, descripcion, imagen, galeria, destacado, referencia_personalizada) VALUES

('La Bombonera', 'Boca Juniors', '1:500', 189000, 7, 'Edicion Club', 'Resina + base acrilica',
 'Una pieza con volumenes marcados, tribunas iconicas y terminacion ideal.',
 'assets/img/products/boca-juniors/la-bombonera/cover.webp',
 '["assets/img/products/boca-juniors/la-bombonera/cover.webp","assets/img/products/boca-juniors/la-bombonera/gallery-01.webp","assets/img/products/boca-juniors/la-bombonera/gallery-02.webp","assets/img/products/boca-juniors/la-bombonera/gallery-03.webp","assets/img/products/boca-juniors/la-bombonera/gallery-04.webp","assets/img/products/boca-juniors/la-bombonera/gallery-05.webp","assets/img/products/boca-juniors/la-bombonera/gallery-06.webp","assets/img/products/boca-juniors/la-bombonera/gallery-07.webp","assets/img/products/boca-juniors/la-bombonera/gallery-08.webp","assets/img/products/boca-juniors/la-bombonera/gallery-09.webp","assets/img/products/boca-juniors/la-bombonera/gallery-10.webp"]',
 false, false),

('Mas Monumental', 'River Plate', '1:600', 205000, 5, 'Serie Arquitectura', 'Polimero tecnico',
 'Modelo pensado para destacar sobre cualquier otro estadio del mundo.',
 'assets/img/products/river-plate/mas-monumental/cover.png',
 '["assets/img/products/river-plate/mas-monumental/cover.png","assets/img/products/river-plate/mas-monumental/gallery-01.jpg","assets/img/products/river-plate/mas-monumental/gallery-02.jpg","assets/img/products/river-plate/mas-monumental/gallery-03.jpg","assets/img/products/river-plate/mas-monumental/gallery-04.jpg","assets/img/products/river-plate/mas-monumental/gallery-05.jpg"]',
 false, false),

('El Cilindro', 'Racing Club', '1:550', 176000, 6, 'Hincha Edition', 'Resina microtexturada',
 'Una maqueta pensada para resaltar la forma del estadio y su identidad inconfundible.',
 'assets/img/products/racing-club/el-cilindro/cover.webp',
 '["assets/img/products/racing-club/el-cilindro/cover.jpg","assets/img/products/racing-club/el-cilindro/gallery-01.jpg","assets/img/products/racing-club/el-cilindro/gallery-02.jpg","assets/img/products/racing-club/el-cilindro/gallery-03.jpg","assets/img/products/racing-club/el-cilindro/gallery-04.jpg","assets/img/products/racing-club/el-cilindro/gallery-05.jpg","assets/img/products/racing-club/el-cilindro/gallery-06.jpg","assets/img/products/racing-club/el-cilindro/gallery-07.jpg","assets/img/products/racing-club/el-cilindro/gallery-08.jpg","assets/img/products/racing-club/el-cilindro/gallery-09.jpg"]',
 true, false),

('Libertadores de America', 'Independiente', '1:500', 181000, 4, 'Rojo Legendario', 'Composito premium',
 'Una pieza sobria y potente, con detalles de gran calidad.',
 'assets/img/products/independiente/libertadores-de-america/cover.webp',
 '["assets/img/products/independiente/libertadores-de-america/cover.webp","assets/img/products/independiente/libertadores-de-america/gallery-01.webp","assets/img/products/independiente/libertadores-de-america/gallery-02.webp","assets/img/products/independiente/libertadores-de-america/gallery-03.webp","assets/img/products/independiente/libertadores-de-america/gallery-04.webp","assets/img/products/independiente/libertadores-de-america/gallery-05.webp","assets/img/products/independiente/libertadores-de-america/gallery-06.webp","assets/img/products/independiente/libertadores-de-america/gallery-07.webp"]',
 false, false),

('Campeon del Siglo', 'Penarol', '1:600', 214000, 3, 'Matchday Edition', 'Poliresina pintada a mano',
 'Detalles de fachada, estructura y plateas en una pieza compacta para colecciones con caracter.',
 'assets/img/products/penarol/campeon-del-siglo/cover.webp',
 '["assets/img/products/penarol/campeon-del-siglo/cover.webp","assets/img/products/penarol/campeon-del-siglo/gallery-01.webp","assets/img/products/penarol/campeon-del-siglo/gallery-02.webp","assets/img/products/penarol/campeon-del-siglo/gallery-03.webp","assets/img/products/penarol/campeon-del-siglo/gallery-04.webp","assets/img/products/penarol/campeon-del-siglo/gallery-05.webp","assets/img/products/penarol/campeon-del-siglo/gallery-06.webp","assets/img/products/penarol/campeon-del-siglo/gallery-07.webp","assets/img/products/penarol/campeon-del-siglo/gallery-08.webp","assets/img/products/penarol/campeon-del-siglo/gallery-09.webp"]',
 false, false),

('Nuevo Francisco Urbano', 'Deportivo Moron', '1:600', 198000, 8, 'Sudamericana', 'Resina satinada',
 'Version premium del estadio de Moron, con foco en sus tribunas, fachada y lectura general del volumen.',
 'assets/img/products/deportivo-moron/nuevo-francisco-urbano/cover.webp',
 '["assets/img/products/deportivo-moron/nuevo-francisco-urbano/cover.webp","assets/img/products/deportivo-moron/nuevo-francisco-urbano/gallery-01.webp","assets/img/products/deportivo-moron/nuevo-francisco-urbano/gallery-02.webp","assets/img/products/deportivo-moron/nuevo-francisco-urbano/gallery-03.webp","assets/img/products/deportivo-moron/nuevo-francisco-urbano/gallery-04.webp","assets/img/products/deportivo-moron/nuevo-francisco-urbano/gallery-05.webp"]',
 false, false),

('Julio Cesar Villagra', 'Belgrano de Cordoba', '1:650', 224000, 5, 'Iconos Del Mundo', 'Polimero tecnico',
 'Una pieza pensada para destacar al Gigante de Alberdi con gran presencia visual y lectura de tribunas.',
 'assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/cover.webp',
 '["assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/cover.webp","assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/gallery-01.webp","assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/gallery-02.webp","assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/gallery-03.webp","assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/gallery-04.webp","assets/img/products/belgrano-de-cordoba/julio-cesar-villagra/gallery-05.webp"]',
 false, false),

('Viejo Gasometro', 'San Lorenzo', '1:600', 191000, 6, 'Edicion Clasica', 'Resina microtexturada',
 'Modelo de lineas limpias con estructura contemporanea y base lista para exhibicion.',
 'assets/img/products/san-lorenzo/viejo-gasometro/cover.webp',
 '["assets/img/products/san-lorenzo/viejo-gasometro/cover.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-01.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-02.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-03.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-04.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-05.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-06.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-07.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-08.webp","assets/img/products/san-lorenzo/viejo-gasometro/gallery-09.webp"]',
 false, false),

('Frag. Pte. Sarmiento', 'Almirante Brown', '1:620', 186000, 9, 'Coleccion Brasil', 'Composito premium',
 'Ideal para sumar una pieza con identidad barrial y una lectura muy marcada de sus tribunas.',
 'assets/img/products/almirante-brown/frag-pte-sarmiento/cover.webp',
 '["assets/img/products/almirante-brown/frag-pte-sarmiento/cover.webp","assets/img/products/almirante-brown/frag-pte-sarmiento/gallery-01.webp","assets/img/products/almirante-brown/frag-pte-sarmiento/gallery-02.webp","assets/img/products/almirante-brown/frag-pte-sarmiento/gallery-03.webp","assets/img/products/almirante-brown/frag-pte-sarmiento/gallery-04.webp","assets/img/products/almirante-brown/frag-pte-sarmiento/gallery-05.webp"]',
 false, false),

('Tomas Adolfo Duco', 'Huracan', '1:610', 209000, 4, 'Edicion Estreno', 'Resina + base negra',
 'Una maqueta del Palacio Duco con gran impacto visual y terminacion de alto contraste.',
 'assets/img/products/huracan/tomas-adolfo-duco/cover.webp',
 '["assets/img/products/huracan/tomas-adolfo-duco/cover.webp","assets/img/products/huracan/tomas-adolfo-duco/gallery-01.webp","assets/img/products/huracan/tomas-adolfo-duco/gallery-02.webp","assets/img/products/huracan/tomas-adolfo-duco/gallery-03.webp","assets/img/products/huracan/tomas-adolfo-duco/gallery-04.webp"]',
 false, false),

('Eva Peron', 'Sarmiento', '1:630', 179000, 7, 'Clasicos De America', 'Poliresina',
 'Pieza sobria y elegante pensada para destacar historia, escala y volumen estructural.',
 'assets/img/products/sarmiento-de-junin/eva-peron/cover.jpg',
 '["assets/img/products/sarmiento-de-junin/eva-peron/cover.jpg","assets/img/products/sarmiento-de-junin/eva-peron/gallery-01.jpg","assets/img/products/sarmiento-de-junin/eva-peron/gallery-02.jpg","assets/img/products/sarmiento-de-junin/eva-peron/gallery-03.jpg","assets/img/products/sarmiento-de-junin/eva-peron/gallery-04.jpg"]',
 false, false),

('Republica de Mataderos', 'Nueva Chicago', '1:640', 195000, 5, 'Serie Continental', 'Resina con acabado mate',
 'Pensado para colecciones amplias, con base firme y una lectura clara del estadio de Mataderos.',
 'assets/img/products/nueva-chicago/republica-de-mataderos/cover.webp',
 '["assets/img/products/nueva-chicago/republica-de-mataderos/cover.webp","assets/img/products/nueva-chicago/republica-de-mataderos/gallery-01.webp","assets/img/products/nueva-chicago/republica-de-mataderos/gallery-02.webp","assets/img/products/nueva-chicago/republica-de-mataderos/gallery-03.webp"]',
 false, false),

('Diego Maradona', 'Argentinos Juniors', '1:620', 188000, 6, 'Historia Sudamericana', 'Resina de alta definicion',
 'Una referencia historica llevada a maqueta con foco en proporciones y lectura arquitectonica.',
 'assets/img/products/argentinos-juniors/diego-maradona/cover.webp',
 '["assets/img/products/argentinos-juniors/diego-maradona/cover.webp","assets/img/products/argentinos-juniors/diego-maradona/gallery-01.webp","assets/img/products/argentinos-juniors/diego-maradona/gallery-02.webp","assets/img/products/argentinos-juniors/diego-maradona/gallery-03.webp","assets/img/products/argentinos-juniors/diego-maradona/gallery-04.webp","assets/img/products/argentinos-juniors/diego-maradona/gallery-05.webp"]',
 false, false),

('Alfredo Beranger', 'Temperley', '1:590', 202000, 5, 'Matchday Lights', 'Composito texturado',
 'Modelo del Beranger con presencia fuerte y terminaciones listas para vitrina.',
 'assets/img/products/temperley/alfredo-beranger/cover.jpg',
 '["assets/img/products/temperley/alfredo-beranger/cover.jpg","assets/img/products/temperley/alfredo-beranger/gallery-01.jpg","assets/img/products/temperley/alfredo-beranger/gallery-02.jpg","assets/img/products/temperley/alfredo-beranger/gallery-03.jpg","assets/img/products/temperley/alfredo-beranger/gallery-04.jpg"]',
 false, false),

('Gigante de Arroyito', 'Rosario Central', '1:550', 0, 0, 'Proyecto Personalizado', 'Base premium + detalles a medida',
 'Referencia pensada para proyectos personalizados de estadios internacionales y pedidos especiales.',
 'assets/img/products/rosario-central/gigante-de-arroyito/cover.jpg',
 '["assets/img/products/rosario-central/gigante-de-arroyito/cover.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-01.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-02.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-03.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-04.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-05.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-06.jpg","assets/img/products/rosario-central/gigante-de-arroyito/gallery-07.jpg"]',
 false, true),

('Olimpico de Tokio', 'Seleccion de Japon', '1:550', 0, 0, 'Proyecto Personalizado', 'Base premium',
 'Replica a escala del iconico estadio olimpico, disenada para capturar su estructura arquitectonica unica.',
 'assets/img/products/seleccion-de-japon/olimpico-de-tokio/cover.jpg',
 '["assets/img/products/seleccion-de-japon/olimpico-de-tokio/cover.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-01.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-02.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-03.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-04.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-05.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-06.jpg","assets/img/products/seleccion-de-japon/olimpico-de-tokio/gallery-07.jpg"]',
 false, true),

('Ciudad de Caseros', 'Est. de Caseros', '1:550', 0, 0, 'Clasicos', 'Base premium',
 'Referencia para el estadio del Pincha de Caseros, enfocada en los detalles caracteristicos de su arquitectura local.',
 'assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/cover.webp',
 '["assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/cover.webp","assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/gallery-01.webp","assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/gallery-02.webp","assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/gallery-03.webp","assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/gallery-04.webp","assets/img/products/estudiantes-de-caseros/ciudad-de-caseros/gallery-05.webp"]',
 false, true),

('Estadio Monumental', 'River Plate', '1:600', 199000, 4, 'Edicion Clasica', 'Polimero tecnico',
 'Version del Monumental anterior a la remodelacion, con foco en su silueta historica y lectura original de tribunas.',
 'assets/img/products/river-plate/monumental/cover.jpg',
 '["assets/img/products/river-plate/monumental/cover.jpg","assets/img/products/river-plate/monumental/gallery-01.jpg","assets/img/products/river-plate/monumental/gallery-02.jpg","assets/img/products/river-plate/monumental/gallery-03.jpg","assets/img/products/river-plate/monumental/gallery-04.jpg","assets/img/products/river-plate/monumental/gallery-05.jpg"]',
 false, false),

('Jose Amalfitani', 'Velez Sarsfield', '1:580', 193000, 5, 'Tribuna Clasica', 'Resina de alta definicion',
 'Una maqueta equilibrada para resaltar la estructura del Amalfitani y su presencia inconfundible en Liniers.',
 'assets/img/products/velez-sarsfield/jose-amalfitani/cover.jpg',
 '["assets/img/products/velez-sarsfield/jose-amalfitani/cover.jpg","assets/img/products/velez-sarsfield/jose-amalfitani/gallery-01.jpg","assets/img/products/velez-sarsfield/jose-amalfitani/gallery-02.jpg","assets/img/products/velez-sarsfield/jose-amalfitani/gallery-03.jpg","assets/img/products/velez-sarsfield/jose-amalfitani/gallery-04.jpg","assets/img/products/velez-sarsfield/jose-amalfitani/gallery-05.jpg"]',
 false, false),

('Lusail Stadium', 'Qatar 2022', '1:700', 0, 0, 'Proyecto Internacional', 'Base premium',
 'Referencia internacional pensada para pedidos especiales, con foco en la geometria exterior y la escala monumental del estadio.',
 'assets/img/products/qatar/lusail-stadium/cover.jpg',
 '["assets/img/products/qatar/lusail-stadium/cover.jpg","assets/img/products/qatar/lusail-stadium/gallery-01.jpg","assets/img/products/qatar/lusail-stadium/gallery-02.jpg","assets/img/products/qatar/lusail-stadium/gallery-03.jpg","assets/img/products/qatar/lusail-stadium/gallery-04.jpg","assets/img/products/qatar/lusail-stadium/gallery-05.jpg","assets/img/products/qatar/lusail-stadium/gallery-06.jpg","assets/img/products/qatar/lusail-stadium/gallery-07.jpg","assets/img/products/qatar/lusail-stadium/gallery-08.jpg"]',
 false, true),

('Ciudad de Vicente Lopez', 'Platense', '1:610', 184000, 5, 'Barrio Edition', 'Resina satinada',
 'Modelo pensado para destacar la identidad barrial de Platense y la lectura compacta de su estadio.',
 'assets/img/products/platense/ciudad-de-vicente-lopez/cover.jpg',
 '["assets/img/products/platense/ciudad-de-vicente-lopez/cover.jpg","assets/img/products/platense/ciudad-de-vicente-lopez/gallery-01.jpg","assets/img/products/platense/ciudad-de-vicente-lopez/gallery-02.jpg","assets/img/products/platense/ciudad-de-vicente-lopez/gallery-03.jpg","assets/img/products/platense/ciudad-de-vicente-lopez/gallery-04.jpg","assets/img/products/platense/ciudad-de-vicente-lopez/gallery-05.jpg","assets/img/products/platense/ciudad-de-vicente-lopez/gallery-06.jpg"]',
 false, false),

('Florencio Sola', 'Banfield', '1:600', 187000, 5, 'Sur Edition', 'Resina microtexturada',
 'Una pieza sobria para representar al Florencio Sola con buena lectura de tribunas y fachada principal.',
 'assets/img/products/banfield/florencio-sola/cover.webp',
 '["assets/img/products/banfield/florencio-sola/cover.webp","assets/img/products/banfield/florencio-sola/gallery-01.webp","assets/img/products/banfield/florencio-sola/gallery-02.webp","assets/img/products/banfield/florencio-sola/gallery-03.webp","assets/img/products/banfield/florencio-sola/gallery-04.webp","assets/img/products/banfield/florencio-sola/gallery-05.webp","assets/img/products/banfield/florencio-sola/gallery-06.webp"]',
 false, false),

('Marcelo Bielsa', 'Newell''s Old Boys', '1:500', 195000, 0, 'Edición Especial', 'Resina de alta definición',
 'Una representación detallada del estadio Marcelo Bielsa, hogar del Club Atlético Newell''s Old Boys.',
 'assets/img/products/newells/estadio-marcelo-bielsa/cover.webp',
 '["assets/img/products/newells/estadio-marcelo-bielsa/cover.webp","assets/img/products/newells/estadio-marcelo-bielsa/gallery-01.webp","assets/img/products/newells/estadio-marcelo-bielsa/gallery-02.webp","assets/img/products/newells/estadio-marcelo-bielsa/gallery-03.webp","assets/img/products/newells/estadio-marcelo-bielsa/gallery-04.webp","assets/img/products/newells/estadio-marcelo-bielsa/gallery-05.webp"]',
 false, false),

('Nuevo Gasometro', 'San Lorenzo', '1:500', 200000, 0, 'Edición Especial', 'Resina de alta definición',
 'Una representación detallada del estadio Nuevo Gasómetro, hogar del Club San Lorenzo.',
 'assets/img/products/san-lorenzo/nuevo-gasometro/cover.jpg',
 '["assets/img/products/san-lorenzo/nuevo-gasometro/cover.jpg","assets/img/products/san-lorenzo/nuevo-gasometro/gallery-01.jpg","assets/img/products/san-lorenzo/nuevo-gasometro/gallery-02.jpg","assets/img/products/san-lorenzo/nuevo-gasometro/gallery-03.jpg","assets/img/products/san-lorenzo/nuevo-gasometro/gallery-04.jpg","assets/img/products/san-lorenzo/nuevo-gasometro/gallery-05.jpg"]',
 false, false),

('Estadio Chacarita Juniors', 'Chacarita', '1:500', 210000, 0, 'Edición Mini', 'Resina de alta definición',
 'Una representación a mini escala del estadio de Chacarita Jrs, hogar del Club Chacarita Juniors.',
 'assets/img/products/chacarita/estadio-chacarita-juniors/cover.webp',
 '["assets/img/products/chacarita/estadio-chacarita-juniors/cover.webp","assets/img/products/chacarita/estadio-chacarita-juniors/gallery-01.webp","assets/img/products/chacarita/estadio-chacarita-juniors/gallery-02.webp","assets/img/products/chacarita/estadio-chacarita-juniors/gallery-03.webp","assets/img/products/chacarita/estadio-chacarita-juniors/gallery-04.webp","assets/img/products/chacarita/estadio-chacarita-juniors/gallery-05.webp"]',
 false, false),

('José Dellagiovanna', 'Tigre', '1:500', 220000, 0, 'Edición Especial', 'Resina de alta definición',
 'Una representación detallada del estadio José Dellagiovanna, hogar del Club Atlético Tigre.',
 'assets/img/products/tigre/estadio-tigre/cover.jpg',
 '["assets/img/products/tigre/estadio-tigre/cover.jpg","assets/img/products/tigre/estadio-tigre/gallery-01.jpg","assets/img/products/tigre/estadio-tigre/gallery-02.jpg","assets/img/products/tigre/estadio-tigre/gallery-03.jpg","assets/img/products/tigre/estadio-tigre/gallery-04.jpg","assets/img/products/tigre/estadio-tigre/gallery-05.jpg"]',
 false, false);
