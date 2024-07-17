import React from "react";
import {Route, useHistory, Switch, Link} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import CheckTokenEffect from "../utils/CheckTokenEffect";

import {CurrentUserContext} from "../context/CurrentUserContext";
import {UserDataContext} from "../context/UserDataContext";
import SignOut from "./SignOut";

function App() {
    const [currentUser, setCurrentUser] = React.useState({});
    const [userData, setUserData] = React.useState({userData: null, isLoggedIn: false});

    const history = useHistory();

    // при монтировании App описан эффект, проверяющий наличие токена и его валидности
    CheckTokenEffect(setUserData, history);

    function onRegisterSuccess(userData) {
        history.push("/signin");
    }

    function onLoginSuccess(userData) {
        history.push("/");
    }

    function onAuthFailed(error) {
        console.error(error);
    }

    function onSignOut() {
        history.push("/signin");
    }

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
            <UserDataContext.Provider value={{userData, setUserData}}>
                <div className="page__content">
                    <SignOut onSignOut={onSignOut}/>
                    <Switch>
                        <Route path="/signup">
                            <Register onRegisterSuccess={onRegisterSuccess} onRegisterFailed={onAuthFailed}/>
                        </Route>
                        <Route path="/signin">
                            <Login onLoginSuccess={onLoginSuccess} onLoginFailed={onAuthFailed}/>
                        </Route>
                        <Route path="/">
                            <Link className="auth-form__link" to="/signin">Войти</Link>
                        </Route>
                    </Switch>
                </div>
            </UserDataContext.Provider>
        </CurrentUserContext.Provider>
    );
}

export default App;
