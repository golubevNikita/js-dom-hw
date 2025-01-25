import { commentRender } from './modules/renderCommentsFunctions.js'
import { newContentOfArray } from './modules/commentsInfoArr.js'
import { apiRequest } from './modules/apiImitation.js'

const commentsRenderingInfo = document.querySelector(
    '[data-js-comments-rendering-info]',
)

apiRequest().then((response) => {
    commentsRenderingInfo.remove()
    newContentOfArray(response.comments)
    commentRender()
})
