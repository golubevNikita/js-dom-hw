export const nameInput = document.querySelector('[data-js-name-input]')
export const commentInput = document.querySelector('[data-js-comment-input]')
export const addCommentButton = document.querySelector('[data-js-add-button]')
export const commentContainer = document.querySelector(
    '[data-js-comment-container]',
)
export const commentText = document.querySelector('[data-js-text-area]')

import { commentsArray } from './modules/commentsInfoArr.js'
import { commentRender } from './modules/renderCommentsFunctions.js'
import { correctInput } from './modules/inputProcessingFunctions.js'
import { delay } from './modules/apiImitation.js'

const commentsRenderingInfo = document.querySelector(
    '[data-js-comments-rendering-info]',
)

delay(1000).then(() => {
    commentsRenderingInfo.remove()
    commentRender()
})

addCommentButton.addEventListener('click', () => {
    commentInput.classList.remove('main__input_empty')
    nameInput.classList.remove('main__input_empty')

    let newDateObject = new Date()
    const correctedYear = String(newDateObject.getFullYear())
        .split('')
        .slice(-2)
        .join('')

    const commentDate = `${newDateObject.getDate()}.${newDateObject.getMonth() + 1}.${correctedYear}
      ${newDateObject.getHours()}:${newDateObject.getMinutes()}`

    if (commentInput.value === '' && nameInput.value === '') {
        commentInput.classList.add('main__input_empty')
        nameInput.classList.add('main__input_empty')
        return
    }

    if (commentInput.value === '') {
        commentInput.classList.add('main__input_empty')

        return
    }

    if (nameInput.value === '') {
        nameInput.classList.add('main__input_empty')
        return
    }

    const newCommentsArray = {
        commentHeader: {
            himself: correctInput(nameInput),
            commentDateAndTime: commentDate,
        },

        commentBody: {
            commentText: correctInput(commentInput),
        },

        commentFooter: {
            likes: {
                likesCounter: 0,
                likeButton: false,
            },
        },
    }

    const addingCommentinformation = document.querySelector(
        '[data-js-comment-adding-info]',
    )

    const formContainer = document.querySelector('[data-js-add-form-container]')

    addingCommentinformation.style.display = 'block'
    formContainer.style.visibility = 'hidden'

    delay(1000).then(() => {
        commentsArray.push(newCommentsArray)

        commentInput.value = ''
        nameInput.value = ''
        addingCommentinformation.style.display = 'none'
        formContainer.style.visibility = 'visible'

        commentRender()
    })
})
