const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");


        try {

            const data = await apiRequest("/users/register", {
                method: "POST",

                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });


            message.textContent = data.message;

            message.style.color = "green";


            registerForm.reset();


            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);


        } catch (error) {

            message.textContent = error.message;

            message.style.color = "red";
        }

    });

}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        const message =
            document.getElementById("message");


        try {

            const data = await apiRequest("/users/login", {

                method: "POST",

                body: JSON.stringify({
                    email,
                    password
                })

            });


            // Save JWT
            localStorage.setItem(
                "token",
                data.token
            );


            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            message.textContent =
                "Login successful!";

            message.style.color =
                "green";


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 700);


        } catch (error) {

            message.textContent =
                error.message;

            message.style.color =
                "red";

        }

    });

}