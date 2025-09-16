
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var loginButton = document.getElementById("loginButton");

//Handle login validation
function validateInputs() {
    var username = usernameInput.value.trim();
    var password = passwordInput.value;

    //Checking if username and password field are valid
    if (username.length > 0 && password.length >= 6) {
        loginButton.disabled = false;
        loginButton.style.cursor = "pointer";
    } else {
        loginButton.disabled = true;
        loginButton.style.cursor = "not-allowed";
    }
}

usernameInput.addEventListener("input", validateInputs);
passwordInput.addEventListener("input", validateInputs);

//Handle login redirect
function loginClick() {
    var username = usernameInput.value.trim();
    var password = passwordInput.value;

    if (username.length > 0 && password.length >= 6) {
        //Make the redirect dynamic(relative to our corrent URL)
        window.location.href = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '') + "feed.html";
    }
}
loginButton.addEventListener("click", loginClick);