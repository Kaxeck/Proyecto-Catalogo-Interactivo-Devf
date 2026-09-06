const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');

dotenv.config();

const initialProducts = [
  {
    nombre: "Silla Caoba",
    categoria: "Sillas",
    precioOriginal: 520,
    precioDescuento: 250,
    imagen: "/img/Silla Caoba.png",
    isOfertaPlus: true,
    descripcion: "Silla ergonómica fabricada en fina madera de caoba seleccionada, tratada con barniz ecológico mate que realza las vetas naturales. Su diseño nórdico ofrece soporte lumbar ideal y un toque cálido para comedores o salas de estar.",
    dimensiones: "85 cm (Alto) x 48 cm (Ancho) x 52 cm (Profundidad)",
    materiales: "Madera de Caoba 100% maciza, acabado mate no tóxico",
    garantia: "3 años de garantía directa de fábrica",
    stock: 14,
    rating: 4.9,
    opinionesCount: 28
  },
  {
    nombre: "Mesa Comedor",
    categoria: "Comedores",
    precioOriginal: 450,
    precioDescuento: 350,
    imagen: "/img/Mesa Comedor.png",
    isOfertaPlus: true,
    descripcion: "Mesa de comedor rectangular de inspiración escandinava. Estructura robusta y ensambles reforzados diseñados para compartir en familia. Capacidad cómoda para 6 a 8 comensales.",
    dimensiones: "76 cm (Alto) x 160 cm (Largo) x 90 cm (Ancho)",
    materiales: "Madera de pino nórdico tratada y tablero chapeado de roble",
    garantia: "5 años de garantía estructural",
    stock: 8,
    rating: 4.8,
    opinionesCount: 34
  },
  {
    nombre: "Sofa Moderno",
    categoria: "Salas",
    precioOriginal: 800,
    precioDescuento: 600,
    imagen: "/img/Sofa Moderno.png",
    isOfertaPlus: true,
    descripcion: "Sofá moderno de 3 plazas tapizado en tejido de lino transpirable de alta resistencia. Acolchado de espuma de alta densidad que mantiene la forma sin perder suavidad.",
    dimensiones: "82 cm (Alto) x 210 cm (Largo) x 88 cm (Profundidad)",
    materiales: "Estructura interna de eucalipto seco, tapiz de lino antimanchas",
    garantia: "3 años de garantía en estructura y tapizado",
    stock: 5,
    rating: 5.0,
    opinionesCount: 42
  },
  {
    nombre: "Libreria Sencilla",
    categoria: "Estanterías",
    precioOriginal: 800,
    precioDescuento: 600,
    imagen: "/img/Libreria Sencilla.png",
    isOfertaPlus: true,
    descripcion: "Librería de líneas puras y diseño vertical para aprovechar el espacio. Cuenta con 5 estantes espaciosos para libros, plantas y objetos decorativos.",
    dimensiones: "180 cm (Alto) x 80 cm (Ancho) x 30 cm (Profundidad)",
    materiales: "MDF de alta densidad con acabado melamínico veta de madera",
    garantia: "2 años de garantía",
    stock: 11,
    rating: 4.7,
    opinionesCount: 19
  },
  {
    nombre: "Mesa Cristal",
    categoria: "Comedores",
    precioOriginal: 330,
    precioDescuento: 240,
    imagen: "/img/Mesa Cristal.png",
    isOfertaPlus: true,
    descripcion: "Mesa de centro contemporánea con cubierta de cristal templado de 8 mm y patas estilizadas en madera clara. Aporta amplitud y ligereza visual a cualquier salón.",
    dimensiones: "45 cm (Alto) x 100 cm (Largo) x 55 cm (Ancho)",
    materiales: "Cristal templado de seguridad biselado y madera clara",
    garantia: "2 años de garantía",
    stock: 9,
    rating: 4.8,
    opinionesCount: 23
  },
  {
    nombre: "Cama Matrimonial",
    categoria: "Recámaras",
    precioOriginal: 1100,
    precioDescuento: 745,
    imagen: "/img/Cama Matrimonial.png",
    isOfertaPlus: true,
    descripcion: "Base y cabecera de cama matrimonial con estética minimalista y soporte silencioso libre de chirridos. Cabecero integrado con ligera inclinación ergonómica para lectura nocturna.",
    dimensiones: "100 cm (Alto) x 150 cm (Ancho) x 200 cm (Largo)",
    materiales: "Madera maciza de haya con travesaños reforzados",
    garantia: "5 años de garantía",
    stock: 6,
    rating: 4.9,
    opinionesCount: 38
  },
  {
    nombre: "Cuna de Madera",
    categoria: "Recámaras",
    precioOriginal: 560,
    precioDescuento: 460,
    imagen: "/img/Cuna de Madera.png",
    isOfertaPlus: true,
    descripcion: "Cuna infantil convertible de estilo nórdico, fabricada bajo estrictos estándares de seguridad internacional. Barrotes redondeados y pinturas a base de agua libres de plomo.",
    dimensiones: "90 cm (Alto) x 75 cm (Ancho) x 135 cm (Largo)",
    materiales: "Madera de abedul natural con pintura al agua hipoalergénica",
    garantia: "3 años de garantía",
    stock: 7,
    rating: 5.0,
    opinionesCount: 15
  },
  {
    nombre: "Mueble de TV",
    categoria: "Salas",
    precioOriginal: 950,
    precioDescuento: 820,
    imagen: "/img/Mueble de TV.png",
    isOfertaPlus: false,
    descripcion: "Mueble multimedia diseñado para pantallas de hasta 65 pulgadas. Cuenta con pasacables oculto y compartimentos con puertas corredizas ranuradas para control remoto.",
    dimensiones: "52 cm (Alto) x 160 cm (Largo) x 40 cm (Profundidad)",
    materiales: "Estructura de fresno con tiradores metálicos empotrados",
    garantia: "3 años de garantía",
    stock: 12,
    rating: 4.8,
    opinionesCount: 22
  },
  {
    nombre: "Comoda de Caoba",
    categoria: "Recámaras",
    precioOriginal: 780,
    precioDescuento: 670,
    imagen: "/img/Comoda de Caoba.png",
    isOfertaPlus: false,
    descripcion: "Cómoda de 4 cajones profundos con correderas telescópicas de cierre suave. Tono cálido en madera de caoba ideal para organizar prendas y accesorios con distinción.",
    dimensiones: "95 cm (Alto) x 90 cm (Ancho) x 45 cm (Profundidad)",
    materiales: "Madera de caoba maciza y correderas de acero",
    garantia: "4 años de garantía",
    stock: 8,
    rating: 4.9,
    opinionesCount: 17
  },
  {
    nombre: "Armario de Parota",
    categoria: "Recámaras",
    precioOriginal: 1350,
    precioDescuento: 1150,
    imagen: "/img/Armario de Parota.png",
    isOfertaPlus: false,
    descripcion: "Imponente armario de 2 puertas confeccionado en madera de parota, famosa por su durabilidad y grano espectacular. Incluye barra de colgar y repisas ajustables.",
    dimensiones: "200 cm (Alto) x 110 cm (Ancho) x 58 cm (Profundidad)",
    materiales: "Madera auténtica de parota con sellador natural",
    garantia: "5 años de garantía",
    stock: 4,
    rating: 5.0,
    opinionesCount: 29
  },
  {
    nombre: "Lampara de Pie",
    categoria: "Decoración",
    precioOriginal: 550,
    precioDescuento: 450,
    imagen: "/img/Lampara de Pie.png",
    isOfertaPlus: false,
    descripcion: "Lámpara de pie de trípode con pantalla cónica de tela de lino. Proporciona una iluminación difusa, cálida y acogedora ideal para rincones de lectura.",
    dimensiones: "155 cm (Alto) x 45 cm (Diámetro base)",
    materiales: "Trípode de madera maciza de nogal y pantalla de lino orgánico",
    garantia: "2 años de garantía eléctrica",
    stock: 16,
    rating: 4.7,
    opinionesCount: 25
  },
  {
    nombre: "Estanteria Mini",
    categoria: "Estanterías",
    precioOriginal: 480,
    precioDescuento: 400,
    imagen: "/img/Estanteria Minimalista.png",
    isOfertaPlus: false,
    descripcion: "Estantería compacta de 3 niveles con perfil metálico negro y baldas de madera natural. Perfecta para espacios reducidos, baños o estudios.",
    dimensiones: "90 cm (Alto) x 60 cm (Ancho) x 28 cm (Profundidad)",
    materiales: "Acero pintado al horno electrostático y madera de pino",
    garantia: "2 años de garantía",
    stock: 15,
    rating: 4.6,
    opinionesCount: 14
  },
  {
    nombre: "Cama Individual",
    categoria: "Recámaras",
    precioOriginal: 600,
    precioDescuento: 500,
    imagen: "/img/Cama Individual.png",
    isOfertaPlus: false,
    descripcion: "Cama individual juvenil de estilo nórdico. Su estructura despejada permite almacenar cajoneras debajo o mantener una sensación de amplitud en la habitación.",
    dimensiones: "85 cm (Alto) x 100 cm (Ancho) x 195 cm (Largo)",
    materiales: "Madera de pino maciza con acabado satinado natural",
    garantia: "3 años de garantía",
    stock: 10,
    rating: 4.8,
    opinionesCount: 20
  },
  {
    nombre: "Escritorio Vint",
    categoria: "Oficina",
    precioOriginal: 200,
    precioDescuento: 150,
    imagen: "/img/Escritorio Vintage.png",
    isOfertaPlus: false,
    descripcion: "Escritorio compacto para home office con cajón integrado y ranura de soporte para tablet o teléfono. Patas anguladas que aportan dinamismo visual.",
    dimensiones: "75 cm (Alto) x 105 cm (Largo) x 50 cm (Ancho)",
    materiales: "Tablero laminado anti-rayaduras y estructura de roble",
    garantia: "2 años de garantía",
    stock: 18,
    rating: 4.7,
    opinionesCount: 31
  },
  {
    nombre: "Silla Oficina",
    categoria: "Oficina",
    precioOriginal: 380,
    precioDescuento: 300,
    imagen: "/img/Silla Oficina.png",
    isOfertaPlus: false,
    descripcion: "Silla giratoria de escritorio con mecanismo basculante y ruedas silenciosas de goma aptas para pisos de parquet. Diseño nórdico sobrio para productividad prolongada.",
    dimensiones: "92-102 cm (Alto ajustable) x 58 cm (Ancho)",
    materiales: "Estructura metálica cromada, carcasa acolchada y polipiel premium",
    garantia: "3 años de garantía",
    stock: 13,
    rating: 4.9,
    opinionesCount: 36
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    console.log('Eliminando productos anteriores...');
    await Product.deleteMany({});

    console.log('Insertando productos iniciales del catálogo...');
    const inserted = await Product.insertMany(initialProducts);

    console.log(`✅ ¡Éxito! Se insertaron ${inserted.length} productos en la base de datos.`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error al ejecutar el seeder: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
