const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const message =
    document.getElementById("message");

forgotPasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.textContent =
                    "Email found. You can reset your password.";

            } else {

                message.textContent =
                    data.message;
            }

        } catch (error) {

            console.error("Forgot Password Error:", error);

            message.textContent =
                "Cannot connect to server.";
        }
    }
);