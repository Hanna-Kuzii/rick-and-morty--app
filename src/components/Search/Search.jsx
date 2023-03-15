import "./Search.css";

export function Search({ filter, setFilter, searchCharacters }) {
  return (
    <div className="Search">
      <div className="Search__elements">
        <img
          src="/img/search.svg"
          alt="logo search"
          className="Search__elements__logo"
        />
        <input
          type="search"
          id="search-charcters"
          name="search"
          className="Search__elements__input"
          placeholder="Filter by name..."
          value={JSON.parse(localStorage?.getItem("filter")) || ""}
          onChange={(event) => {
            setFilter((filter = event.target.value));
            searchCharacters(filter);
          }}
        ></input>
      </div>
    </div>
  );
}
