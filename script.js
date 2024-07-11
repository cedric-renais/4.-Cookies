/////////////////////////////////
// Selectionne tous les inputs //
/////////////////////////////////

const inputs = document.querySelectorAll('input');

/////////////////////////////////////////////////////
// Ajoute un écouteur d'événement sur chaque input //
// Ecoute l'événement 'invalid' & 'input'          //
/////////////////////////////////////////////////////

inputs.forEach((input) => {
  input.addEventListener('invalid', handleValidation);
  input.addEventListener('input', handleValidation);
});

////////////////////////////////////////////////
// Fonction qui gère la validation des inputs //
// Si l'événement est 'invalid'               //
// On affiche un message d'erreur             //
// Si l'événement est 'input'                 //
// On n'affiche pas le message d'erreur       //
////////////////////////////////////////////////

function handleValidation(event) {
  if (event.type === 'invalid') {
    event.target.setCustomValidity(`Tu as oublié de remplir ce champ 😅`);
  } else if (event.type === 'input') {
    event.target.setCustomValidity('');
  }
}

////////////////////////////////////
// Selectionne le formulaire      //
// Ajoute un écouteur d'événement /
////////////////////////////////////

const cookieForm = document.querySelector('.cookie-form');
cookieForm.addEventListener('submit', handleForm);

///////////////////////////////////////////////////////////////
// Fonction qui gère la soumission du formulaire             //
// Empêche le comportement par défaut du formulaire          //
// Crée un objet vide pour stocker les données du formulaire //
// Parcours tous les inputs du formulaire                    //
// Stocke la valeur de chaque input dans l'objet newCookie   //
// Donne une date d'expiration de 7 jours au cookie          //
// Appelle la fonction createCookie avec l'objet newCookie   //
// Reset le formulaire                                       //
///////////////////////////////////////////////////////////////

function handleForm(event) {
  event.preventDefault();
  const newCookie = {};
  inputs.forEach((input) => {
    const nameAttribute = input.getAttribute('name');
    newCookie[nameAttribute] = input.value;
  });
  newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  createCookie(newCookie);
  cookieForm.reset();
}

//////////////////////////////////////////////////////////////////////////////
// Fonction qui crée un cookie                                              //
// Si le cookie existe déjà                                                 //
// On crée un toast pour informer l'utilisateur que le cookie a été modifié //
// Si le cookie n'existe pas                                                //
// On crée un toast pour informer l'utilisateur que le cookie a été créé    //
// Stocke le cookie dans le document.cookie                                 //
// Encode le nom et la valeur du cookie en URI                              //
// Convertie la date d'expiration en chaine de caractères                   //
// Vérifie si la liste des cookies est déjà affichée                        //
// Si oui, on réaffiche les cookies pour actualiser la liste                //
//////////////////////////////////////////////////////////////////////////////

