import React from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from "../context/CurrentUserContext";

import '../index.css'
import api from "../utils/api";

function EditProfilePopup({isOpen, onSuccess, onClose}) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    const {currentUser, setCurrentUser} = React.useContext(CurrentUserContext);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    React.useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [currentUser]);

    function handleUpdateUser(userUpdate) {
        api
            .setUserInfo(userUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                onSuccess();
            })
            .catch((err) => console.log(err));
    }

    function handleSubmit(e) {
        e.preventDefault();

        handleUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose} title="Редактировать профиль" name="edit"
        >
            <label className="popup__label">
                <input type="text" name="userName" id="owner-name"
                       className="popup__input popup__input_type_name" placeholder="Имя"
                       required minLength="2" maxLength="40" pattern="[a-zA-Zа-яА-Я -]{1,}"
                       value={name || ''} onChange={handleNameChange}/>
                <span className="popup__error" id="owner-name-error"></span>
            </label>
            <label className="popup__label">
                <input type="text" name="userDescription" id="owner-description"
                       className="popup__input popup__input_type_description" placeholder="Занятие"
                       required minLength="2" maxLength="200"
                       value={description || ''} onChange={handleDescriptionChange}/>
                <span className="popup__error" id="owner-description-error"></span>
            </label>
        </PopupWithForm>
    );
}

export default EditProfilePopup;
