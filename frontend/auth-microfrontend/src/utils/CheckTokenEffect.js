import React from 'react';

import * as auth from "../utils/auth.js";

function CheckTokenEffect(setUserData, history) {
    React.useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            auth
                .checkToken(token)
                .then((res) => {
                    setUserData({
                        email: res.data.email,
                        isLoggedIn: true
                    })
                    history.push("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.log(err);
                });
        }
    }, [setUserData, history]);
}

export default CheckTokenEffect;
