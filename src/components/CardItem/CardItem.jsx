import "./CardItem.css";

export function CardItem({ character }) {
  return (
    <div className="CardItem">
      <div className="CardItem__image">
        <img
          src={character.image}
          alt={`character ${character.name}`}
          className="CardItem__image__img"
        />
      </div>
      <div className="CardItem__description">
        <div className="CardItem__description__name">{character.name}</div>
        <div className="CardItem__description__species">
          {character.species}
        </div>
      </div>
    </div>
  );
}
