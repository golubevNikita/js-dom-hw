
const commentInput = document.querySelector('[data-js-comment-input]');
const addCommentButton = document.querySelector('[data-js-add-button]');

const commentContainer = document.querySelector('[data-js-comment-container]');
const commentText = document.querySelector('[data-js-text-area]');
const commentLikeCounter = document.querySelector('[data-js-like-counter]');

const commentsArray = [
    {text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        likeState: {
            isLike: false,
            likeCount: 10,
        }
    },

    {text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, praesentium?',
        likeState: {
            isLike: true,
            likeCount: 3,
        }
    },

    {text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quas earum obcaecati molestiae?',
        likeState: {
            isLike: false,
            likeCount: 8,
        }
    },
];

function renderCommentEl(itemEl, indexEL) {
    return `<div class="main__comment" data-js-comment-el-index="${indexEL}">
    <p class="main__text-comment" data-js-text-area>${itemEl.text}</p>
    <div class="main__like-container">
    <input type="checkbox" ${itemEl.likeState.isLike 
        ? "checked='true'"
        : ""}
    class="main__like-button${itemEl.likeState.isLike === true 
        ? " main__like-button_color-on"
        : " main__like-button_color-off"}" data-js-like-button data-js-button-index="${indexEL}">
        </input>
    <span class="main__like-counter" data-js-like-counter>${itemEl.likeState.likeCount}</span>
    </div>
    </div>`;
};

function canILike() {
    const commentLikeButtons = document.querySelectorAll('[data-js-like-button]');
    for (const commentLikeButtonEL of commentLikeButtons) {
        commentLikeButtonEL.addEventListener("click", () => {

            const likeIndex = commentLikeButtonEL.dataset.jsButtonIndex;
            const htmlLikeEL = document.querySelector(`[data-js-button-index="${likeIndex}"]`);

            if (htmlLikeEL.getAttribute('checked')) {
                htmlLikeEL.removeAttribute('checked');
                commentsArray[likeIndex].likeState.isLike = false;
                commentsArray[likeIndex].likeState.likeCount -= 1;
            } else {
                htmlLikeEL.setAttribute('checked', 'true');
                commentsArray[likeIndex].likeState.isLike = true;
                commentsArray[likeIndex].likeState.likeCount += 1;
            };

            commentRender();
        });
    };
};

function commentRender() {
    const commentsHtml = commentsArray.map((item, index) => renderCommentEl(item, index)).join("");
    
    commentContainer.innerHTML = commentsHtml;
    
    canILike();
}

commentRender();

addCommentButton.addEventListener("click", () => {
    commentInput.classList.remove("main__input_empty");
    
    if (commentInput.value === "") {
        commentInput.classList.add("main__input_empty");
        return;
    };
    
    const newCommentsArray = { 
        text: commentInput.value,
        likeState: {
            isLike: false,
            likeCount: 0,
        },
    };
  
    commentsArray.push(newCommentsArray);
    commentInput.value = "";
    
    commentRender();
});
