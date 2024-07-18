import React from 'react';
import api from "./api";

function RefreshUserEffect(setCurrentUser) {
    // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
    React.useEffect(() => {
        api
            .getUserInfo()
            .then((userData) => {
                setCurrentUser(userData);
            })
            .catch((err) => console.log(err));
    }, [setCurrentUser]);
}

export default RefreshUserEffect;
