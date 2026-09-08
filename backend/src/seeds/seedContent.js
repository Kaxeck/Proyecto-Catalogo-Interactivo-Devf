const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Idea = require('../models/Idea');
const Service = require('../models/Service');

const ideasInitial = [
  {
    titulo: "Decoracion Sala de Estar",
    descripcion: "El corazón de tu hogar merece un diseño que cuente tu historia. Descubre cómo transformar tu sala de estar en un refugio de calma y sofisticación, combinando texturas suaves con líneas puras que invitan al descanso absoluto. Desde la iluminación perfecta hasta el sofá ideal, aquí encontrarás la inspiración para crear momentos inolvidables.",
    imagen: "/img/Idea 1.png",
    autor: "Saul Garcia",
    cargo: "Diseñador de interiores",
    autorImg: "https://img.freepik.com/foto-gratis/retrato-hombre-blanco-aislado_53876-40306.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    titulo: "Organizacion de Espacios Pequenos",
    descripcion: "Tu hogar no se define por sus dimensiones, sino por la calidez que transmite. Descubre el potencial oculto de cada rincón y transforma la falta de espacio en una oportunidad para la creatividad. Con muebles inteligentes y organización vertical, te mostramos cómo un ambiente compacto puede convertirse en un refugio íntimo, ordenado y sorprendentemente amplio.",
    imagen: "/img/Idea 2.png",
    autor: "Maria Lopez",
    cargo: "Diseñadora de interiores",
    autorImg: "https://hips.hearstapps.com/elle-es/assets/15/37/original/original-por-ti-rostros-activos-personas-luchadoras-12718597-1-esl-es-rostros-activos-personas-luchadoras-jpg.jpg"
  },
  {
    titulo: "Tendencias en Muebles 2025",
    descripcion: "El futuro del diseño interior regresa a lo esencial. En 2025, la vanguardia se define por una conexión profunda con la naturaleza y la sostenibilidad consciente. Prepárate para recibir formas orgánicas, texturas crudas y materiales eco-amigables que no solo decoran, sino que respiran. Esta tendencia invita a desacelerar el ritmo, creando ambientes donde la tecnología invisible y la artesanía tradicional conviven en perfecta armonía.",
    imagen: "/img/Idea 3.png",
    autor: "Guadalupe Sanchez",
    cargo: "Diseñadora de interiores",
    autorImg: "https://img.freepik.com/foto-gratis/hermosa-joven-latina-retrato-cara_53876-143238.jpg?semt=ais_hybrid&w=740&q=80"
  }
];

const servicesInitial = [
  {
    icono: "bx bx-package bx-md",
    titulo1: "Envio Gratis",
    titulo2: "a todo el pais",
    descripcion1: "Disfruta de nuestra logística eficiente con envíos bonificados en todas las órdenes mayores a $200.",
    descripcion2: "Garantizamos una cobertura total en el territorio nacional, asegurando que tu paquete llegue en perfectas condiciones y en el tiempo estimado."
  },
  {
    icono: "bx bx-headphone-mic bx-md",
    titulo1: "Atencion al Cliente",
    titulo2: "24/7",
    descripcion1: "Nuestro centro de soporte opera de manera ininterrumpida los 365 días del año.",
    descripcion2: "Contamos con personal capacitado listo para resolver cualquier incidencia técnica o administrativa, garantizando una respuesta ágil y soluciones efectivas."
  },
  {
    icono: "bx bx-shield-alt-2 bx-md",
    titulo1: "Garantia de",
    titulo2: "Devolucion",
    descripcion1: "Tu satisfacción es nuestra prioridad. Por ello, ofrecemos una política de protección al comprador de 30 días.",
    descripcion2: "Si el producto no cumple con tus expectativas, gestionaremos el proceso de devolución y reembolso de manera transparente y eficiente."
  }
];

const seedContent = async () => {
  try {
    await connectDB();

    console.log('Sembrando colección Ideas en MongoDB Atlas...');
    await Idea.deleteMany({});
    const insertedIdeas = await Idea.insertMany(ideasInitial);
    console.log(`✅ ¡Éxito! ${insertedIdeas.length} ideas insertadas en MongoDB Atlas.`);

    console.log('Sembrando colección Services en MongoDB Atlas...');
    await Service.deleteMany({});
    const insertedServices = await Service.insertMany(servicesInitial);
    console.log(`✅ ¡Éxito! ${insertedServices.length} servicios insertados en MongoDB Atlas.`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error al sembrar contenido: ${error.message}`);
    process.exit(1);
  }
};

seedContent();
