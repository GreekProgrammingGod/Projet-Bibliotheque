/**
 * Fait une appelle pour le navigateur de l'entête,
 * Pour qu'elle aie l'option de se démontrer quand
 * l'utilisateur met la page web en mode cellulaire/media
 */
 let navbar = document.querySelector('.navbar');


 document.querySelector('#menu-btn').onclick = () =>{
     navbar.classList.toggle('active');
 }
 
 window.onscroll = () => {
     navbar.classList.remove('active');
 }