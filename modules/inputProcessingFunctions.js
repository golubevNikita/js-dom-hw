import { commentsArray } from './commentsInfoArr.js'
import { commentInput, nameInput } from '../index.js'

export function copyTextAndNameComment() {
    const textsOfComments = document.querySelectorAll(['[data-js-text-area'])
    for (const textCommentEl of textsOfComments) {
        textCommentEl.addEventListener('click', () => {
            const textAreaIndex = textCommentEl.dataset.jsAreaIndex

            commentInput.value = `---> ${commentsArray[textAreaIndex].commentBody.commentText}`
            nameInput.value = `from: ${commentsArray[textAreaIndex].commentHeader.himself}`
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
