import { commentsArray, newContentOfArray } from './commentsInfoArr.js'
import { getListOfComments, getInfoAboutLike } from './apiMainFunctions.js'
import { copyTextAndNameComment } from './inputProcessingFunctions.js'

export function correctedData(dataString = new Date()) {
    const newDateObject = new Date(dataString)

    const dateOptions = {
        hour: 'numeric',
        minute: 'numeric',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }

    const correctedDate = newDateObject.toLocaleDateString('ru-RU', dateOptions)

    return correctedDate
}

export const commentContainer = document.querySelector(
    '[data-js-comment-container]',
)

export function commentRender() {
    const commentsHtml = commentsArray
        .map((item, index) => renderCommentEl(item, index))
        .join('')

    commentContainer.innerHTML = commentsHtml
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
        class="like-button${itemEl.isLiked ? ' active-like' : ''}"></button>
      </div>
    </div>
  </li>`
}

export async function commentAuthRender() {
    await getListOfComments()
        .then((response) => {
            newContentOfArray(response.comments)
        })
        .then(() => {
            Promise.all(
                commentsArray.map(async function (item, index) {
                    return renderCommentElForAuthUsers(item, index)
                }),
            )
                .then((response) => {
                    commentContainer.innerHTML = response.join('')
                })
                .then(() => {
                    commentRender()
                    canILike()
                    copyTextAndNameComment()
                })
        })
}

export async function renderCommentElForAuthUsers(itemEl, indexEL) {
    let surveyedEl
    await getInfoAboutLike(itemEl.id).then((response) => {
        itemEl.isLiked = !response.result.isLiked
        getInfoAboutLike(itemEl.id)

        surveyedEl = `<li class="comment" data-js-comment-el-index="${indexEL}">
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
            class="like-button${itemEl.isLiked ? ' active-like' : ''}"></button>
          </div>
        </div>
      </li>`
    })

    return surveyedEl
}

export function canILike() {
    const commentLikeButtons = document.querySelectorAll(
        '[data-js-like-button]',
    )

    for (const commentLikeButtonEL of commentLikeButtons) {
        commentLikeButtonEL.addEventListener('click', () => {
            const likeIndex = commentLikeButtonEL.dataset.jsButtonIndex
            const searchedComment = commentsArray[likeIndex].id

            const pushedButton = document.querySelector(
                `[data-js-button-index="${likeIndex}"]`,
            )

            console.log(pushedButton)

            pushedButton.disabled = true
            pushedButton.classList.add('loading-like')

            async function changeLikeInfo() {
                const likeInfoResponse = await getInfoAboutLike(
                    searchedComment,
                ).then((data) => data)

                getListOfComments().then((response) => {
                    commentsArray[likeIndex].isLiked =
                        likeInfoResponse.result.isLiked

                    commentsArray[likeIndex].likes = response.comments.find(
                        (commentsEl) => commentsEl.id === searchedComment,
                    ).likes

                    commentAuthRender()
                })
            }

            changeLikeInfo()
        })
    }
}
