import React from "react";
import {Route, useHistory, Switch} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

import {CurrentUserContext} from 'UsersApp/CurrentUserContext';
import {UserDataContext} from 'AuthApp/UserDataContext';

import CheckTokenEffect from 'AuthApp/CheckTokenEffect';
import RefreshUserEffect from 'UsersApp/RefreshUserEffect';
import RefreshCardsEffect from 'CardsApp/RefreshCardsEffect';
import {likeCard, deleteCard, addCard} from 'CardsApp/CardHandlers';

const Register = React.lazy(() => import('AuthApp/Register'));
const Login = React.lazy(() => import('AuthApp/Login'));

const EditProfilePopup = React.lazy(() => import('UsersApp/EditProfilePopup'));
const EditAvatarPopup = React.lazy(() => import('UsersApp/EditAvatarPopup'));

const RemoveCardPopup = React.lazy(() => import('CardsApp/RemoveCardPopup'));
const ImagePopup = React.lazy(() => import('CardsApp/ImagePopup'));
const AddPlacePopup = React.lazy(() => import('CardsApp/AddPlacePopup'));

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
    RefreshCardsEffect(setCards);
    RefreshUserEffect(setCurrentUser);

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

    function handleCardLike(card) {
        likeCard(currentUser, card, setCards);
    }

    function handleCardDelete(card) {
        deleteCard(currentUser, card, setCards);
    }

    function handleAddPlaceSubmit(newCard) {
        addCard(newCard, cards, setCards, closeAllPopups);
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
                    <React.Suspense fallback={<></>}>
                        <EditProfilePopup
                            isOpen={isEditProfilePopupOpen}
                            onSuccess={closeAllPopups}
                            onClose={closeAllPopups}
                        />
                        <EditAvatarPopup
                            isOpen={isEditAvatarPopupOpen}
                            onSuccess={closeAllPopups}
                            onClose={closeAllPopups}
                        />

                        <AddPlacePopup
                            isOpen={isAddPlacePopupOpen}
                            onAddPlace={handleAddPlaceSubmit}
                            onClose={closeAllPopups}
                        />
                        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
                        <RemoveCardPopup />
                    </React.Suspense>
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
