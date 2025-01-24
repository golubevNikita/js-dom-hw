import { commentsArray, newContentOfArray } from './commentsInfoArr.js'
import { commentRender } from './renderCommentsFunctions.js'
import { apiRequest } from './apiImitation.js'

export const nameInput = document.querySelector('[data-js-name-input]')
export const commentInput = document.querySelector('[data-js-comment-input]')

export function copyTextAndNameComment() {
    const textsOfComments = document.querySelectorAll(['[data-js-text-area'])
    for (const textCommentEl of textsOfComments) {
        textCommentEl.addEventListener('click', () => {
            const textAreaIndex = textCommentEl.dataset.jsAreaIndex

            commentInput.value = `---> ${commentsArray[textAreaIndex].text}`
            nameInput.value = `from: ${commentsArray[textAreaIndex].author.name}`
        })
    }
}

export function correctInput(someEnteredText) {
    const trueInput = someEnteredText.value
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('/', '&#47;')
        .replaceAll('\\', '&#92;')
    return trueInput
}

export const addCommentButton = document.querySelector('[data-js-add-button]')

addCommentButton.addEventListener('click', () => {
    commentInput.classList.remove('main__input_empty')
    nameInput.classList.remove('main__input_empty')

    const name = correctInput(nameInput)
    const text = correctInput(commentInput)

    if (name === '' && text === '') {
        commentInput.classList.add('main__input_empty')
        nameInput.classList.add('main__input_empty')
    }

    if (name === '') {
        nameInput.classList.add('main__input_empty')
    }

    if (text === '') {
        commentInput.classList.add('main__input_empty')
    }

    const addingCommentinformation = document.querySelector(
        '[data-js-comment-adding-info]',
    )
    const formContainer = document.querySelector('[data-js-add-form-container]')

    addingCommentinformation.style.display = 'block'
    formContainer.style.visibility = 'hidden'

    // const addedСomment = {
    //     text: text,
    //     name: name,
    // }

    async function getmainPromise() {
        const mainPromise = await fetch(
            'https://wedev-api.sky.pro/api/v1/golubev-nikita/comments',
            {
                method: 'POST',
                body: JSON.stringify({
                    text,
                    name,
                    forceError: true,
                }),
            },
        )

        return mainPromise
    }

    async function getCorrectStatus() {
        try {
            let resultOfRequest = await getmainPromise()

            while (resultOfRequest.status === 500) {
                resultOfRequest = await getmainPromise()
            }

            try {
                if (resultOfRequest.status === 400) {
                    throw new Error(
                        'имя автора / текст комментария короче 3 символов или вообще не написаны',
                    )
                }
            } catch (error) {
                const textOfError = new String(error)
                textOfError.includes('TypeError: Failed to fetch')
                    ? alert(`Ошибка: проверьте интернет соединение`)
                    : alert(`Ошибка: ${error.message}`)

                nameInput.innerHTML = name
                commentInput.innerHTML = text

                addingCommentinformation.style.display = 'none'
                formContainer.style.visibility = 'visible'
            }

            if (resultOfRequest.ok) {
                apiRequest().then((response) => {
                    newContentOfArray(response.comments)

                    commentInput.value = ''
                    nameInput.value = ''
                    addingCommentinformation.style.display = 'none'
                    formContainer.style.visibility = 'visible'

                    commentRender()
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

    getCorrectStatus()
})
