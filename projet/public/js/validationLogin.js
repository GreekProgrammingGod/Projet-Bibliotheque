let email = document.getElementById('login-email');
let inputPassword = document.getElementById('login-password');
let form = document.getElementById('form-login');
const erreurEmail = document.getElementById('erreur-email-login');
const erreurPassword = document.getElementById('erreur-password-login');

//Validation de l'adresse courriel login
const validateEmail = () => {
    if(email.validity.valid) {
        erreurEmail.innerText = '';
        erreurEmail.classList.remove('active');
    }
    else {
        erreurEmail.classList.add('active');
        if (email.validity.valueMissing)
        {
            erreurEmail.innerText = 'Veuillez entrer une valeur';
        }
        else if (email.validity.typeMismatch)
        {
            erreurEmail.innerText = 'Adresse courriel non valide';
        }
    }
}

form.addEventListener('submit', validateEmail);
email.addEventListener('blur',validateEmail);
email.addEventListener('input', validateEmail);

//Validation du mot de passe courriel login
const validatePassword = () => {
    if(inputPassword.validity.valid) {
        erreurPassword.innerText = '';
        erreurPassword.classList.remove('active');
    }
    else {
        erreurPassword.classList.add('active');
        if (inputPassword.validity.valueMissing)
        {
            erreurPassword.innerText = 'Veuillez entrer une valeur';
        }
        else if (inputPassword.validity.tooShort)
        {
            erreurPassword.innerText = 'Mot de passe trop court';
        }
        else if (inputPassword.validity.toolong)
        {
            erreurPassword.innerText = 'Mot de passe trop long';
        }
    }
}

form.addEventListener('submit', validatePassword);
inputPassword.addEventListener('blur',validatePassword);
inputPassword.addEventListener('input', validatePassword);