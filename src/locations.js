const locations = [
    { 
      latitude: 20.6532215, 
      longitude: -100.4040249, 
      title: 'Entrada principal', 
      description: 'Acceso principal UTEQ',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso principal para estudiantes y visitantes',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.653641, 
      longitude: -100.403734, 
      title: 'Entrada Norte', 
      description: 'Acceso peatonal norte del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso peatonal. Horario: 6:00 AM - 10:00 PM',
      contact: 'Vigilancia: ext. 1001'
    },
    { //[20.654754, -100.405005]
      latitude: 20.654754,
      longitude: -100.405005,
      title: 'Cafetería UTEQ',
      description: 'Zona de alimentos dentro del campus',
      image: 'https://www.uteq.edu.mx/images/comedor.jpg', // puedes cambiarla si tienes una mejor opción
      details: 'Cafetería estudiantil. Horario: 7:00 AM - 8:00 PM',
      contact: 'Administración campus: ext. 1010'
    },
    { 
      latitude: 20.653340, 
      longitude: -100.405064, 
      title: 'Entrada Este', 
      description: 'Acceso peatonal este del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso peatonal. Horario: 6:00 AM - 10:00 PM',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.653506, 
      longitude: -100.406118, 
      title: 'Entrada Sureste', 
      description: 'Acceso peatonal sureste del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso peatonal. Horario: 6:00 AM - 10:00 PM',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.653676, 
      longitude: -100.407223, 
      title: 'Entrada Sur', 
      description: 'Acceso peatonal sur del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso peatonal. Horario: 6:00 AM - 10:00 PM',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.655536, 
      longitude: -100.406992, 
      title: 'Entrada Central', 
      description: 'Acceso central del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso vehicular y peatonal. Horario: 24 horas',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.656298, 
      longitude: -100.403203, 
      title: 'Entrada Noreste', 
      description: 'Acceso noreste del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso peatonal. Horario: 6:00 AM - 10:00 PM',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.656935, 
      longitude: -100.403092, 
      title: 'Entrada Norte Superior', 
      description: 'Acceso norte superior del campus',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Acceso peatonal. Horario: 6:00 AM - 10:00 PM',
      contact: 'Vigilancia: ext. 1001'
    },
    { 
      latitude: 20.653954,
      longitude: -100.404525,
      title: 'Laboratorio de procesos industriales',
      description: 'Laboratorio especializado',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Prácticas y desarrollo de procesos industriales',
      contact: 'Tel: ext. 4003'
    },
    { 
      latitude: 20.6538499, 
      longitude: -100.4039148, 
      title: 'Laboratorio de mantenimiento industrial', 
      description: 'Laboratorio especializado',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Prácticas de mantenimiento industrial',
      contact: 'Tel: ext. 2002'
    },
    { 
      latitude: 20.6543228, 
      longitude: -100.4046271, 
      title: 'Edificio DTAI', 
      description: 'División de Tecnologías de Automatización e Información',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Carreras: Ing. en Sistemas, Mecatrónica, TIC',
      contact: 'Tel: (442) 274-9000 ext. 2001'
    },
    {
      "latitude": 20.654917,
      "longitude": -100.404439,
      "title": "Laboratorio de Sistemas Informáticos",
      "description": "Espacio académico especializado en tecnologías de la información",
      "image": "https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp",
      "details": "Áreas: Desarrollo de software, redes, bases de datos",
      "contact": "Tel: (442) 274-9000 ext. 2002"
    },
    { 
      latitude: 20.6541214, 
      longitude: -100.4041198, 
      title: 'Módulo Sanitario 1', 
      description: 'Servicios sanitarios',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Disponible 24/7',
      contact: 'Mantenimiento: ext. 1050'
    },
    { 
      latitude: 20.6543096, 
      longitude: -100.4054418, 
      title: 'Rectoría', 
      description: 'Tramites institucionales',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Horario: Lunes a Viernes 8:00 AM - 4:00 PM',
      contact: 'Tel: (442) 274-9000 ext. 1000'
    },
    { 
      latitude: 20.6540485, 
      longitude: -100.4060981, 
      title: 'Vinculación escolar', 
      description: 'Inscripciones, becas, etc.',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Servicios: Inscripciones, Becas, Titulación',
      contact: 'Tel: (442) 274-9000 ext. 1200'
    },
    { 
      latitude: 20.6549875, 
      longitude: -100.4062969, 
      title: 'Edificio De Medios', 
      description: 'División Idiomas',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Idiomas: Inglés, Francés, Alemán',
      contact: 'Tel: (442) 274-9000 ext. 3001'
    },
    { 
      latitude: 20.6544725, 
      longitude: -100.4041274, 
      title: 'División Industrial', 
      description: 'Edificio F',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Carreras: Ing. Industrial, Procesos Industriales',
      contact: 'Tel: (442) 274-9000 ext. 4001'
    },
    { // [20.655357, -100.404595]
      latitude: 20.655357,
      longitude: -100.404595,
      title: 'División de Tecnología Ambiental',
      description: 'Área académica dedicada a tecnologías sustentables',
      image: 'https://www.uteq.edu.mx/images/ambiental.jpg', // Sugerencia ilustrativa, puedes cambiarla por una imagen oficial
      details: 'Instalaciones académicas. Horario: 8:00 AM - 7:00 PM',
      contact: 'Coordinación académica: ext. 1025'
    },
    { 
      latitude: 20.653774,
      longitude: -100.405160,
      title: 'División Económica-Administrativa',
      description: 'División de carreras administrativas y económicas',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Carreras: Administración, Contabilidad, Negocios',
      contact: 'Tel: ext. 5000'
    },
    { 
      latitude: 20.654914,
      longitude: -100.403825,
      title: 'Biblioteca UTEQ',
      description: 'Biblioteca central universitaria',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Horario: Lunes a Viernes 8:00 AM - 8:00 PM',
      contact: 'Tel: ext. 6000'
    },
    { 
      latitude: 20.655227,
      longitude: -100.405485,
      title: 'Laboratorios de mecatrónica y TICs',
      description: 'Laboratorios especializados',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Prácticas de mecatrónica y tecnologías de información',
      contact: 'Tel: ext. 2003'
    },
    { 
      latitude: 20.655563,
      longitude: -100.403884,
      title: 'Edificio DEA G',
      description: 'Edificio de la División Económica Administrativa',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Aulas y oficinas administrativas',
      contact: 'Tel: ext. 5001'
    },
    { 
      latitude: 20.656080,
      longitude: -100.403857,
      title: 'Almacén general y taller de mantenimiento',
      description: 'Área de mantenimiento y almacenamiento',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Horario: Lunes a Viernes 7:00 AM - 3:00 PM',
      contact: 'Tel: ext. 1100'
    },
    { 
      latitude: 20.656449,
      longitude: -100.405512,
      title: 'Cancha de Basquetbol',
      description: 'Área deportiva',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Horario: 7:00 AM - 8:00 PM',
      contact: 'Deportes: ext. 8001'
    },
    { 
      latitude: 20.657298,
      longitude: -100.403444,
      title: 'CEPRODI 4.0',
      description: 'Centro de Productividad e Innovación para la Industria 4.0',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Centro especializado en tecnologías de Industria 4.0',
      contact: 'Tel: ext. 7000'
    },
    { 
      latitude: 20.657857,
      longitude: -100.403495,
      title: 'Edificio PIDET',
      description: 'Posgrado, Innovación, Desarrollo y Emprendimiento Tecnológico',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Posgrados y desarrollo tecnológico',
      contact: 'Tel: ext. 7100'
    },
    { 
      latitude: 20.657509,
      longitude: -100.403452,
      title: 'CIC 4.0 UTEQ',
      description: 'Creativity and Innovation Center 4.0',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Centro de creatividad e innovación',
      contact: 'Tel: ext. 7200'
    },
    { 
      latitude: 20.6549875, 
      longitude: -100.4062969, 
      title: 'Edificio de Medios (División Idiomas)',
      description: 'Espacio académico dedicado a lenguas extranjeras y medios digitales',
      image: 'https://www.uteq.edu.mx/images/idiomas.jpg', // Puedes sustituirla por una imagen oficial más representativa
      details: 'Aulas multimedia e idiomas. Horario: 7:30 AM - 7:00 PM',
      contact: 'Coordinación de idiomas: ext. 1030'
    },
    { // [20.656181, -100.404196]
      latitude: 20.656181,
      longitude: -100.404196,
      title: 'Módulo Sanitario 2',
      description: 'Baños disponibles para uso estudiantil y docente',
      image: 'https://www.uteq.edu.mx/images/sanitario.jpg', // Imagen sugerida, puedes ajustarla si tienes una mejor referencia visual
      details: 'Instalación sanitaria. Horario: 6:30 AM - 9:00 PM',
      contact: 'Servicios generales: ext. 1045'
    },
    { 
      latitude: 20.6557433, 
      longitude: -100.4048658, 
      title: 'Edificio de Nanotecnología', 
      description: 'Edificio H',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Laboratorios especializados en nanotecnología',
      contact: 'Tel: (442) 274-9000 ext. 6001'
    },
    { 
      latitude: 20.6560881, 
      longitude: -100.4060255, 
      title: 'Auditorio UTEQ',
      description: 'Eventos y conferencias',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Capacidad: 500 personas. Eventos académicos y culturales',
      contact: 'Reservaciones: ext. 7001'
    },
    { 
      latitude: 20.656819, 
      longitude: -100.405527, 
      title: 'Cancha de futbol rápido', 
      description: 'Área deportiva',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Horario: 7:00 AM - 8:00 PM',
      contact: 'Deportes: ext. 8002'
    },
    { 
      latitude: 20.657146, 
      longitude: -100.405382, 
      title: 'Cancha de futbol UTEQ', 
      description: 'Campo de futbol principal',
      image: 'https://oem.com.mx/diariodequeretaro/img/18759784/1624017791/BASE_LANDSCAPE/480/image.webp',
      details: 'Campo reglamentario',
      contact: 'Deportes: ext. 8003'
    }
  ];
  
  export default locations;