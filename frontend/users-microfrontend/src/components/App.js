import React from "react";
import {Switch} from "react-router-dom";

import {CurrentUserContext} from "../context/CurrentUserContext";

function App() {
    const [currentUser, setCurrentUser] = React.useState({});

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
            <div className="page__content">
                <Switch>

                </Switch>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
