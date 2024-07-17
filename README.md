# Разделение проекта на микрофронтенды

## Декомпозиция монолитного микрофронтенда

В проекте можно выделить 3 функциональных группы, которые могут быть распределены по разным командам:
1. авторизация и регистрация
2. пользователи (профиль, карточка пользователя)
3. карточки (конкретно в текущий момент времени для пользователя это выглядит как "места", но со стороны реализации имеется более общее название - карточки и может использоваться в разных контекстах)

Вход пользователей и профиль можно и объединить, но с развитием проекта вполне возможно что авторизация и регистрация может усложняться, а её выделение из микрофронтенда пользователей выглядит достаточно простым, а также позволит снизить сложность микрофронтенда пользователей, где с развитием точно будет увеличиваться объем функционала и сложность.


## Выбор технологии микрофронтендов

Выбирая между Single SPA и Webpack Module Federation в данном проекте выбран WMF, потому что:
1. разные микрофронтенды будут на общей технологии (React). Главное преимущество Single SPA в возможности использовать разные технологии для разных микрофронтов.
2. выбор микрофронтенда будет идти не по URL, а допускать встраивание разных микрофронтендов друг в друга (например в списке карточек в хидере показывать карточку текущего пользователя). Single SPA предполагает что в зависимости от url будет разных микрофронтенд использоваться.
3. так как микрофронтенды будут на общей технологии, то WMF позволит переиспользовать общие зависимости, сократив трафик и время загрузки
4. Webpack Module Federation имеет тесную интеграцию с React


# Заметки на будущее
1. Для работы WMF важно чтобы стартовый файл не содержал сам какой-то логики, а был просто загрузчиком, в котором есть только `import("./bootstrap.js")`, иначе можно постоянно ловить ошибки связанные с eager initialization от shared зависимостей
2. Важно расшарить зависимости react, react-dom, иначе микрофронтенды начнут друг другу ломать работу
3. При работе с react-scripts нельзя изменить порт дев сервера. Надо передавать переменную окружения PORT
4. Если нужно чтобы какой-то класс подгрузился с другого микрофронтенда "блокирующе" - используем `import { CurrentUserContext } from 'AuthApp/CurrentUserContext';` в начале файла. А если хотим подгрузить лениво какой-то ui компонент - `const Register = React.lazy(() => import('AuthApp/Register'));`
5. При пересечении имен css файлов будет загружен только один из них (если например в компонентах auth подключать ../index.css то подключится только от одного из микрофронтов)

