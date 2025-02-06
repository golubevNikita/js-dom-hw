import { newContentOfArray } from './commentsInfoArr.js'

import {
    authToken,
    formContainer,
    getAndUpdateToken,
    renderCommentForm,
    renderAuthorisationForm,
} from './renderContent.js'

import {
    commentsRenderingInfo,
    getListOfComments,
    getBearerToken,
} from './apiMainFunctions.js'

import {
    commentRender,
    commentAuthRender,
    commentContainer,
} from './renderCommentsFunctions.js'

export function regButtonRender() {
    const registrationButton = document.querySelector(
        '[data-js-registration-button]',
    )

    registrationButton.addEventListener('click', () => {
        renderRegistrationForm()
    })
}

export const registrationFormContainer = document.querySelector(
    '[data-js-registration-form]',
)

export function renderRegistrationForm() {
    registrationFormContainer.style.display = 'block'
    commentContainer.innerHTML = ''
    commentContainer.style.display = 'none'

    registrationFormContainer.innerHTML = `<div>
        <h3 style="margin-top: 0px">
            Чтобы зарегистрироваться, введите:
        </h3>
        <p>Ваш логин</p>
        <input
            data-js-registration-new-login
            type="text"
            class="add-form-name"
            placeholder="Логин"/>
        <p>Имя</p>
        <input
            data-js-registration-new-name
            type="text"
            class="add-form-name"
            placeholder="Имя"/>
        <p>Пароль</p>
        <input
            data-js-registration-new-password
            type="text"
            class="add-form-name"
            placeholder="Пароль"/>
    </div>
    <div>
        <button
            data-js-registration-confirm
            style="margin-right: 16px"
            class="add-form-button">
            Зарегистрироваться
        </button>
        <button data-js-registration-cancel class="add-form-button">
            Отмена
        </button>
    </div>`

    const registrationCancelButton = document.querySelector(
        '[data-js-registration-cancel]',
    )

    registrationCancelButton.addEventListener('click', () => {
        registrationFormContainer.innerHTML = ''
        registrationFormContainer.style.display = 'none'

        commentsRenderingInfo.style.display = 'block'

        getListOfComments().then((response) => {
            newContentOfArray(response.comments)
            commentRender()

            formContainer.style.display = 'flex'
            renderAuthorisationForm()
            regButtonRender()

            commentsRenderingInfo.style.display = 'none'
            commentContainer.style.display = 'flex'
        })
    })

    afterRenderRegistrationForm()
}

export function afterRenderRegistrationForm() {
    formContainer.innerHTML = ''
    formContainer.style.display = 'none'

    const registrationConfirmButton = document.querySelector(
        '[data-js-registration-confirm]',
    )
    const registrationLoginInput = document.querySelector(
        '[data-js-registration-new-login]',
    )
    const registrationNameInput = document.querySelector(
        '[data-js-registration-new-name]',
    )
    const registrationPasswordInput = document.querySelector(
        '[data-js-registration-new-password]',
    )

    registrationConfirmButton.addEventListener('click', () => {
        registrationLoginInput.classList.remove('main__input_empty')
        registrationNameInput.classList.remove('main__input_empty')
        registrationPasswordInput.classList.remove('main__input_empty')

        const registrationinformation = document.querySelector(
            '[data-js-registration-process-info]',
        )

        registrationinformation.style.display = 'block'
        registrationFormContainer.style.visibility = 'hidden'

        const newLogin = registrationLoginInput.value
        const newName = registrationNameInput.value
        const newPassword = registrationPasswordInput.value

        async function newUserRegistration() {
            const mainPromise = await fetch(
                'https://wedev-api.sky.pro/api/user',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        login: `${newLogin}`,
                        name: `${newName}`,
                        password: `${newPassword}`,
                    }),
                },
            )

            return mainPromise
        }

        async function getRegistrationResponse() {
            try {
                if (newLogin === '' || newName === '' || newPassword === '') {
                    registrationLoginInput.classList.add('main__input_empty')
                    registrationNameInput.classList.add('main__input_empty')
                    registrationPasswordInput.classList.add('main__input_empty')
                    throw new Error('не заполнены обязательные поля')
                }

                let resultOfRegistrationRequest = await newUserRegistration()

                if (resultOfRegistrationRequest.status === 400) {
                    throw new Error(
                        'пользователь с таким логином уже сущетсвует',
                    )
                } else {
                    await resultOfRegistrationRequest
                        .json()
                        .then((response) => {
                            getAndUpdateToken(response.user.token)
                            return response
                        })
                        .then((data) => {
                            localStorage.setItem(
                                'localUser',
                                JSON.stringify({
                                    token: `Bearer ${authToken}`,
                                    login: `${data.user.login}`,
                                    password: `${data.user.password}`,
                                }),
                            )

                            alert('Регистрация прошла успешно!')
                        })

                    registrationinformation.style.display = 'none'

                    await getBearerToken(
                        JSON.parse(localStorage.getItem('localUser')).login,
                        JSON.parse(localStorage.getItem('localUser')).password,
                    )

                    commentAuthRender()
                    renderCommentForm()
                }
            } catch (error) {
                const textOfError = new String(error)
                textOfError.includes('TypeError: Failed to fetch')
                    ? alert(`Ошибка: проверьте интернет соединение`)
                    : alert(`Ошибка: ${error.message}`)

                registrationinformation.style.display = 'none'
                registrationFormContainer.style.visibility = 'visible'
            }
        }

        getRegistrationResponse()
    })
}
