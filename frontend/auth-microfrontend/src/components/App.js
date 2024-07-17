import React from "react";
import {Route, useHistory, Switch} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import * as auth from "../utils/auth.js";

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    //В компоненты добавлены новые стейт-переменные: email — в компонент App
    const [email, setEmail] = React.useState("");

    const history = useHistory();

    // при монтировании App описан эффект, проверяющий наличие токена и его валидности
    React.useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            auth
                .checkToken(token)
                .then((res) => {
                    setEmail(res.data.email);
                    setIsLoggedIn(true);
                    history.push("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.log(err);
                });
        }
    }, [history]);

    function onRegister({email, password}) {
        auth
            .register(email, password)
            .then((res) => {
//        setTooltipStatus("success");
//        setIsInfoToolTipOpen(true);
                history.push("/signin");
            })
            .catch((err) => {
//        setTooltipStatus("fail");
//        setIsInfoToolTipOpen(true);
            });
    }

    function onLoginSuccess(userData) {
        setIsLoggedIn(true);
        setEmail(userData.email);
        history.push("/");
    }

    function onLoginFailed(error) {
        console.error(error)
    }

    function onSignOut() {
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <div className="page__content">
            {/*<Header email={email} onSignOut={onSignOut} />*/}
            <Switch>
                <Route path="/signup">
                    <Register onRegister={onRegister}/>
                </Route>
                <Route path="/">
                    <Login onLoginSuccess={onLoginSuccess} onLoginFailed={onLoginFailed} />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
