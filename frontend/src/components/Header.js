import React from 'react';
import logoPath from '../images/logo.svg';

const SignOut = React.lazy(() => import('AuthApp/SignOut'));

// В корневом компоненте App описаны обработчики: onRegister, onLogin и onSignOut. Эти обработчики переданы в соответствующие компоненты: Register.js, Login.js, Header.js
function Header({onSignOut}) {
    return (
        <header className="header page__section">
            <img src={logoPath} alt="Логотип проекта Mesto" className="logo header__logo"/>

            <React.Suspense fallback={<h1>Loading...</h1>}>
                <SignOut onSignOut={onSignOut}/>
            </React.Suspense>
        </header>
    )
}

export default Header;
