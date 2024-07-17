import React from "react";
import {Route, useHistory, Switch} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

import {CurrentUserContext} from 'AuthApp/CurrentUserContext';
import CheckTokenEffect from 'AuthApp/CheckTokenEffect';
import {UserDataContext} from 'AuthApp/UserDataContext';

const Register = React.lazy(() => import('AuthApp/Register'));
const Login = React.lazy(() => import('AuthApp/Login'));

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);

    // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
    const [currentUser, setCurrentUser] = React.useState({});
    const [userData, setUserData] = React.useState({userData: null, isLoggedIn: false});

    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
    const [tooltipStatus, setTooltipStatus] = React.useState("");

    const history = useHistory();

    // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
    React.useEffect(() => {
        api
            .getAppInfo()
            .then(([cardData, userData]) => {
                setCurrentUser(userData);
                setCards(cardData);
            })
            .catch((err) => console.log(err));
    }, []);

    // при монтировании App описан эффект, проверяющий наличие токена и его валидности
    CheckTokenEffect(setUserData, history);

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsInfoToolTipOpen(false);
        setSelectedCard(null);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleUpdateUser(userUpdate) {
        api
            .setUserInfo(userUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUpdate) {
        api
            .setUserAvatar(avatarUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleCardLike(card) {
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

    function handleCardDelete(card) {
        api
            .removeCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function onRegisterSuccess(userData) {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
    }

    function onLoginSuccess(userData) {
        history.push("/");
    }

    function onAuthFailed(error) {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
    }

    function onSignOut() {
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
            <UserDataContext.Provider value={{userData, setUserData}}>
                <div className="page__content">
                    <Header onSignOut={onSignOut}/>
                    <Switch>
                        {/*Роут / защищён HOC-компонентом ProtectedRoute*/}
                        <ProtectedRoute
                            exact
                            path="/"
                            component={Main}
                            cards={cards}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                            loggedIn={userData.isLoggedIn}
                        />
                        {/*Роут /signup и /signin не является защищёнными, т.е оборачивать их в HOC ProtectedRoute не нужно.*/}
                        <Route path="/signup">
                            <React.Suspense fallback={<h1>Loading...</h1>}>
                                <Register onRegisterSuccess={onRegisterSuccess} onRegisterFailed={onAuthFailed}/>
                            </React.Suspense>
                        </Route>
                        <Route path="/signin">
                            <React.Suspense fallback={<h1>Loading...</h1>}>
                                <Login onLoginSuccess={onLoginSuccess} onLoginFailed={onAuthFailed}/>
                            </React.Suspense>
                        </Route>
                    </Switch>
                    <Footer/>
                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onUpdateUser={handleUpdateUser}
                        onClose={closeAllPopups}
                    />
                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onAddPlace={handleAddPlaceSubmit}
                        onClose={closeAllPopups}
                    />
                    <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да"/>
                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onUpdateAvatar={handleUpdateAvatar}
                        onClose={closeAllPopups}
                    />
                    <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
                    <InfoTooltip
                        isOpen={isInfoToolTipOpen}
                        onClose={closeAllPopups}
                        status={tooltipStatus}
                    />
                </div>
            </UserDataContext.Provider>
        </CurrentUserContext.Provider>
    );
}

export default App;
