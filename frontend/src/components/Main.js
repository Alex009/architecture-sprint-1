import React from 'react';

const Card = React.lazy(() => import('CardsApp/Card'));
const ProfileInfo = React.lazy(() => import('UsersApp/ProfileInfo'));

function Main({cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete}) {
    return (
        <main className="content">
            <React.Suspense fallback={<p>Loading...</p>}>
                <ProfileInfo onEditAvatar={onEditAvatar} onEditProfile={onEditProfile} onAddPlace={onAddPlace}/>
                <section className="places page__section">
                    <ul className="places__list">
                        {cards.map((card) => (
                            <Card
                                key={card._id}
                                card={card}
                                onCardClick={onCardClick}
                                onCardLike={onCardLike}
                                onCardDelete={onCardDelete}
                            />
                        ))}
                    </ul>
                </section>
            </React.Suspense>
        </main>
    );
}

export default Main;
