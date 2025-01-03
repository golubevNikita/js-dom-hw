import { commentsArray } from './commentsInfoArr.js'
import { commentContainer } from '../index.js'
import { copyTextAndNameComment } from './inputProcessingFunctions.js'

function renderCommentEl(itemEl, indexEL) {
    return `<li class="comment" data-js-comment-el-index="${indexEL}">
    <div class="comment-header">
      <div>${itemEl.commentHeader.himself}</div>
      <div>${itemEl.commentHeader.commentDateAndTime}</div>
    </div>
    <div class="comment-body">
      <div data-js-text-area data-js-area-index="${indexEL}"
      class="comment-text">${itemEl.commentBody.commentText}</div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${itemEl.commentFooter.likes.likesCounter}</span>
        <button data-js-like-button data-js-button-index="${indexEL}"
        class="like-button${
            itemEl.commentFooter.likes.likeButton ? ' -active-like' : ''
        }"></button>
      </div>
    </div>
  </li>`
}

function canILike() {
    const commentLikeButtons = document.querySelectorAll(
        '[data-js-like-button]',
    )
    for (const commentLikeButtonEL of commentLikeButtons) {
        commentLikeButtonEL.addEventListener('click', () => {
            const likeIndex = commentLikeButtonEL.dataset.jsButtonIndex

            if (commentsArray[likeIndex].commentFooter.likes.likeButton) {
                commentsArray[likeIndex].commentFooter.likes.likeButton = false
                commentsArray[likeIndex].commentFooter.likes.likesCounter -= 1
            } else {
                commentsArray[likeIndex].commentFooter.likes.likeButton = true
                commentsArray[likeIndex].commentFooter.likes.likesCounter += 1
            }

            commentRender()
        })
    }
}

export function commentRender() {
    const commentsHtml = commentsArray
        .map((item, index) => renderCommentEl(item, index))
        .join('')

    commentContainer.innerHTML = commentsHtml

    canILike()
    copyTextAndNameComment()
}
