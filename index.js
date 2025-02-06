import { newContentOfArray } from './modules/commentsInfoArr.js'
import { regButtonRender } from './modules/renderRegistrationForm.js'

import {
    commentsRenderingInfo,
    getListOfComments,
    isAlreadyAuth,
} from './modules/apiMainFunctions.js'

import {
    renderAuthorisationForm,
    renderCommentForm,
} from './modules/renderContent.js'

import {
    commentRender,
    commentAuthRender,
} from './modules/renderCommentsFunctions.js'

getListOfComments().then((response) => {
    newContentOfArray(response.comments)
    commentRender()
    commentsRenderingInfo.style.display = 'none'

    try {
        isAlreadyAuth(
            JSON.parse(localStorage.getItem('localUser')).login,
            JSON.parse(localStorage.getItem('localUser')).password,
        )

        commentAuthRender()
        renderCommentForm()
    } catch (error) {
        const textOfError = new String(error)
        textOfError.includes('TypeError: Failed to fetch')
            ? console.log(`Ошибка: проверьте интернет соединение`)
            : console.log(
                  `Ошибка просто справочно сообщает о том, что пользователь не зарегистрирован: ${error.message}`,
              )

        renderAuthorisationForm()
        regButtonRender()
    }
})
