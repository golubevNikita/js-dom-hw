import { commentsArray } from './commentsInfoArr.js'

export function copyTextAndNameComment() {
    // const nameInput = document.querySelector('[data-js-name-input]')
    const commentInput = document.querySelector('[data-js-comment-input]')
    const textsOfComments = document.querySelectorAll(['[data-js-text-area'])
    for (const textCommentEl of textsOfComments) {
        textCommentEl.addEventListener('click', () => {
            const textAreaIndex = textCommentEl.dataset.jsAreaIndex

            commentInput.value = `---> ${commentsArray[textAreaIndex].text}`
            // nameInput.value = `from: ${commentsArray[textAreaIndex].author.name}`
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

export function emptyCheck(firstInput, secondInput) {
    if (firstInput.value === '' && secondInput.value === '') {
        firstInput.classList.add('main__input_empty')
        secondInput.classList.add('main__input_empty')
    }

    if (firstInput.value === '') {
        firstInput.classList.add('main__input_empty')
    }

    if (secondInput.value === '') {
        secondInput.classList.add('main__input_empty')
    }
}
