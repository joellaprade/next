
var submitButton = document.querySelector('#submit')

var modelo = {
    username: '',
    password: ''
}

const setValues = () => {
    var username = document.querySelector('#username')
    var password = document.querySelector('#password')

    modelo.username = username.value;
    modelo.password = password.value;

    return modelo;
}

const postLogin = async (e) => {
    e.preventDefault();
    const req = await fetch(baseUrl + 'login-user',
    {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(setValues())
    })
}

submitButton.addEventListener('click', e => postLogin(e))