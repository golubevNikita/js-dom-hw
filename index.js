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

commentRender()

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

    commentsArray.push(newCommentsArray)

    commentInput.value = ''
    nameInput.value = ''

    commentRender()
})
