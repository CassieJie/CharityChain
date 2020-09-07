import 'bootstrap/dist/css/bootstrap.min.css';
require('./styles/login.less');

import axios from "axios";

let loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
let spinner = loginBtn.getElementsByTagName('span')[0] as HTMLSpanElement;
let loginSpan = loginBtn.getElementsByTagName('span')[1] as HTMLSpanElement;
let usernameInput = document.getElementById('username') as HTMLInputElement;
let passwordInput = document.getElementById('password') as HTMLInputElement;

loginBtn.onclick = function () {
    let username = usernameInput.value.trim();
    let password = passwordInput.value;
    if (username && password) {
        let originalText = loginSpan.innerHTML;
        loginSpan.innerHTML = 'Verifying account...'
        loginBtn.disabled = true;
        spinner.classList.remove('hide');
        window.setTimeout(() => {
            axios({
                method: 'post',
                url: 'api/login',
                // url: 'fakeapi/login',
                data: {
                    username: username,
                    password: password
                }
            }).then(value => {
                // loginSpan.innerHTML = 'Connecting nearest block...';
                // window.setTimeout(() => {
                //     loginSpan.innerHTML = 'Initializng hash...';
                //     window.setTimeout(() => {
                //         loginSpan.innerHTML = 'Verifying hash...'
                //         window.setTimeout(() => {
                //             window.location.reload();
                //         }, 1000);
                //     }, 1300);
                // }, 800);
                window.location.reload();
            }).catch(reason => {
                loginBtn.disabled = false;
                loginSpan.innerHTML = originalText;
                spinner.classList.add('hide');
            });
        }, 0);
    }
};

passwordInput.onkeyup = keyup;
usernameInput.onkeyup = keyup;

function keyup(e: KeyboardEvent) {
    if (e.keyCode === 13) {
        loginBtn.click();
    }
}