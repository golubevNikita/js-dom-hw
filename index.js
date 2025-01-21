import { commentRender } from './modules/renderCommentsFunctions.js'
import { newContentOfArray } from './modules/commentsInfoArr.js'
import { apiRequest } from './modules/apiImitation.js'

const commentsRenderingInfo = document.querySelector(
    '[data-js-comments-rendering-info]',
)

apiRequest('https://wedev-api.sky.pro/api/v1/golubev-nikita/comments').then(
    (response) => {
        commentsRenderingInfo.remove()
        newContentOfArray(response)
        commentRender()
    },
)
