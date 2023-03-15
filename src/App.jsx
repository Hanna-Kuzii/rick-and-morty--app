import { getCharacters } from "./api.ts";
import "./App.css";
import { CardsList } from "./components/CardsList/CardsList";
import { Search } from "./components/Search/Search";
import React, { useEffect, useState } from "react";
import { Details } from "./components/Details/Details";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Account } from "./components/Account/Account";

function App() {
  let [charactersFromAPI, setCharactersFromAPI] = useState(
    JSON.parse(localStorage?.getItem("characters")) || []
  );
  let [choosedCharacterId, setChoosedCharacter] = useState(-1);
  let [choosedCharacter, setCharacter] = useState(null);
  let [filter, setFilter] = useState(
    JSON.parse(localStorage?.getItem("filter"))
  );
  let [errorSearch, setError] = useState(
    JSON.parse(localStorage?.getItem("errorSearch")) || 0
  );
  let [page, setPage] = useState(
    JSON.parse(localStorage?.getItem("page")) || 1
  );

  const [user, setUser] = useState([]);
  const [account, setAccount] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setAccount(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the account array to null
  const logOut = () => {
    googleLogout();
    setAccount(null);
  };

  useEffect(() => {
    const characters = () => {
      if (charactersFromAPI.length === 0) {
        getCharacters("").then((charactersApi) => {
          setCharactersFromAPI([
            ...charactersApi.results.sort(function (a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            }),
          ]);
        });
        localStorage.setItem("characters", JSON.stringify(charactersFromAPI));
      }
    };

    characters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCharacters = (page, filter) => {
    localStorage.setItem("page", JSON.stringify(page));
    let name = "";
    if (filter) {
      name = `&name=${filter}`;
    }
    let array = [...charactersFromAPI];
    getCharacters(`?page=${page}${name}`).then((charactersApi) => {
      charactersApi.results.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      charactersApi.results.forEach((item) => array.push(item));
      setCharactersFromAPI((charactersFromAPI = [...array]));
    });
    localStorage.setItem("characters", JSON.stringify(charactersFromAPI));
    return charactersFromAPI;
  };

  const searchCharacters = (filterName) => {
    getCharacters(`?name=${filterName}`).then((charactersApi) => {
      if (!charactersApi.results) {
        setError((errorSearch = 1));
        localStorage.setItem("errorSearch", JSON.stringify(errorSearch));
      }
      setCharactersFromAPI([
        ...charactersApi.results.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
      ]);
      setError((errorSearch = 0));
    });

    localStorage.setItem("errorSearch", JSON.stringify(errorSearch));
    localStorage.setItem("filter", JSON.stringify(filterName));

    return charactersFromAPI;
  };

  function chooseCharacter(id) {
    if (id !== -1) {
      return getCharacters(`/${id}`).then((item) => {
        setCharacter((choosedCharacter = item));
      });
    } else {
      setCharacter((choosedCharacter = null));
    }
  }
  console.log(account);
  return (
    <div className="App">
      {account ? (
        <>
          {choosedCharacterId !== -1 ? (
            <Details
              character={choosedCharacter}
              choosedCharacterId={choosedCharacterId}
              setChoosedCharacter={setChoosedCharacter}
              chooseCharacter={chooseCharacter}
            />
          ) : (
            <div className="App__mainpage">
              {" "}
              <header className="App__mainpage__header">
                <Account account={account} logOut={logOut}/>
                <img
                  src="/img/header.png"
                  className="header-image"
                  alt="Rick and Morty"
                />
              </header>
              <Search
                filter={filter}
                setFilter={setFilter}
                searchCharacters={searchCharacters}
              />
              {charactersFromAPI.length === 0 ? (
                <div className="details-text">LOADING...</div>
              ) : (
                <CardsList
                  characters={charactersFromAPI}
                  choosedCharacterId={choosedCharacterId}
                  setChoosedCharacter={setChoosedCharacter}
                  chooseCharacter={chooseCharacter}
                  errorSearch={errorSearch}
                  page={page}
                  setPage={setPage}
                  filter={filter}
                  loadCharacters={loadCharacters}
                />
              )}
            </div>
          )}
          
        </>
      ) : (
        <div className="App__button-auth">
          <button 
            className="button-auth"
            onClick={() => login()}>Sign in with Google 🚀 </button>
        </div>
      )}
    </div>
  );
}

export default App;
