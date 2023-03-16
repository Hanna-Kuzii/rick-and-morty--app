import "./Account.css";

export function Account({ account, logOut, loginType }) {
  return (
    <div className="Account">
      <div className="Account__profile">
        <div className="Account__profile__login">You're logged with {loginType}</div>
        <div className="Account__profile__add">
          <div className="Account__profile__add-info">
            <div className="Account__profile__add-info__option">Name:</div>
            <div className="Account__profile__add-info__value">
              {account.name}
            </div>
          </div>
          <div className="Account__profile__add-info">
            <div className="Account__profile__add-info__option">E-mail:</div>
            <div className="Account__profile__add-info__value email">
              {account.email}
            </div>
          </div>
        </div>
      </div>
      <button className="Account__logout button-auth" onClick={logOut}>
        Log out
      </button>
    </div>
  );
}
