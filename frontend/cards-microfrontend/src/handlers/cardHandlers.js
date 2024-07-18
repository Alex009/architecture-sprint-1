import api from "../utils/api";

function likeCard(currentUser, card, setCards) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
        .changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
            setCards((cards) =>
                cards.map((c) => (c._id === card._id ? newCard : c))
            );
        })
        .catch((err) => console.log(err));
}

function deleteCard(currentUser, card, setCards) {
    api
        .removeCard(card._id)
        .then(() => {
            setCards((cards) => cards.filter((c) => c._id !== card._id));
        })
        .catch((err) => console.log(err));
}

function addCard(newCard, cards, setCards, onSuccess) {
    api
        .addCard(newCard)
        .then((newCardFull) => {
            setCards([newCardFull, ...cards]);
            onSuccess();
        })
        .catch((err) => console.log(err));
}

export {deleteCard, likeCard, addCard};
