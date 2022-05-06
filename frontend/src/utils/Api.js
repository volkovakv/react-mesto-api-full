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
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // карточки с сервера
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
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
    return fetch(`${this._baseUrl}/users/me`, {
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
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(inputValues),
    })
    .then((res) => this._checkResult(res));
  }

  // удаление карточки
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // установка лайка
  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // снятие лайка
  deleteLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    })
    .then((res) => this._checkResult(res));
  }

  // обновление аватара
  updateProfileAvatar(inputValues) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
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
  baseUrl: 'https://mesto.backend.volkovakv.nomoredomains.work',
  headers: {
    'Content-Type': 'application/json'
  }
}); 

export default api;