let currentWord = "Let's dance"; // Mot par défaut
let currentSize = 100; // Taille initiale du mot
let targetSize = 100; // Taille cible du mot
let easing = 0.2; // Facteur d'interpolation

let gravity = 0.0; // Gravité
let bounce = -0.6; // Coefficient de rebond
let speedSlider; // Déclarer le slider pour contrôler la vitesse du déplacement des lettres
let angularSpeed = 0.05;
let trailingRed = 0;
let trailingGreen = 0;
let trailingBlue = 255;
let trailingAlpha = 10; // Opacité de la traînée

let animationPaused = false; // Variable pour suivre l'état de l'animation

let randomWordSpacing = 10; // Espacement entre les lettres pour les mots aléatoires
let defaultWordSpacing = 90; // Espacement entre les lettres pour le mot par défaut



function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  letterSize = textWidth('A');
  updateLetters();
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(2, 2, width - 4, height - 4);
  textSize(200);
  textStyle(BOLD); // Gras

   // Cacher le curseur de la souris sur le canvas
   noCursor();
   background(trailingRed, trailingGreen, trailingBlue);

}

function startAnimation() {
  animationPaused = false; // Mettre l'animation en marche
  document.getElementById('startButton').classList.add('button-active');
  document.getElementById('startButton').classList.remove('button-inactive');
  document.getElementById('stopButton').classList.add('button-inactive');
  document.getElementById('stopButton').classList.remove('button-active');
}

// Fonction pour arrêter l'animation
function stopAnimation() {
  animationPaused = true; // Mettre l'animation en pause
  document.getElementById('startButton').classList.add('button-inactive');
  document.getElementById('startButton').classList.remove('button-active');
  document.getElementById('stopButton').classList.add('button-active');
  document.getElementById('stopButton').classList.remove('button-inactive');
}

function draw() {
  
 
  
  textAlign(CENTER, CENTER);

// Mettre à jour le mode de fusion en fonction de la sélection de l'utilisateur
updateBlendMode(); // Appel de la fonction pour mettre à jour le mode de fusion

if (!animationPaused) {

  
  // Dessiner chaque lettre et appliquer la gravité
  for (let i = 0; i < letters.length; i++) {
    let letterObj = letters[i];
    push(); // Sauvegarder le contexte de dessin actuel

    // Vérifier si la lettre touche un bord
    let isTouchingBorder = false;
    if (
      letterObj.x - letterSize / 2 <= 0 || 
      letterObj.x + letterSize / 2 >= width || 
      letterObj.y - letterSize / 2 <= 0 || 
      letterObj.y + letterSize / 2 >= height
    ) {
      isTouchingBorder = true;
    }

    // Appliquer la couleur en fonction du nombre de contacts avec le bord
    if (isTouchingBorder) {
      // Vérifier si la lettre a déjà touché un bord
      if (!letterObj.hitEdge) {
        // Changer la couleur seulement si c'est le premier contact avec un bord
        letterObj.hitEdge = true;
        if (letterObj.color.fill === 0) {
          letterObj.color.fill = 255; // Blanc
          letterObj.color.stroke = 0; // Noir
        } else {
          letterObj.color.fill = 0; // Noir
          letterObj.color.stroke = 255; // Noir
        }
      }
    } else {
      letterObj.hitEdge = false; // Réinitialiser la variable hitEdge si la lettre ne touche pas le bord
    }

    fill(letterObj.color.fill);
    stroke(letterObj.color.stroke);

    translate(letterObj.x, letterObj.y); // Déplacer le point d'origine au centre de la lettre
    text(letterObj.letter, 0, 0); // Dessiner la lettre au point d'origine (0, 0)
    pop(); // Restaurer le contexte de dessin précédent

    letterObj.speedY += gravity; // Appliquer la gravité

    // Vérifier et ajuster les rebonds sur les bords du canvas de mots
    if (letterObj.x - letterSize / 2 < 0) {
      letterObj.x = letterSize / 2; // Ramener la lettre à l'intérieur du bord gauche
      letterObj.speedX *= bounce; // Inverser la vitesse horizontale et appliquer un rebond
    } else if (letterObj.x + letterSize / 2 > width) {
      letterObj.x = width - letterSize / 2; // Ramener la lettre à l'intérieur du bord droit
      letterObj.speedX *= bounce; // Inverser la vitesse horizontale et appliquer un rebond
    }

    if (letterObj.y - letterSize / 2 < 0) {
      letterObj.y = letterSize / 2; // Ramener la lettre à l'intérieur du bord supérieur
      letterObj.speedY *= bounce; // Inverser la vitesse verticale et appliquer un rebond
    } else if (letterObj.y + letterSize / 2 > height) {
      letterObj.y = height - letterSize / 2; // Ramener la lettre à l'intérieur du bord inférieur
      letterObj.speedY *= bounce; // Inverser la vitesse verticale et appliquer un rebond
    }

    // Utiliser la fonction constrain pour limiter les coordonnées des lettres
    letterObj.x = constrain(letterObj.x, letterSize / 2, width - letterSize / 2);
    letterObj.y = constrain(letterObj.y, letterSize / 2, height - letterSize / 2);

    

    // Vérifier la collision avec l'ellipse de la souris
    let distance = dist(mouseX, mouseY, letterObj.x, letterObj.y);
    if (distance < 20) {
      // Calculer l'angle entre la lettre et la souris
      let dx = mouseX - letterObj.x;
      let dy = mouseY - letterObj.y;
      let angle = atan2(dy, dx);
      // Calculer la nouvelle vitesse en fonction de l'angle avec la souris
      letterObj.speedX = cos(angle) * 30;
      letterObj.speedY = sin(angle) * 30;
    }


      // Mettre à jour la position de la lettre en fonction de sa vitesse
      letterObj.x += letterObj.speedX;
      letterObj.y += letterObj.speedY;

      pop(); // Restaurer le contexte de dessin précédent
    }


  pop(); 
}


  // Dessiner une ellipse à la position de la souris
  fill(0); // Noir
  ellipse(mouseX, mouseY, 30, 30); // Dessine une ellipse centrée sur la position de la souris avec un diamètre de 50 pixels
}


