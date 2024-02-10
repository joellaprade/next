var inputElements = document.querySelectorAll('input')
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

const postNewUser = async (e) => {
    e.preventDefault();
    const req = await fetch(baseUrl + 'create-user',
    {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(setValues())
    })
}

submitButton.addEventListener('click', async e => {
    await postNewUser(e)
    window.location.href = '/'
})

input.addEventListener('keydown', e => {
    e.preventDefault();
    if(e.key == 'Enter'){
        document.body.style.backgroundColor = '#ffffff'
    }
})