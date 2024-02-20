document.getElementById("password-caption").addEventListener("click", function (event) {
    event.preventDefault();

    // changing the type of the target element
    const input = document.querySelector(this.getAttribute("href"));
    input.type = "password" === input.type ? "text" : "password";

    const eye = this.children[0];
    if (eye.classList.contains("bi-eye"))
        eye.classList.replace("bi-eye", "bi-eye-slash");
    else eye.classList.replace("bi-eye-slash", "bi-eye");
});

function passwordValidate() {
    document.getElementById("password").checkValidity()
        ? (document.getElementById("password-error").style.display = "none")
        : (document.getElementById("password-error").style.display = "block");
}
