import { canILike } from './renderCommentsFunctions.js'
import { copyTextAndNameComment } from './inputProcessingFunctions.js'
import { getBearerToken } from './apiMainFunctions.js'
import {
    authToken,
    getAndUpdateToken,
    renderCommentForm,
} from './renderContent.js'

const registrationFormContainer = document.querySelector(
    '[data-js-registration-form]',
)

export function renderRegistrationForm() {
    const registrationButton = document.querySelector(
        '[data-js-registration-button]',
    )

    const registrationCancelButton = document.querySelector(
        '[data-js-registration-cancel]',
    )

    registrationButton.addEventListener('click', () => {
        registrationFormContainer.style.display = 'block'

        registrationCancelButton.addEventListener('click', () => {
            registrationFormContainer.style.display = 'none'
        })
    })
}

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
        const mainPromise = await fetch('https://wedev-api.sky.pro/api/user', {
            method: 'POST',
            body: JSON.stringify({
                login: `${newLogin}`,
                name: `${newName}`,
                password: `${newPassword}`,
            }),
        })

        return mainPromise
    }

    async function getRegistrationResponse() {
        try {
            if (
                registrationLoginInput.value === '' ||
                registrationNameInput.value === '' ||
                registrationPasswordInput.value === ''
            ) {
                registrationLoginInput.classList.add('main__input_empty')
                registrationNameInput.classList.add('main__input_empty')
                registrationPasswordInput.classList.add('main__input_empty')
                throw new Error('не заполнены обязательные поля')
            }

            let resultOfRegistrationRequest = await newUserRegistration()

            if (resultOfRegistrationRequest.status === 400) {
                throw new Error('пользователь с таким логином уже сущетсвует')
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

                renderCommentForm()
                canILike()
                copyTextAndNameComment()
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
