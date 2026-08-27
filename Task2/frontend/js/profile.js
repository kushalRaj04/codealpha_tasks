let currentProfile = null;
let currentUser = null;
let profilePosts = [];
let selectedPost = null;


 
document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadCurrentUser();

        await loadProfile();

        setupEditProfile();

        setupModal();

        setupLogout();

    } catch (error) {

        console.error("Profile page error:", error);

    }

});


 
async function loadCurrentUser() {

    try {

        const data = await apiRequest("/users/profile");

        currentUser = data.user;

    } catch (error) {

        console.error("Unable to load current user:", error);

    }

}


 
async function loadProfile() {

    try {

        const urlParams =
            new URLSearchParams(window.location.search);

        const profileUserId =
            urlParams.get("id");


        let data;


 
        if (profileUserId) {

            data = await apiRequest(
                `/users/${profileUserId}`
            );

        }

 
        else {

            data = await apiRequest(
                "/users/profile"
            );

        }


        currentProfile = data.user;


        displayProfile(currentProfile);


        await loadUserPosts(
            currentProfile._id
        );


        setupFollowButton();


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        const username =
            document.getElementById("username");

        const bio =
            document.getElementById("bio");


        if (username) {

            username.textContent =
                "Unable to load profile";

        }


        if (bio) {

            bio.textContent =
                error.message;

        }

    }

}


 
function displayProfile(user) {

    const username =
        document.getElementById("username");

    const bio =
        document.getElementById("bio");

    const profilePicture =
        document.getElementById("profilePicture");

    const followersCount =
        document.getElementById("followersCount");

    const followingCount =
        document.getElementById("followingCount");


    if (username) {

        username.textContent =
            user.username || "User";

    }


    if (bio) {

        bio.textContent =
            user.bio || "No bio added yet.";

    }


    if (profilePicture) {

        profilePicture.src =
            user.profilePicture ||
            "https://i.pravatar.cc/150";

    }


    if (followersCount) {

        followersCount.textContent =
            user.followers
                ? user.followers.length
                : 0;

    }


    if (followingCount) {

        followingCount.textContent =
            user.following
                ? user.following.length
                : 0;

    }


 
    const editButton =
        document.getElementById("editProfileBtn");


    const isOwnProfile =
        currentUser &&
        currentProfile &&
        currentUser._id.toString() ===
        currentProfile._id.toString();


    if (editButton) {

        if (isOwnProfile) {

            editButton.style.display =
                "inline-block";

        } else {

            editButton.style.display =
                "none";

        }

    }

}


 
function setupFollowButton() {

    const followBtn =
        document.getElementById("followBtn");


    if (!followBtn) return;


    if (!currentUser || !currentProfile) {

        followBtn.style.display =
            "none";

        return;

    }


    const isOwnProfile =
        currentUser._id.toString() ===
        currentProfile._id.toString();


 
    if (isOwnProfile) {

        followBtn.style.display =
            "none";

        return;

    }


 
    followBtn.style.display =
        "inline-block";


    updateFollowButton();


    followBtn.onclick =
        handleFollowToggle;

}


 
function isFollowing() {

    if (!currentUser ||
        !currentProfile) {

        return false;

    }


    const following =
        currentUser.following || [];


    return following.some(
        userId =>
            userId.toString() ===
            currentProfile._id.toString()
    );

}


 
function updateFollowButton() {

    const followBtn =
        document.getElementById("followBtn");


    if (!followBtn) return;


    if (isFollowing()) {

        followBtn.textContent =
            "Unfollow";

        followBtn.classList.add(
            "following"
        );

    } else {

        followBtn.textContent =
            "Follow";

        followBtn.classList.remove(
            "following"
        );

    }

}


 
async function handleFollowToggle() {

    const followBtn =
        document.getElementById("followBtn");


    if (!followBtn ||
        !currentProfile) return;


    try {

        followBtn.disabled = true;


 
        if (isFollowing()) {

            await apiRequest(
                `/users/${currentProfile._id}/follow`,
                {
                    method: "DELETE"
                }
            );


            currentUser.following =
                (currentUser.following || [])
                    .filter(
                        id =>
                            id.toString() !==
                            currentProfile._id.toString()
                    );


            currentProfile.followers =
                (currentProfile.followers || [])
                    .filter(
                        id =>
                            id.toString() !==
                            currentUser._id.toString()
                    );


        }

 
        else {

            await apiRequest(
                `/users/${currentProfile._id}/follow`,
                {
                    method: "POST"
                }
            );


            if (!currentUser.following) {

                currentUser.following = [];

            }


            currentUser.following.push(
                currentProfile._id
            );


            if (!currentProfile.followers) {

                currentProfile.followers = [];

            }


            currentProfile.followers.push(
                currentUser._id
            );

        }


        updateFollowButton();


        const followersCount =
            document.getElementById(
                "followersCount"
            );


        if (followersCount) {

            followersCount.textContent =
                currentProfile.followers.length;

        }


    } catch (error) {

        console.error(
            "Follow/unfollow error:",
            error
        );


        alert(
            error.message ||
            "Unable to update follow status"
        );

    } finally {

        followBtn.disabled = false;

    }

}


 
async function loadUserPosts(userId) {

    const container = document.getElementById("profilePosts");

    if (!container) return;

    try {

        console.log("=================================");
        console.log("Loading posts for user:");
        console.log(userId);
        console.log("=================================");

        const data = await apiRequest(
            `/posts/user/${userId}`
        );

       console.log("Posts API response:");
console.log(JSON.stringify(data, null, 2));

        profilePosts = data.posts || [];

        const postCount = document.getElementById("postCount");

        if (postCount) {
            postCount.textContent = profilePosts.length;
        }

        displayUserPosts(profilePosts);

    } catch (error) {

        console.error("=================================");
        console.error("LOADING USER POSTS ERROR");
        console.error(error);
        console.error("Message:", error.message);
        console.error("=================================");

        container.innerHTML = `
            <div class="error-message">
                Unable to load posts.
            </div>
        `;
    }
}


 
function displayUserPosts(posts) {

    const container = document.getElementById("profilePosts");

    if (!container) return;


 
    if (!posts || posts.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                <p>No posts yet.</p>
            </div>
        `;

        return;
    }


 
    container.innerHTML = "";


 
    posts.forEach(post => {

        const card = document.createElement("article");

        card.className = "profile-post-card";

        card.dataset.postId = post._id;


        const content = escapeHtml(
            post.content || ""
        );


        const image = post.image
            ? `
                <img
                    src="${escapeAttribute(post.image)}"
                    class="profile-post-image"
                    alt="Post image"
                >
              `
            : "";


        const likes = Array.isArray(post.likes)
            ? post.likes.length
            : post.likesCount || 0;


        const comments = Array.isArray(post.comments)
            ? post.comments.length
            : post.commentsCount || 0;


        card.innerHTML = `

            <div class="profile-post-content">

                ${image}

                <div class="profile-post-text">

                    <p>
                        ${content}
                    </p>

                </div>

                <div class="profile-post-stats">

                    <span>
                        ❤️ ${likes}
                    </span>

                    <span>
                        💬 ${comments}
                    </span>

                </div>

            </div>

        `;


        
        card.addEventListener("click", () => {

            openPostModal(post);

        });


        container.appendChild(card);

    });

}

function setupModal() {

    const modal =
        document.getElementById(
            "postModal"
        );


    const closeButton =
        document.getElementById(
            "closePostModal"
        );


    if (!modal) return;


    // Close button

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePostModal
        );

    }


    // Click dark background

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closePostModal();

            }

        }
    );


    // ESC key

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closePostModal();

            }

        }
    );

}


 
function openPostModal(post) {

    const modal =
        document.getElementById(
            "postModal"
        );


    const container =
        document.getElementById(
            "singlePostContainer"
        );


    if (!modal || !container) return;


    selectedPost = post;


    const author =
        post.author || {};


    const username =
        author.username ||
        currentProfile?.username ||
        "User";


    const profilePicture =
        author.profilePicture ||
        currentProfile?.profilePicture ||
        "https://i.pravatar.cc/150";


    const content =
        escapeHtml(
            post.content || ""
        );


    const image =
        post.image
            ? `
                <img
                    src="${escapeAttribute(post.image)}"
                    class="modal-post-image"
                    alt="Post image"
                >
              `
            : "";


    const likes =
        Array.isArray(post.likes)
            ? post.likes.length
            : post.likesCount || 0;


    const comments =
        Array.isArray(post.comments)
            ? post.comments
            : [];


const liked =
    currentUser &&
    Array.isArray(post.likes) &&
    post.likes.some(
        id =>
            (id._id || id).toString() ===
            currentUser._id.toString()
    );


    container.innerHTML = `

        <div class="modal-post-author"
             data-author-id="${author._id || currentProfile?._id}">

            <img
                src="${escapeAttribute(profilePicture)}"
                alt="Profile"
            >

            <div>

                <strong>
                    ${escapeHtml(username)}
                </strong>

                <span>
                    View profile
                </span>

            </div>

        </div>


        <div class="modal-post-body">

            <p>
                ${content}
            </p>

            ${image}

        </div>


        <div class="modal-post-actions">

            <button
                class="modal-like-btn ${liked ? "liked" : ""}"
                id="modalLikeBtn"
            >
                ${liked ? "❤️" : "♡"}
                <span id="modalLikeCount">
                    ${likes}
                </span>
                Like
            </button>


            <span class="modal-comment-count">
                💬 ${comments.length}
                Comments
            </span>

        </div>


        <div class="modal-comments"
             id="modalComments">

            ${renderComments(comments)}

        </div>


        <form
            id="modalCommentForm"
            class="modal-comment-form"
        >

            <input
                id="modalCommentInput"
                type="text"
                placeholder="Add a comment..."
                required
            >

            <button type="submit">
                Post
            </button>

        </form>

    `;


 
    modal.classList.add("show");

    document.body.classList.add(
        "modal-open"
    );


 
    const likeButton =
        document.getElementById(
            "modalLikeBtn"
        );


    if (likeButton) {

        likeButton.addEventListener(
            "click",
            () => handleLike(post)
        );

    }


 
    const commentForm =
        document.getElementById(
            "modalCommentForm"
        );


    if (commentForm) {

        commentForm.addEventListener(
            "submit",
            event =>
                handleComment(
                    event,
                    post
                )
        );

    }


 
    const authorElement =
        document.querySelector(
            ".modal-post-author"
        );


    if (authorElement) {

        authorElement.addEventListener(
            "click",
            () => {

                const authorId =
                    authorElement.dataset.authorId;


                if (authorId) {

                    window.location.href =
                        `profile.html?id=${authorId}`;

                }

            }
        );

    }

}


 
function closePostModal() {

    const modal =
        document.getElementById(
            "postModal"
        );


    const container =
        document.getElementById(
            "singlePostContainer"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );


    if (container) {

        container.innerHTML = "";

    }


    selectedPost = null;

}


 
function renderComments(comments) {

    if (
        !comments ||
        comments.length === 0
    ) {

        return `
            <p class="no-comments">
                No comments yet. Be the first!
            </p>
        `;

    }


    return comments.map(comment => {

        const user =
            comment.user ||
            comment.author ||
            {};


        return `

            <div class="modal-comment">

                <strong>
                    ${escapeHtml(
                        user.username ||
                        "User"
                    )}
                </strong>

                <p>
                    ${escapeHtml(
                        comment.text ||
                        comment.content ||
                        ""
                    )}
                </p>

            </div>

        `;

    }).join("");

}


 
async function handleLike(post) {

    try {

       

        const data =
            await apiRequest(
                `/posts/${post._id}/like`,
                {
                    method: "POST"
                }
            );


        // Update returned post if backend sends it

        if (data.post) {

            post = data.post;

            selectedPost = data.post;

        }


        // Update UI

        const likeButton =
            document.getElementById(
                "modalLikeBtn"
            );


        const likeCount =
            document.getElementById(
                "modalLikeCount"
            );


        if (data.liked !== undefined) {

            if (data.liked) {

                likeButton.classList.add(
                    "liked"
                );

                likeButton.innerHTML =
                    `❤️ <span id="modalLikeCount">${data.likesCount || ""}</span> Like`;

            } else {

                likeButton.classList.remove(
                    "liked"
                );

                likeButton.innerHTML =
                    `♡ <span id="modalLikeCount">${data.likesCount || ""}</span> Like`;

            }

        } else {

           

            await refreshOpenedPost();

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


 
async function handleComment(
    event,
    post
) {

    event.preventDefault();


    const input =
        document.getElementById(
            "modalCommentInput"
        );


    const text =
        input.value.trim();


    if (!text) return;


    try {


        await apiRequest(
            `/posts/${post._id}/comments`,
            {
                method: "POST",

                body: JSON.stringify({
                    text: text
                })
            }
        );


        input.value = "";


        await refreshOpenedPost();


    } catch (error) {

        console.error(
            "Comment error:",
            error
        );


        alert(
            error.message ||
            "Unable to add comment"
        );

    }

}


 
async function refreshOpenedPost() {

    if (!selectedPost) return;


    try {

        const data =
            await apiRequest(
                `/posts/${selectedPost._id}`
            );


        if (data.post) {

            selectedPost =
                data.post;

            openPostModal(
                data.post
            );

        }

    } catch (error) {

        console.error(
            "Unable to refresh post:",
            error
        );

    }

}


 
function setupEditProfile() {

    const editButton =
        document.getElementById(
            "editProfileBtn"
        );


    const editSection =
        document.getElementById(
            "editProfileSection"
        );


    const cancelButton =
        document.getElementById(
            "cancelEditBtn"
        );


    const form =
        document.getElementById(
            "editProfileForm"
        );


    if (!editButton ||
        !editSection ||
        !form) {

        return;

    }


    editButton.addEventListener(
        "click",
        () => {

            document.getElementById(
                "editUsername"
            ).value =
                currentProfile?.username || "";


            document.getElementById(
                "editBio"
            ).value =
                currentProfile?.bio || "";


            document.getElementById(
                "editProfilePicture"
            ).value =
                currentProfile?.profilePicture || "";


            editSection.style.display =
                "block";

        }
    );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {

                editSection.style.display =
                    "none";

            }
        );

    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            try {

                const username =
                    document.getElementById(
                        "editUsername"
                    ).value.trim();


                const bio =
                    document.getElementById(
                        "editBio"
                    ).value.trim();


                const profilePicture =
                    document.getElementById(
                        "editProfilePicture"
                    ).value.trim();


                const data =
                    await apiRequest(
                        "/users/profile",
                        {
                            method: "PUT",

                            body: JSON.stringify({
                                username,
                                bio,
                                profilePicture
                            })
                        }
                    );


                currentProfile =
                    data.user;


                currentUser =
                    data.user;


                displayProfile(
                    currentProfile
                );


                editSection.style.display =
                    "none";


                alert(
                    "Profile updated successfully"
                );


            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to update profile"
                );

            }

        }
    );

}


 
function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) return;


    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "login.html";

        }
    );

}


 
function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}