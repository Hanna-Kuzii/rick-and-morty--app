import { CardItem } from "../CardItem/CardItem";
import "./CardsList.css";

export const CardsList = ({
  characters,
  getCharacters,
  choosedCharacterId,
  setChoosedCharacter,
  chooseCharacter,
  errorSearch,
  setPage,
  page,
  filter,
  loadCharacters,
}) => {
  localStorage.setItem("characters", JSON.stringify(characters));
  return (
    <>
      {errorSearch === 1 ? (
        <div className="details-text">
          There is nothing on request
        </div>
      ) : (
        <>
          <div className="CardsList">
            {characters.map((character) => (
              <div
                key={character.id}
                className="CardsList__item"
                onClick={() => {
                  setChoosedCharacter((choosedCharacterId = character.id));
                  chooseCharacter(choosedCharacterId);
                }}
              >
                <CardItem character={character} />
              </div>
            ))}
          </div>
          {characters.length === 20 && (
            <button
              className="CardsList__load"
              onClick={() => {
                setPage((page = page + 1));
                loadCharacters(page, filter);
              }}
            >
              Load more characters
            </button>
          )}
        </>
      )}
    </>
  );
};
