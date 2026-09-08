import { useState, useEffect } from 'react';
import IdeaCard from '../components/ideas/IdeaCard';
import { getIdeas } from '../services/contentService';

// Página de Ideas: galería de recomendaciones y artículos desde MongoDB Atlas
const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchIdeas = async () => {
      try {
        setCargando(true);
        const data = await getIdeas();
        if (isMounted) setIdeas(data);
      } catch {
        if (isMounted) setError('No se pudieron cargar las ideas.');
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    fetchIdeas();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main style={{ paddingBottom: '3rem' }}>
      <section className="espacio_lateral_idea">
        <h1>Ideas e Inspiración</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Consejos de expertos, tendencias y proyectos de diseño para elevar la estética de tus espacios.
        </p>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '36px', color: '#2C3E50' }}></i>
          </div>
        )}

        {!cargando && error && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#E74C3C' }}>
            <p>{error}</p>
          </div>
        )}

        {!cargando && !error && (
          <div>
            {ideas.map((idea) => (
              <IdeaCard key={idea.id || idea._id} idea={idea} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default IdeasPage;