function updateLetters() {
  letters = [];
  let posX;
  let spacing;

  if (currentWord === "Let's dance") {
    // Utiliser l'espacement pour le mot par défaut
    posX = width / 2 - (textWidth(currentWord) + (currentWord.length - 1) * defaultWordSpacing) / 2;
    spacing = defaultWordSpacing;
  } else {
    // Utiliser l'espacement pour les mots aléatoires
    posX = width / 2 - (textWidth(currentWord) + (currentWord.length - 1) * randomWordSpacing) / 2;
    spacing = randomWordSpacing;
  }

  let posY = height / 2;

  for (let i = 0; i < currentWord.length; i++) {
    let letter = currentWord.charAt(i);
    let letterWidth = textWidth(letter);
    let obj = {
      letter: letter,
      x: posX,
      y: posY,
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      hitEdge: false, // Variable pour indiquer si une lettre a touché un bord
      color: {
        fill: 0, // Couleur de remplissage par défaut (noir)
        stroke: 255, // Couleur du contour par défaut (noir)
      },
    };
    letters.push(obj);
    posX += letterWidth + spacing;
  }
  
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function updateWord() {
  // Mettre à jour le mot avec le texte entré dans le champ de texte
  currentWord = document.getElementById("wordInput").value;
  updateLetters(); // Mettre à jour les lettres avec le nouveau mot
}



function updateGravity() {
  gravity = parseFloat(document.getElementById("gravitySlider").value);
}

function updateBounce() {
  let slider = document.getElementById("bounceSlider");
  let invertedValue = -parseFloat(slider.value);
  // Mettre à jour le coefficient de rebondissement avec la valeur inversée
  bounce = invertedValue;
}



// Liste de mots aléatoires
let motsAleatoires = [ "Rock", "Pop", "Jazz", "Classique", "Blues", "Hip-hop", "R&B", "Reggae", "Funk", "Soul",
"Country", "Electro", "Metal", "Punk", "Indie", "Alternative", "Rap", "Dance", "Techno", "House",
"Trance", "Disco", "Folk", "Gospel", "Ska", "Swing", "Fusion", "Chanson française", "Latin", "Samba",
"Bossa Nova", "Tango", "Flamenco", "Merengue", "Reggaeton", "Cumbia", "Salsa", "Bachata", "Zouk",
"Fado", "K-Pop", "J-Pop", "Funk Metal", "Grunge", "Nu Metal", "Death Metal", "Thrash Metal", "Black Metal",
"Heavy Metal", "Progressive Metal", "Power Metal", "Doom Metal", "Gothic Metal", "Symphonic Metal", "Folk Metal",
"Industrial Metal", "Rap Metal", "Melodic Metal", "Metalcore", "Hardcore", "Post-Hardcore", "Emo", "Screamo",
"Pop Rock", "Indie Rock", "Glam Rock", "Punk Rock", "Psychedelic Rock", "Garage Rock", "Surf Rock", "Soft Rock",
"Hard Rock", "Classic Rock", "Acid Jazz", "Smooth Jazz", "Free Jazz", "Avant-garde Jazz", "Be-bop", "Dixieland",
"Cool Jazz", "Fusion Jazz", "Neo Soul", "Bluegrass", "Electroswing", "Minimal", "Ambient", "Chill-out", "Downtempo",
"Trip-hop", "Drum and Bass", "Dubstep", "Breakbeat", "IDM", "Glitch", "Trap", "Future Bass", "Synthwave", "Vaporwave",
"New Wave", "Post-punk", "Shoegaze", "Dream Pop", "Noise", "Industrial", "EBM", "Darkwave", "Neofolk", "Pagan Metal"];

// Fonction pour charger un mot aléatoire
function chargerMotAleatoire() {
  // Sélectionne un index aléatoire dans la liste des mots
  let index = Math.floor(Math.random() * motsAleatoires.length);
  // Récupère le mot correspondant à l'index sélectionné
  let mot = motsAleatoires[index];
  // Met à jour le mot affiché sur votre canvas ou où vous le souhaitez
  // Par exemple :
  document.getElementById("wordInput").value = mot;
  updateWord(); // Met à jour le mot avec le nouveau mot aléatoire
}



function changeBlendMode() {
  let selectedMode = document.getElementById("blendModeSelect").value;
  console.log("Mode de fusion sélectionné :", selectedMode);
  updateBlendMode(selectedMode); // Met à jour le mode de fusion
}


function updateBlendMode() {
  let select = document.getElementById("blendModeSelect");
  let selectedMode = select.options[select.selectedIndex].value;
  background(trailingRed, trailingGreen, trailingBlue, trailingAlpha);

  switch (selectedMode) {
    case "BLEND":
      blendMode(BLEND);
      break;
    case "ADD":
      blendMode(ADD);
      break;
    case "DARKEST":
      blendMode(DARKEST);
      break;
    case "LIGHTEST":
      blendMode(LIGHTEST);
      break;
    case "DIFFERENCE":
      blendMode(DIFFERENCE);
      break;
    case "MULTIPLY":
      blendMode(MULTIPLY);
      break;
    case "EXCLUSION":
      blendMode(EXCLUSION);
      break;
    case "SCREEN":
      blendMode(SCREEN);
      break;
    case "REMOVE":
      blendMode(REMOVE);
      break;
    case "OVERLAY":
      blendMode(OVERLAY);
      break;
    case "HARD_LIGHT":
      blendMode(HARD_LIGHT);
      break;
    case "SOFT_LIGHT":
      blendMode(SOFT_LIGHT);
      break;
    case "BURN":
      blendMode(BURN);
      break;
    default:
      blendMode(BLEND);
      break;
  }
}



function drawSolidBackground() {
  background(trailingRed, trailingGreen, trailingBlue);
}

function updateBackgroundColor() {
  trailingRed = document.getElementById("backgroundRedSlider").value;
  trailingGreen = document.getElementById("backgroundGreenSlider").value;
  trailingBlue = document.getElementById("backgroundBlueSlider").value;
  drawSolidBackground(); // Appel pour mettre à jour le fond
}



function updateBackgroundColorAlpha() {
  let alphaSlider = document.getElementById("backgroundAlphaSlider");
  trailingAlpha = parseFloat(alphaSlider.value);

  drawSolidBackground(); // Appel à la fonction pour dessiner le background solide
}

