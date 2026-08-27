const singlePost =
    document.getElementById("singlePost");



const urlParams =
    new URLSearchParams(
        window.location.search
    );


const postId =
    urlParams.get("id");



async function loadSinglePost() {

    if (!postId) {

        singlePost.innerHTML = `
            <p>
                Post not found.
            </p>
        `;

        return;
    }


    try {

        const data =
            await apiRequest(
                `/posts/${postId}`
            );


        const post =
            data.post;


        displayPost(post);


        loadComments(postId);


    } catch (error) {

        console.error(error);


        singlePost.innerHTML = `

            <div class="post">

                <p>
                    Failed to load post.
                </p>

            </div>

        `;
    }
}


function displayPost(post) {

    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    const currentUserId =
        currentUser
            ? currentUser._id ||
              currentUser.id
            : null;


    const isLiked =
        currentUserId &&
        post.likes.some(
            userId =>
                userId.toString() ===
                currentUserId.toString()
        );


    const authorId =
        post.author?._id;


    const authorName =
        post.author?.username ||
        "Unknown User";


    const authorPicture =
        post.author?.profilePicture ||
        "https://i.pravatar.cc/150";


    singlePost.innerHTML = `

        <div class="post">


            <!-- AUTHOR -->

            <div
                class="post-author"
                data-user-id="${authorId}"
                style="cursor:pointer;"
            >

                <img
                    src="${authorPicture}"
                    alt="Profile picture"
                    class="post-author-picture"
                >

                <strong>
                    ${authorName}
                </strong>

            </div>


            <!-- CONTENT -->

            <div class="post-content">

                <p>
                    ${post.content}
                </p>

            </div>


            ${
                post.image
                    ? `

                        <img
                            class="post-image"
                            src="${post.image}"
                            alt="Post image"
                        >

                    `
                    : ""
            }


            <!-- ACTIONS -->

            <div class="post-actions">


                <button
                    id="likeBtn"
                    class="like-btn ${
                        isLiked
                            ? "liked"
                            : ""
                    }"
                >

                    ❤️

                    <span id="likeCount">
                        ${post.likes.length}
                    </span>

                </button>


            </div>


            <!-- COMMENTS -->

            <div class="comments-section">

                <h3>
                    Comments
                </h3>


                <div id="commentsList">

                    Loading comments...

                </div>


                <form id="commentForm">

                    <input
                        type="text"
                        id="commentInput"
                        placeholder="Write a comment..."
                        required
                    >


                    <button type="submit">
                        Comment
                    </button>

                </form>

            </div>


        </div>

    `;


      

    const authorElement =
        document.querySelector(
            "[data-user-id]"
        );


    if (authorElement) {

        authorElement.addEventListener(
            "click",
            () => {

                window.location.href =
                    `profile.html?id=${authorId}`;

            }
        );
    }


      

    const likeBtn =
        document.getElementById(
            "likeBtn"
        );


    likeBtn.addEventListener(
        "click",
        handleLike
    );


      

    const commentForm =
        document.getElementById(
            "commentForm"
        );


    commentForm.addEventListener(
        "submit",
        handleComment
    );
}


async function handleLike(post) {

    try {

        const data = await apiRequest(
            `/posts/${post._id}/like`,
            {
                method: "POST"
            }
        );


 
        const likesCount =
            data.likesCount || 0;


        const liked =
            data.liked === true;


 
        const likeButton =
            document.getElementById(
                "modalLikeBtn"
            );


        const likeCount =
            document.getElementById(
                "modalLikeCount"
            );


        if (likeButton) {

            if (liked) {

                likeButton.classList.add(
                    "liked"
                );

                likeButton.innerHTML = `
                    ❤️
                    <span id="modalLikeCount">
                        ${likesCount}
                    </span>
                    Like
                `;

            } else {

                likeButton.classList.remove(
                    "liked"
                );

                likeButton.innerHTML = `
                    ♡
                    <span id="modalLikeCount">
                        ${likesCount}
                    </span>
                    Like
                `;

            }

        }


 
        if (Array.isArray(post.likes)) {

            if (liked) {

                if (
                    !post.likes.some(
                        id =>
                            (id._id || id).toString() ===
                            currentUser._id.toString()
                    )
                ) {

                    post.likes.push(
                        currentUser._id
                    );

                }

            } else {

                post.likes =
                    post.likes.filter(
                        id =>
                            (id._id || id).toString() !==
                            currentUser._id.toString()
                    );

            }

        }


    } catch (error) {

        console.error(
            "Like error:",
            error
        );


        alert(
            error.message ||
            "Unable to like post"
        );

    }

}


async function loadComments(id) {

    try {

        const data =
            await apiRequest(
                `/comments/${id}`
            );


        const commentsList =
            document.getElementById(
                "commentsList"
            );


        commentsList.innerHTML = "";


        if (
            !data.comments ||
            data.comments.length === 0
        ) {

            commentsList.innerHTML = `
                <p>
                    No comments yet.
                </p>
            `;

            return;
        }


        data.comments.forEach(
            comment => {

                const commentDiv =
                    document.createElement(
                        "div"
                    );


                commentDiv.className =
                    "comment";


                const username =
                    comment.author?.username ||
                    "Unknown User";


                commentDiv.innerHTML = `

                    <strong>
                        ${username}
                    </strong>

                    <p>
                        ${comment.content}
                    </p>

                `;


                commentsList.appendChild(
                    commentDiv
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to load comments:",
            error
        );
    }
}


async function handleComment(event) {

    event.preventDefault();


    const input =
        document.getElementById(
            "commentInput"
        );


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    try {

        await apiRequest(
            `/comments/${postId}`,
            {
                method: "POST",

                body: JSON.stringify({
                    content: text
                })
            }
        );


        input.value = "";


        await loadComments(
            postId
        );


    } catch (error) {

        alert(
            error.message
        );
    }
}



loadSinglePost();