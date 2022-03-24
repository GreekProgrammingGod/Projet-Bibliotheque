let email = document.getElementById('login-email');
let password = document.getElementById('login-password');
let form = document.getElementById('form-login');

const erreurEmail = document.getElementById('erreur-email-login');
const erreurPassword = document.getElementById('erreur-password-login');

//Appel des routes et ajouter evenement soummettre au bouton d'inscription
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
        email: email.value,
        password: password.value
    };

    let response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/');
    }
    else if (response.status === 401) {
        let data = await response.json();
        console.log(data);
    }

    // Validation envoi HTTP
    if(form.checkValidity()) {
        let data = {
            email: email.value,
            password: password.value
        }

        await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
});