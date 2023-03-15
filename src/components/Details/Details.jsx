import "./Details.css";

export function Details({
  character,
  choosedCharacterId,
  setChoosedCharacter,
  chooseCharacter,
}) {
  return (
    <div className="Details">
      {character !== null ? (
        <>
          <div
            className="Details__back"
            onClick={() => {
              setChoosedCharacter((choosedCharacterId = -1));
              chooseCharacter(choosedCharacterId);
            }}
          >
            <img
              src="img/arrow_back.svg"
              alt="Arrow back"
              className="Details__back-arrow"
            />
            <button className="Details__back-button">GO BACK</button>
          </div>
          <div className="Details__card">
            <div className="Details__card__title">
              <img
                src={character.image}
                alt={`character ${character.name}`}
                className="Details__card__title__image"
              />
              <div className="Details__card__title__name">{character.name}</div>
            </div>
            <div className="Details__card__information">
              <div className="Details__card__information__title">
                Informations
              </div>

              <div className="Details__card__information__details">
                <div className="Details__card__information__details__option">
                  Gender
                </div>
                <div className="Details__card__information__details__value">
                  {character.gender}
                </div>
              </div>
              <hr />
              <div className="Details__card__information__details">
                <div className="Details__card__information__details__option">
                  Status
                </div>
                <div className="Details__card__information__details__value">
                  {character.status}
                </div>
              </div>
              <hr />
              <div className="Details__card__information__details">
                <div className="Details__card__information__details__option">
                  Specie
                </div>
                <div className="Details__card__information__details__value">
                  {character.species}
                </div>
              </div>
              <hr />
              <div className="Details__card__information__details">
                <div className="Details__card__information__details__option">
                  Origin
                </div>
                <div className="Details__card__information__details__value">
                  {character.origin.name}
                </div>
              </div>
              <hr />
              <div className="Details__card__information__details">
                <div className="Details__card__information__details__option">
                  Type
                </div>
                <div className="Details__card__information__details__value">
                  {character.type === "" ? "Unknown" : character.type}
                </div>
              </div>
              <hr />
            </div>
          </div>
        </>
      ) : (
        <div className="details-text">Looooooad</div>
      )}
    </div>
  );
}