function createCookie(newCookie) {
  if (doesCookieExist(newCookie.name)) {
    createToast({
      name: newCookie.name,
      state: 'modifié',
      color: '#F76B15',
    });
  } else {
    createToast({
      name: newCookie.name,
      state: 'crée',
      color: '#29A383',
    });
  }
  document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(
    newCookie.value
  )}; expires=${newCookie.expires.toUTCString()}`;
  if (cookieList.children.length) {
    displayCookies();
  }
}

/////////////////////////////////////////////////////////////
// Fonction qui vérifie si un cookie existe                //
// Récupère tous les cookies et les stocke dans un tableau //
// Récupère uniquement le nom des cookies                  //
// Vérifie si le nom du cookie existe dans le tableau      //
// Retourne true si le cookie existe, false sinon          //
/////////////////////////////////////////////////////////////

function doesCookieExist(name) {
  const cookies = document.cookie.replace(/\s/g, '').split(';');
  const onlyCookiesName = cookies.map((cookie) => cookie.split('=')[0]);
  const ifCookieExist = onlyCookiesName.find(
    (cookie) => cookie === encodeURIComponent(name)
  );
  return ifCookieExist;
}
/////////////////////////////////////////
// Selectionne le container des toasts //
/////////////////////////////////////////

const toastContainer = document.querySelector('.cookie-toasts');

////////////////////////////////////////////////////////////////////////////////
// Fonction pour créer le toast avec le nom du cookie, son état et sa couleur //
// Crée un élément p pour afficher le message                                 //
// Ajoute une classe à l'élément p                                            //
// Ajoute le message dans l'élément p                                         //
// Change la couleur de fond de l'élément p                                   //
// Ajoute l'élément p dans le container des toasts                            //
// Supprime le toast après 2.5 secondes                                       //
////////////////////////////////////////////////////////////////////////////////

function createToast({ name, state, color }) {
  const toastInfo = document.createElement('p');
  toastInfo.className = 'cookie-toasts__info';
  toastInfo.textContent = `Le cookie ${name} a été ${state} !`;
  toastInfo.style.backgroundColor = color;
  toastContainer.appendChild(toastInfo);
  setTimeout(() => {
    toastInfo.remove();
  }, 3000);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Selectionne la liste des cookies, le bouton pour afficher les cookies & le message d'information //
//////////////////////////////////////////////////////////////////////////////////////////////////////

const cookieList = document.querySelector('.cookie-list');
const displayCookiesButton = document.querySelector(
  '.cookie-form__button-display'
);
const infoTxt = document.querySelector('.cookie-info');

////////////////////////////////////////////////////////////////////////////
// Ajoute un écouteur d'événement sur le bouton pour afficher les cookies //
// Appelle la fonction displayCookies pour afficher les cookies           //
////////////////////////////////////////////////////////////////////////////

displayCookiesButton.addEventListener('click', displayCookies);

//////////////////////////////////////////////////////////////////////////
// Variable pour empêcher l'affichage multiple du message d'information //
//////////////////////////////////////////////////////////////////////////

let locked = false;

/////////////////////////////////////////////////////////////////////////////////////////////
// Fonction pour afficher les cookies                                                      //
// On remet à zéro la liste des cookies pour évider les doublons en cas de plusieurs clics //
// Récupère tous les cookies, les stocke dans un tableau et les inverse                    //
// Si aucun cookie n'est enregistré, on affiche un message d'information                   //
// Si le message d'information est déjà affiché, on empêche l'affichage multiple           //
// Sinon on affiche le message d'information                                               //
// On supprime le message d'information après 2 secondes                                   //
// Appelle la fonction createElements pour afficher les cookies                            //
/////////////////////////////////////////////////////////////////////////////////////////////

function displayCookies() {
  if (cookieList.children.length) {
    cookieList.textContent = '';
  }
  const cookies = document.cookie.replace(/\s/g, '').split(';').reverse();
  if (!cookies[0]) {
    if (locked) return;
    locked = true;
    infoTxt.textContent = "Aucun cookie n'est enregistré, créez-en un ! 🍪";
    setTimeout(() => {
      infoTxt.textContent = '';
      locked = false;
    }, 2000);
    return;
  }
  createElements(cookies);
}

function createElements(cookies) {
  cookies.forEach((cookie) => {
    const formatCookie = cookie.split('=');
    const listItem = document.createElement('li');
    const name = decodeURIComponent(formatCookie[0]);
    listItem.innerHTML = `
    <p>
      <span>Nom:</span> ${name}
    </p>
    <p>
      <span>Valeur:</span> ${decodeURIComponent(formatCookie[1])}
    </p>
    <button>X</button>
    `;
    listItem.querySelector('button').addEventListener('click', (event) => {
      createToast({ name: name, state: 'supprimé', color: '#e54666' });
      document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`;
      event.target.parentElement.remove();
    });
    cookieList.appendChild(listItem);
  });
}
