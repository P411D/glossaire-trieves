// Dictionnaire des correspondances entre l'occitan et l'API
const apiRules = {
    // Voyelles
    "a": "a",
    "e": "e", // À affiner selon le contexte
    "è": "ɛ",
    "i": "i",
    "o": "u", // À affiner selon le contexte
    "ò": "ɔ",
    "u": "y",
    // Diphtongues
    "ai": "aj",
    "ei": "ej",
    "oi": "ɔj",
    "au": "aw",
    "eu": "ew",
    // Consonnes
    "b": "b",
    "c": "k", // Devant a, o, u
    "ç": "s",
    "d": "d",
    "f": "f",
    "g": "ɡ", // Devant a, o, u
    "h": "", // Muet
    "j": "d͡ʒ",
    "l": "l",
    "lh": "ʎ",
    "m": "m",
    "n": "n",
    "nh": "ɲ",
    "p": "p",
    "r": "ʁ", // Changé de /ɾ/ à /ʁ/
    "s": "s", // Devient "z" entre voyelles
    "t": "t",
    "v": "v",
    "z": "z",
    "ch": "ʃ", // Nouvelle règle pour "ch"
    // Ajoutez d'autres règles ici
};

// Fonction pour déterminer si un caractère est une voyelle
function isVowel(char) {
    return /[aeiouàèìòùáéíóúâêîôûäëïöü]/.test(char.toLowerCase());
}

// Fonction pour trouver la position de l'accent tonique
function findStressIndex(word) {
    const length = word.length;
    if (!isVowel(word[length - 1])) { // Si le mot se termine par une consonne
        return length - 1; // Accent sur la dernière syllabe
    } else { // Si le mot se termine par une voyelle
        return length - 2; // Accent sur l'avant-dernière syllabe
    }
}

// Fonction pour phonétiser un mot en occitan en utilisant l'API
function phonetizeOccitan(word) {
    const stressIndex = findStressIndex(word);
    let phoneticWord = "";

    for (let i = 0; i < word.length; i++) {
        let char = word[i];

        // Gérer les digrammes comme "nh", "lh" ou "ch"
        if (i < word.length - 1 && apiRules[char + word[i + 1]]) {
            phoneticWord += apiRules[char + word[i + 1]];
            i++; // Passer au caractère suivant
        } else if (apiRules[char]) {
            phoneticWord += apiRules[char];
        } else {
            phoneticWord += char; // Garder le caractère tel quel si aucune règle ne s'applique
        }

        // Ajouter l'accent tonique si nécessaire
        if (i === stressIndex && isVowel(char) && !word.endsWith("aa")) {
            phoneticWord += "ˈ"; // Symbole de l'accent tonique en API
        }
    }

    // Règle : "a" final se prononce /o/, sauf si c'est un double "aa"
    if (phoneticWord.endsWith("a") && !word.endsWith("aa")) {
        phoneticWord = phoneticWord.slice(0, -1) + "o";
    }

    // Règle : Si le mot se termine par une consonne, ne pas la prononcer
    if (!isVowel(word[word.length - 1])) {
        phoneticWord = phoneticWord.slice(0, -1);
    }

    // Règle : Traiter le double "aa" comme un seul "a"
    if (word.endsWith("aa")) {
        phoneticWord = phoneticWord.slice(0, -1); // Supprimer le dernier "a"
    }

    return phoneticWord;
}

// Fonction pour gérer la conversion
function convert() {
    const input = document.getElementById("occitanInput").value;
    const result = phonetizeOccitan(input);
    document.getElementById("result").textContent = result;
}

// Sélectionner la checkbox et le body
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Appliquer le mode sombre ou clair en fonction des préférences système
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.setAttribute("data-theme", "dark");
    themeToggle.checked = true; // Cocher la checkbox si le mode sombre est activé
} else {
    body.setAttribute("data-theme", "light");
    themeToggle.checked = false; // Décocher la checkbox si le mode clair est activé
}

// Basculer entre les modes
themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        body.setAttribute("data-theme", "dark");
    } else {
        body.setAttribute("data-theme", "light");
    }
});