(() => {
    "use strict";

    // finding all the forms that we want to validate
    const forms = document.querySelectorAll(".validate-form");

    Array.from(forms).forEach((form) => {
        // adding an input event listener on all inputs
        Array.from(form).forEach((el) => {
            if (el.tagName === "INPUT")
                el.addEventListener("input", handleInput, false);
        });

        // adding a submit event on the form
        form.addEventListener(
            "submit",
            (event) => {
                // preventing submission
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");

                // removing the input event and any changes made by it
                Array.from(form).forEach((el) => {
                    el.removeEventListener("input", handleInput, false);
                    el.classList.remove("is-valid", "is-invalid");
                });
            },
            false
        );
    });
})();

// checks the validity of an input and adds the corresponding bootstrap class
function handleInput() {
    if (!this.form.className.includes("was-validated"))
        this.checkValidity()
            ? this.classList.replace("is-invalid", "is-valid") ||
              this.classList.add("is-valid")
            : this.classList.replace("is-valid", "is-invalid") ||
              this.classList.add("is-invalid");
}
