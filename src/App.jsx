import { getCharacters } from "./api.ts";
import "./App.css";
import { CardsList } from "./components/CardsList/CardsList";
import { Search } from "./components/Search/Search";
import React, { useEffect, useState } from "react";
import { Details } from "./components/Details/Details";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { Account } from "./components/Account/Account";
import FacebookLogin from "react-facebook-login";
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
  const [logIn, setLogIn] = useState(
    JSON.parse(localStorage?.getItem("logIn")) || ""
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage?.getItem("user")) || []
  );
  const [account, setAccount] = useState(
    JSON.parse(localStorage?.getItem("account")) || []
  );

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      setLogIn("Google");
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("logIn", JSON.stringify(logIn));
    if (user.length !== 0) {
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
    localStorage.setItem("account", JSON.stringify(account));
  }, [user]);

  const loginFacebook = (response) => {
    if (response.status === "unknown") {
      setLogIn("");
      return false;
    }
    setUser(response);
    setAccount(response);

    if (response.accessToken) {
      setLogIn("Facebook");
    } else {
      setLogIn("");
    }
  };

  const logOut = () => {
    if (logIn === "Google") {
      googleLogout();
      setAccount([]);
      setLogIn("");
      setUser([]);
    } else {
      setAccount([]);
      setLogIn("");
      setUser([]);
    }
  };

  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
    localStorage.setItem("logIn", JSON.stringify(logIn));
  }, [account, logIn]);

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
  return (
    <div className="App">
      {logIn !== "" ? (
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
                <Account account={account} logOut={logOut} loginType={logIn} />
                <img
                  src="img/header.png"
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
          <button onClick={() => loginGoogle()}>Sign in with Google </button>
          <FacebookLogin
            appId="876988586739647"
            autoLoad={false}
            fields="name,email,picture"
            scope="public_profile,email,user_friends"
            callback={loginFacebook}
            textButton="Sign in with Facebook"
            render={(renderProps) => (
              <button onClick={renderProps.onClick}>
                Sign in with Facebook
              </button>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default App;
