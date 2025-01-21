import { commentsArray, newContentOfArray } from './commentsInfoArr.js'
import { commentRender } from './renderCommentsFunctions.js'
import { apiRequest } from './apiImitation.js'

export const commentInput = document.querySelector('[data-js-comment-input]')
export const nameInput = document.querySelector('[data-js-name-input]')

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

    if (commentInput.value.length <= 3 || nameInput.value.length <= 3) {
        commentInput.classList.add('main__input_empty')
        nameInput.classList.add('main__input_empty')
        alert('Имя или текст короче 3 символов')
        return
    }

    const addingCommentinformation = document.querySelector(
        '[data-js-comment-adding-info]',
    )
    const formContainer = document.querySelector('[data-js-add-form-container]')

    addingCommentinformation.style.display = 'block'
    formContainer.style.visibility = 'hidden'

    const addedСomment = {
        text: correctInput(commentInput),
        name: correctInput(nameInput),
    }

    fetch('https://wedev-api.sky.pro/api/v1/golubev-nikita/comments', {
        method: 'POST',
        body: JSON.stringify(addedСomment),
    })
        .then(() =>
            apiRequest(
                'https://wedev-api.sky.pro/api/v1/golubev-nikita/comments',
            ),
        )
        .then((response) => {
            newContentOfArray(response)

            commentInput.value = ''
            nameInput.value = ''
            addingCommentinformation.style.display = 'none'
            formContainer.style.visibility = 'visible'

            commentRender()
        })
})
