import { getAndUpdateToken } from './renderContent.js'

export const commentsRenderingInfo = document.querySelector(
    '[data-js-comments-rendering-info]',
)

export function getListOfComments() {
    return fetch('https://wedev-api.sky.pro/api/v2/nikita-golubev/comments')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return data
        })
}

export async function getBearerToken(login, password) {
    const mainPromise = await fetch(
        'https://wedev-api.sky.pro/api/user/login',
        {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
            }),
        },
    )

    return mainPromise
}

export async function getInfoAboutLike(
    searchedComment,
    authToken = JSON.parse(localStorage.getItem('localUser')).token.split(
        ' ',
    )[1],
) {
    const mainLikeInfo = await fetch(
        `https://wedev-api.sky.pro/api/v2/nikita-golubev/comments/${searchedComment}/toggle-like`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    )

    return mainLikeInfo.json()
}

export async function isAlreadyAuth(login, password) {
    let resultOfAuthRequest = await getBearerToken(login, password)

    if (resultOfAuthRequest.status === 400) {
        throw new Error('неправильный логин или пароль')
    } else {
        await resultOfAuthRequest.json().then((data) => {
            getAndUpdateToken(data.user.token)
        })
    }
}
