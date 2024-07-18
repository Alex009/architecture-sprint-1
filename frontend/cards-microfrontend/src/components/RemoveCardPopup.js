import React from 'react';
import PopupWithForm from "./PopupWithForm";

import '../index.css'

function RemoveCardPopup() {
    return (
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да"/>
    );
}

export default RemoveCardPopup;
