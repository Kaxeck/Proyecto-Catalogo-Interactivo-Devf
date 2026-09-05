import IdeaCard from '../components/ideas/IdeaCard';
import { ideasData } from '../data/mockData';

// Página de Ideas: galería de recomendaciones arquitectónicas y consejos de estilismo nórdico
const IdeasPage = () => {
  return (
    <main style={{ paddingBottom: '3rem' }}>
      <section className="espacio_lateral_idea">
        <h1>Ideas e Inspiración</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Consejos de expertos, tendencias y proyectos de diseño para elevar la estética de tus espacios.
        </p>

        <div>
          {ideasData.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default IdeasPage;
