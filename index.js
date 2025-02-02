import { commentRender, canILike } from './modules/renderCommentsFunctions.js'
import { newContentOfArray } from './modules/commentsInfoArr.js'
import { getListOfComments, isAlreadyAuth } from './modules/apiMainFunctions.js'
import { renderRegistrationForm } from './modules/renderRegistrationForm.js'
import { copyTextAndNameComment } from './modules/inputProcessingFunctions.js'
import {
    renderAuthorisationForm,
    renderCommentForm,
} from './modules/renderContent.js'

const commentsRenderingInfo = document.querySelector(
    '[data-js-comments-rendering-info]',
)

getListOfComments().then((response) => {
    commentsRenderingInfo.remove()
    newContentOfArray(response.comments)
    commentRender()

    try {
        isAlreadyAuth(
            JSON.parse(localStorage.getItem('localUser')).login,
            JSON.parse(localStorage.getItem('localUser')).password,
        )

        renderCommentForm()
        canILike()
        copyTextAndNameComment()
    } catch (error) {
        const textOfError = new String(error)
        textOfError.includes('TypeError: Failed to fetch')
            ? console.log(`Ошибка: проверьте интернет соединение`)
            : console.log(`Ошибка: ${error.message}`)

        renderAuthorisationForm()
        renderRegistrationForm()
    }
})
