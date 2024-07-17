import React from 'react';
import Card from './Card';
import ProfileInfo from 'UsersApp/ProfileInfo';

function Main({ cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete }) {
  return (
    <main className="content">
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
    </main>
  );
}

export default Main;
