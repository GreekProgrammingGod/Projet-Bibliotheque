const email = document.getElementById('input-email');
const password = document.getElementById('input-password');
const form = document.getElementById('form-inscription');
const erreurEmail = document.getElementById('erreur-email-inscription');
const erreurPassword = document.getElementById('erreur-password-inscription');

//Validation de l'adresse courriel inscription
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

//Validation du mot de passe courriel inscription
const validatePassword = () => {
    if(password.validity.valid) {
        erreurPassword.innerText = '';
        erreurPassword.classList.remove('active');
    }
    else {
        erreurPassword.classList.add('active');
        if (password.validity.valueMissing)
        {
            erreurPassword.innerText = 'Veuillez entrer une valeur';
        }
        else if (password.validity.tooShort)
        {
            erreurPassword.innerText = 'Mot de passe trop court';
        }
        else if (password.validity.tooLong)
        {
            erreurPassword.innerText = 'Mot de passe trop long';
        }
    }
}

form.addEventListener('submit', validatePassword);
password.addEventListener('blur',validatePassword);
password.addEventListener('input', validatePassword);