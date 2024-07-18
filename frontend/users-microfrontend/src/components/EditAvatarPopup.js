import React from 'react';
import PopupWithForm from './PopupWithForm';

import '../index.css'
import api from "../utils/api";
import {CurrentUserContext} from "../context/CurrentUserContext";

function EditAvatarPopup({isOpen, onSuccess, onClose}) {
    const inputRef = React.useRef();

    const {setCurrentUser} = React.useContext(CurrentUserContext);

    function handleUpdateAvatar(avatarUpdate) {
        api
            .setUserAvatar(avatarUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                onSuccess();
            })
            .catch((err) => console.log(err));
    }

    function handleSubmit(e) {
        e.preventDefault();

        handleUpdateAvatar({
            avatar: inputRef.current.value,
        });
    }

    return (
        <PopupWithForm
            isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose} title="Обновить аватар" name="edit-avatar"
        >

            <label className="popup__label">
                <input type="url" name="avatar" id="owner-avatar"
                       className="popup__input popup__input_type_description" placeholder="Ссылка на изображение"
                       required ref={inputRef}/>
                <span className="popup__error" id="owner-avatar-error"></span>
            </label>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;
