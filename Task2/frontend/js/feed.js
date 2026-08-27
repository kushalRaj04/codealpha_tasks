const currentUser =
    JSON.parse(localStorage.getItem("user"));

const currentUserId =
    currentUser
        ? currentUser._id || currentUser.id
        : null;

const postsContainer =
    document.getElementById("postsContainer");


    const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


async function loadCurrentUser() {

    try {

        const data =
            await apiRequest("/users/profile");

        const user = data.user;

        const sidebarUsername =
            document.getElementById("sidebarUsername");

        const sidebarProfilePicture =
            document.getElementById("sidebarProfilePicture");

        if (sidebarUsername) {

            sidebarUsername.textContent =
                user.username || "User";
        }

        if (sidebarProfilePicture) {

            sidebarProfilePicture.src =
                user.profilePicture ||
                "https://i.pravatar.cc/150";
        }

    } catch (error) {

        console.error(
            "Failed to load current user:",
            error
        );
    }
}


async function loadPosts() {

    try {

        postsContainer.innerHTML =
            "<p>Loading posts...</p>";


        const data =
            await apiRequest("/posts");


        postsContainer.innerHTML = "";


        if (!data.posts || data.posts.length === 0) {

            postsContainer.innerHTML = `

                <div class="empty-message">

                    <p>No posts yet.</p>

                    <p>
                        Be the first person
                        to create a post!
                    </p>

                </div>

            `;

            return;
        }


        data.posts.forEach(post => {

            const postElement =
                createPostElement(post);

            postsContainer.appendChild(
                postElement
            );

        });

    } catch (error) {

        console.error(error);

        postsContainer.innerHTML = `

            <p class="error-message">
                Failed to load posts.
            </p>

        `;
    }
}



function createPostElement(post) {

    const postDiv =
        document.createElement("div");

    postDiv.className = "post";


    const authorId =
        post.author?._id;


    const authorName =
        post.author?.username ||
        "Unknown User";


    const authorProfilePicture =
        post.author?.profilePicture ||
        "https://i.pravatar.cc/150";


    const isLiked =
        currentUserId &&
        post.likes.some(
            userId =>
                userId.toString() ===
                currentUserId.toString()
        );



    postDiv.innerHTML = `

        <!-- AUTHOR -->

        <div class="post-author">

            <img
                src="${authorProfilePicture}"
                alt="Profile picture"
                class="post-author-picture"
                data-user-id="${authorId}"
            >

            <strong
                class="post-author-name"
                data-user-id="${authorId}"
            >
                ${authorName}
            </strong>

        </div>


        <!-- POST CONTENT -->

        <div
            class="post-click-area"
            data-post-id="${post._id}"
        >

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

        </div>


        <!-- POST ACTIONS -->

        <div class="post-actions">


            <!-- LIKE -->

            <button
                class="like-btn ${isLiked ? "liked" : ""}"
                data-id="${post._id}"
            >

                ❤️

                <span class="like-count">
                    ${post.likes.length}
                </span>

            </button>


            <!-- COMMENTS -->

            <button
                class="open-post-btn"
                data-post-id="${post._id}"
            >

                💬 Comments

            </button>

        </div>

    `;


    return postDiv;
}



document.addEventListener(
    "click",
    event => {

        const postArea =
            event.target.closest(
                ".post-click-area"
            );


        if (!postArea) {
            return;
        }


        const postId =
            postArea.dataset.postId;


        if (!postId) {
            return;
        }


        window.location.href =
            `post.html?id=${postId}`;

    }
);


document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".open-post-btn"
            );


        if (!button) {
            return;
        }


        const postId =
            button.dataset.postId;


        window.location.href =
            `post.html?id=${postId}`;

    }
);



document.addEventListener(
    "click",
    event => {

        const profileElement =
            event.target.closest(
                "[data-user-id]"
            );


        if (!profileElement) {
            return;
        }


        const userId =
            profileElement.dataset.userId;


        if (!userId) {
            return;
        }


        event.stopPropagation();


        window.location.href =
            `profile.html?id=${userId}`;

    }
);



document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".like-btn"
            );


        if (!button) {
            return;
        }


        event.stopPropagation();


        const postId =
            button.dataset.id;


        const likeCount =
            button.querySelector(
                ".like-count"
            );


        try {

            if (
                button.classList.contains(
                    "liked"
                )
            ) {

                const data =
                    await apiRequest(
                        `/posts/${postId}/like`,
                        {
                            method: "DELETE"
                        }
                    );


                button.classList.remove(
                    "liked"
                );


                likeCount.textContent =
                    data.likesCount;

            } else {

                const data =
                    await apiRequest(
                        `/posts/${postId}/like`,
                        {
                            method: "POST"
                        }
                    );


                button.classList.add(
                    "liked"
                );


                likeCount.textContent =
                    data.likesCount;
            }

        } catch (error) {

            alert(
                error.message
            );
        }

    }
);



if (postsContainer) {

    loadCurrentUser();

    loadPosts();
}