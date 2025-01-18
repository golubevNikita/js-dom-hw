import { commentsArray } from './commentsInfoArr.js'
import { copyTextAndNameComment } from './inputProcessingFunctions.js'
import { delay } from './apiImitation.js'

export function correctedData(dataString = new Date()) {
    const newDateObject = new Date(dataString)

    const correctedYear = String(newDateObject.getFullYear())
        .split('')
        .slice(-2)
        .join('')

    return `${newDateObject.getDate()}.${newDateObject.getMonth() + 1}.${correctedYear}
  ${newDateObject.getHours()}:${newDateObject.getMinutes()}`
}

export function renderCommentEl(itemEl, indexEL) {
    return `<li class="comment" data-js-comment-el-index="${indexEL}">
    <div class="comment-header">
      <div>${itemEl.author.name}</div>
      <div>${correctedData(itemEl.date)}</div>
    </div>
    <div class="comment-body">
      <div data-js-text-area data-js-area-index="${indexEL}"
      class="comment-text">${itemEl.text}</div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${itemEl.likes}</span>
        <button data-js-like-button data-js-button-index="${indexEL}"
        class="like-button${itemEl.isLiked ? ' -active-like' : ''}"></button>
      </div>
    </div>
  </li>`
}

export const commentContainer = document.querySelector(
    '[data-js-comment-container]',
)

export function commentRender() {
    const commentsHtml = commentsArray
        .map((item, index) => renderCommentEl(item, index))
        .join('')

    commentContainer.innerHTML = commentsHtml

    canILike()
    copyTextAndNameComment()
}

function canILike() {
    const commentLikeButtons = document.querySelectorAll(
        '[data-js-like-button]',
    )

    for (const commentLikeButtonEL of commentLikeButtons) {
        commentLikeButtonEL.addEventListener('click', () => {
            const likeIndex = commentLikeButtonEL.dataset.jsButtonIndex
            const pushedButton = document.querySelector(
                `[data-js-button-index="${likeIndex}"]`,
            )

            if (commentsArray[likeIndex].isLiked) {
                pushedButton.classList.add('loading-like')
                pushedButton.disabled = true

                delay(1000).then(() => {
                    commentsArray[likeIndex].isLiked = false
                    commentsArray[likeIndex].likes -= 1
                    commentRender()
                })
            } else {
                pushedButton.classList.add('loading-like')
                pushedButton.disabled = true

                delay(1000).then(() => {
                    commentsArray[likeIndex].isLiked = true
                    commentsArray[likeIndex].likes += 1
                    commentRender()
                })
            }
        })
    }
}
