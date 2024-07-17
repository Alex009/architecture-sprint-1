import React, {useContext} from 'react';
import {Route, Link} from 'react-router-dom';

import '../index.css'
import {UserDataContext} from "../context/UserDataContext";

function SignOut({onSignOut}) {
    const {setUserData, userData} = useContext(UserDataContext);

    function handleSignOut() {
        localStorage.removeItem("jwt");
        setUserData({email: null, isLoggedIn: false});
        onSignOut();
    }

    return (
        <>
            <Route exact path="/">
                <div className="header__wrapper">
                    <p className="header__user">{userData.email}</p>
                    <button className="header__logout" onClick={handleSignOut}>Выйти</button>
                </div>
            </Route>
            <Route path="/signup">
                <Link className="header__auth-link" to="signin">Войти</Link>
            </Route>
            <Route path="/signin">
                <Link className="header__auth-link" to="signup">Регистрация</Link>
            </Route>
        </>
    )
}

export default SignOut;
