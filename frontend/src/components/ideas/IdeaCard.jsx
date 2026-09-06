import { memo } from 'react';

/**
 * Tarjeta de Idea de diseño (IdeaCard)
 * Optimizado con React.memo para evitar re-renderizados estáticos
 */
const IdeaCard = memo(({ idea }) => {
  return (
    <article className="idea-tarjeta">
      <img src={idea.imagen} alt={idea.titulo} className="idea-img" loading="lazy" />

      <div className="idea_texto">
        <div className="texto-contenedor">
          <h3>{idea.titulo}</h3>
          <p>{idea.descripcion}</p>
        </div>

        <div className="autor-contenedor">
          <img src={idea.autorImg} alt={idea.autor} className="autor-img" loading="lazy" />
          <div className="autor-texto">
            <p>{idea.autor}</p>
            <p>{idea.cargo}</p>
          </div>
        </div>
      </div>
    </article>
  );
});

IdeaCard.displayName = 'IdeaCard';

export default IdeaCard;
