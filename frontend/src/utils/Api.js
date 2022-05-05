class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

//обработка ответа сервера
_checkResult(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

_getHeaders() {
  const jwt = localStorage.getItem('jwt');
  return {
    'Authorization': `Bearer ${jwt}`,
    ...this._headers,
  };
}

// методы работы с Api
// информация bio с сервера
  getUserInfo() {
    const requestUrl = this._baseUrl + '/users/me';
    return fetch(requestUrl, {
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // карточки с сервера
  getInitialCards() {
    const requestUrl = this._baseUrl + '/cards';
    return fetch(requestUrl, {
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // данные для первоначальной отрисовки bio и карточек
  getDefaultData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  // редактирование данных пользователя
  editProfile(inputValues) {
    const requestUrl = this._baseUrl + '/users/me';
    return fetch(requestUrl, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: inputValues.name,
        about: inputValues.about
      })
    })
    .then((res) => this._checkResult(res));
  }

  // добавление новой карточки
  addNewCard(inputValues) {
    const requestUrl = this._baseUrl + '/cards';
    return fetch(requestUrl, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(inputValues),
    })
    .then((res) => this._checkResult(res));
  }

  // удаление карточки
  deleteCard(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}`;
    return fetch(requestUrl, {
      method: 'DELETE',
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // установка лайка
  addLike(cardId) {
    const requestUrl = this._baseUrl + `/cards/likes/${cardId}`;
    return fetch(requestUrl, {
      method: 'PUT',
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // снятие лайка
  deleteLike(cardId) {
    const requestUrl = this._baseUrl + `/cards/likes/${cardId}`;
    return fetch(requestUrl, {
      method: 'DELETE',
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // обновление аватара
  updateProfileAvatar(inputValues) {
    const requestUrl = this._baseUrl + `/users/me/avatar`;
    console.log(inputValues);
    return fetch(requestUrl, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        avatar: inputValues.avatar
      })
    })
    .then((res) => this._checkResult(res));
  }
}

const api = new Api({
  baseUrl: 'http://mesto.backend.volkovakv.nomoredomains.work/',
  headers: {
    'Content-Type': 'application/json'
  }
}); 

export default api;