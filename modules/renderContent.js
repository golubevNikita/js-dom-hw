import { getListOfComments, getBearerToken } from './apiMainFunctions.js'
import { commentAuthRender } from './renderCommentsFunctions.js'
import { correctInput, emptyCheck } from './inputProcessingFunctions.js'
import {
    // commentsArray,
    newContentOfArray,
} from './commentsInfoArr.js'

export const formContainer = document.querySelector(
    '[data-js-add-form-container]',
)

export let authToken = ''
export function getAndUpdateToken(newtoken) {
    authToken = newtoken
}

export function renderAuthorisationForm() {
    formContainer.innerHTML = `<div>
    <h3 style="margin-top: 0px">
        Авторизоваться, чтобы оставлять комментарии ❤
    </h3>
    <p>Ваш логин</p>
    <input data-js-login-input type="text" class="add-form-name" 
        placeholder="Логин"/>
    <p>Пароль</p>
    <input data-js-password-input type="text" class="add-form-name" 
        placeholder="Пароль"/>
    <button data-js-auth-button style="margin-top: 16px; 
        display: block" class="add-form-button">
            Войти
    </button>
    </div>
    <div>
        <h2 style="margin-bottom: 16px">
            Ещё нет аккаунта? Тогда тебе сюда ↓
        </h2>
        <button data-js-registration-button style="margin-top: 0px" 
            class="add-form-button">
                Регистрация
        </button>
    </div>`

    const authorisationButton = document.querySelector('[data-js-auth-button]')
    const loginInput = document.querySelector('[data-js-login-input]')
    const passwordInput = document.querySelector('[data-js-password-input]')

    authorisationButton.addEventListener('click', () => {
        loginInput.classList.remove('main__input_empty')
        passwordInput.classList.remove('main__input_empty')

        emptyCheck(loginInput, passwordInput)

        const authorisationinformation = document.querySelector(
            '[data-js-auth-process-info]',
        )

        authorisationinformation.style.display = 'block'
        formContainer.style.visibility = 'hidden'

        async function getAuthResponse() {
            try {
                const login = loginInput.value
                const password = passwordInput.value

                let resultOfAuthRequest = await getBearerToken(login, password)

                if (resultOfAuthRequest.status === 400) {
                    throw new Error(
                        'логин / пароль введён неправильно или не введён вообще',
                    )
                } else {
                    await resultOfAuthRequest.json().then((data) => {
                        getAndUpdateToken(data.user.token)

                        localStorage.setItem(
                            'localUser',
                            JSON.stringify({
                                token: `Bearer ${authToken}`,
                                login: `${data.user.login}`,
                                password: `${data.user.password}`,
                            }),
                        )
                    })

                    authorisationinformation.style.display = 'none'

                    loginInput.value = ''
                    passwordInput.value = ''

                    commentAuthRender()
                    renderCommentForm()

                    formContainer.style.visibility = 'visible'
                }
            } catch (error) {
                const textOfError = new String(error)
                textOfError.includes('TypeError: Failed to fetch')
                    ? alert(`Ошибка: проверьте интернет соединение`)
                    : alert(`Ошибка: ${error.message}`)

                authorisationinformation.style.display = 'none'
                formContainer.style.visibility = 'visible'
            }
        }

        getAuthResponse()
    })
}

export function renderCommentForm() {
    formContainer.innerHTML = `<input data-js-name-input type="text"
        class="add-form-name" value="${JSON.parse(localStorage.getItem('localUser')).login}" 
        placeholder="Введите ваше имя"/>
    <textarea data-js-comment-input
        type="textarea" class="add-form-text" 
        placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div style="display: flex; justify-content: space-between">
        <div class="add-form-row">
            <button data-js-add-button class="add-form-button">
            Написать
            </button>
        </div>
        <div class="add-form-row">
            <button data-js-exit-button class="add-form-button">
            Выйти
            </button>
        </div>
    </div>`

    const addCommentButton = document.querySelector('[data-js-add-button]')
    const nameAutorInput = document.querySelector('[data-js-name-input]')
    const commentTextInput = document.querySelector('[data-js-comment-input]')

    addCommentButton.addEventListener('click', () => {
        // console.log(commentsArray)

        // fetch(
        //     'https://wedev-api.sky.pro/api/v2/nikita-golubev/comments/67a4ffbc780abccd4b6bffb6',
        //     {
        //         method: 'DELETE',
        //         headers: {
        //             Authorization: `Bearer ${authToken}`,
        //         },
        //     },
        // )

        nameAutorInput.value = JSON.parse(
            localStorage.getItem('localUser'),
        ).login

        commentTextInput.classList.remove('main__input_empty')

        if (commentTextInput.value === '') {
            commentTextInput.classList.add('main__input_empty')
        }

        const addingCommentinformation = document.querySelector(
            '[data-js-comment-adding-info]',
        )

        addingCommentinformation.style.display = 'block'
        formContainer.style.visibility = 'hidden'

        async function getmainPromise() {
            const mainPromise = await fetch(
                'https://wedev-api.sky.pro/api/v2/nikita-golubev/comments',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        text: `${correctInput(commentTextInput)}`,
                    }),
                },
            )

            return mainPromise
        }

        async function postComment() {
            try {
                let resultOfRequest = await getmainPromise()

                if (resultOfRequest.status === 400) {
                    throw new Error('текст комментария короче 3 символов')
                }

                if (resultOfRequest.ok) {
                    getListOfComments().then((response) => {
                        newContentOfArray(response.comments)

                        commentTextInput.value = ''
                        addingCommentinformation.style.display = 'none'
                        formContainer.style.visibility = 'visible'

                        commentAuthRender()
                    })
                }
            } catch (error) {
                const textOfError = new String(error)
                textOfError.includes('TypeError: Failed to fetch')
                    ? alert(`Ошибка: проверьте интернет соединение`)
                    : alert(`Ошибка: ${error.message}`)

                addingCommentinformation.style.display = 'none'
                formContainer.style.visibility = 'visible'
            }
        }

        postComment()
    })

    const userExitButton = document.querySelector('[data-js-exit-button]')

    userExitButton.addEventListener('click', () => {
        localStorage.removeItem('localUser')
        location.reload()
    })
}
