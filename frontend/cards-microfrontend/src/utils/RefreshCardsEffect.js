import React from 'react';
import api from "./api";

function RefreshCardsEffect(setCards) {
    // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
    React.useEffect(() => {
        api
            .getCardList()
            .then((cardList) => {
                setCards(cardList);
            })
            .catch((err) => console.log(err));
    }, [setCards]);
}

export default RefreshCardsEffect;
