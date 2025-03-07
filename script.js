let dictionnaire = []; // Initialisation en tant que tableau vide

async function chargerDictionnaire() {
    try {
        const response = await fetch('dictionnaire.json');
        if (!response.ok) throw new Error('Erreur lors du chargement du dictionnaire');
        dictionnaire = await response.json();
        console.log('Dictionnaire chargé :', dictionnaire);
        console.log('Type de dictionnaire :', Array.isArray(dictionnaire) ? 'Tableau' : 'Autre');
        document.getElementById('search-input').disabled = false; // Activer la barre de recherche
    } catch (erreur) {
        console.error('Erreur :', erreur);
    }
}

chargerDictionnaire(); // Charger le dictionnaire au démarrage

// Logique du sélecteur de langue
document.getElementById('language-switcher').addEventListener('click', function() {
    const languageText = document.getElementById('language-text');
    if (languageText.textContent === 'Français - Occitan') {
        languageText.textContent = 'Occitan - Français';
    } else {
        languageText.textContent = 'Français - Occitan';
    }
});

// Fonction pour afficher les suggestions
function afficherSuggestions(term) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const searchContainer = document.querySelector('.search-container');
    suggestionsContainer.innerHTML = ''; // Effacer les suggestions précédentes

    if (term.length > 0 && Array.isArray(dictionnaire)) {
        const languageText = document.getElementById('language-text').textContent;
        const suggestions = [];

        dictionnaire.forEach(entry => {
            if (languageText === 'Français - Occitan') {
                // Ajouter le mot français principal s'il correspond et s'il existe
                if (entry.francais && normaliserChaine(entry.francais.toLowerCase()).startsWith(normaliserChaine(term.toLowerCase()))) {
                    suggestions.push({ type: 'main', text: entry.francais });
                }
                // Ajouter les mots français des significations s'ils correspondent et s'ils existent
                if (entry.significations) {
                    entry.significations.forEach(signification => {
                        if (signification.francais && normaliserChaine(signification.francais.toLowerCase()).startsWith(normaliserChaine(term.toLowerCase()))) {
                            suggestions.push({ type: 'signification', text: signification.francais });
                        }
                    });
                }
            } else {
                // Ajouter le mot occitan s'il correspond et s'il existe
                if (entry.occitan && normaliserChaine(entry.occitan.toLowerCase()).startsWith(normaliserChaine(term.toLowerCase()))) {
                    suggestions.push({ type: 'main', text: entry.occitan });
                }
            }
        });

        if (suggestions.length > 0) {
            suggestions.forEach((suggestion, index) => {
                const p = document.createElement('p');
                p.textContent = suggestion.text;
                p.addEventListener('click', () => {
                    document.getElementById('search-input').value = suggestion.text;
                    suggestionsContainer.style.display = 'none';
                    searchContainer.classList.remove('has-suggestions');

                    const query = document.getElementById('search-input').value;
                    const resultats = dictionnaire.filter(entry => {
                        if (languageText === 'Français - Occitan') {
                            const matchesFrancais = entry.francais && normaliserChaine(entry.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                            const matchesSignifications = entry.significations && entry.significations.some(signification =>
                                signification.francais && normaliserChaine(signification.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()))
                            );
                            return matchesFrancais || matchesSignifications;
                        } else {
                            return entry.occitan && normaliserChaine(entry.occitan.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                        }
                    });

                    afficherResultats(resultats, languageText);
                });
                suggestionsContainer.appendChild(p);
            });
            suggestionsContainer.style.display = 'block';
            searchContainer.classList.add('has-suggestions');
        } else {
            suggestionsContainer.style.display = 'none';
            searchContainer.classList.remove('has-suggestions');
        }
    } else {
        suggestionsContainer.style.display = 'none';
        searchContainer.classList.remove('has-suggestions');
    }
}



function normaliserChaine(chaine) {
    return chaine
        .normalize('NFD') // Décompose les caractères accentués en caractères de base + accents
        .replace(/[\u0300-\u036f]/g, ''); // Supprime les accents
}


// Fonction pour afficher les résultats
function afficherResultats(resultats, langue) {
    const container = document.getElementById('resultats-container');
    container.innerHTML = ''; // Effacer les résultats précédents

    if (resultats.length > 0) {
        resultats.forEach(resultat => {
            if (langue === 'Français - Occitan') {
                // Parcourir les significations pour afficher les résultats correspondants
                if (resultat.significations) {
                    resultat.significations.forEach(signification => {
                        if (normaliserChaine(signification.francais.toLowerCase()) === normaliserChaine(document.getElementById('search-input').value.toLowerCase())) {
                            const p = document.createElement('p');
                            let texte = '';

                            // Afficher le mot français suivi de ":"
                            texte = `<span class="mot">${signification.francais}</span> :<br><br>`;

                            // Afficher le mot occitan, la prononciation et la catégorie
                            texte += `<span class="mot">${resultat.occitan}</span> <span class="prononciation">\\${resultat.prononciation}\\</span> <span class="categorie">(${resultat.categorie})</span><br>`;

                            // Afficher l'exemple
                            texte += `<span class="exemple">Exemple : ${signification.exemple}</span><br><br>`;

                            p.innerHTML = texte;
                            container.appendChild(p);
                        }
                    });
                } else if (resultat.francais) {
                    // Afficher les informations pour les mots avec une seule signification
                    const p = document.createElement('p');
                    let texte = `<span class="mot">${resultat.francais}</span> :<br><br>`;
                    texte += `<span class="mot">${resultat.occitan}</span> <span class="prononciation">\\${resultat.prononciation}\\</span> <span class="categorie">(${resultat.categorie})</span><br>`;
                    texte += `<span class="definition">${resultat.definition}</span><br>`;
                    texte += `<span class="exemple">Exemple : ${resultat.exemple}</span><br><br>`;
                    p.innerHTML = texte;
                    container.appendChild(p);
                }
            } else {
                const p = document.createElement('p');
                let texte = '';

                // Afficher le mot occitan, la prononciation et la catégorie
                texte = `<span class="mot">${resultat.occitan}</span> <span class="prononciation">\\${resultat.prononciation}\\</span> <span class="categorie">(${resultat.categorie})</span> :<br><br>`;

                // Afficher les significations, définitions et exemples
                if (resultat.significations) {
                    resultat.significations.forEach((signification, index) => {
                        texte += `
                            <span class="signification">${index + 1}. ${signification.francais}</span><br>
                            <span class="definition">${signification.definition}</span><br>
                            <span class="exemple">Exemple : ${signification.exemple}</span><br><br>
                        `;
                    });
                } else if (resultat.francais) {
                    // Afficher les informations pour les mots avec une seule signification
                    texte += `
                        <span class="signification">${resultat.francais}</span><br>
                        <span class="definition">${resultat.definition}</span><br>
                        <span class="exemple">Exemple : ${resultat.exemple}</span><br>
                    `;
                }

                p.innerHTML = texte;
                container.appendChild(p);
            }
        });
        container.style.display = 'block';
    } else {
        const p = document.createElement('p');
        p.textContent = 'Aucun résultat';
        container.appendChild(p);
        container.style.display = 'block';
    }
}

document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.getElementById('dark-mode-toggle').textContent = isDarkMode ? 'Mode Clair' : 'Mode Sombre';
});

// Écouter les changements dans le champ de recherche
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value;
    const searchIcon = document.getElementById('search-icon');

    // Activer ou désactiver la loupe
    if (query) {
        searchIcon.classList.remove('disabled');
    } else {
        searchIcon.classList.add('disabled');
    }

    afficherSuggestions(query);
});

// Logique de l'icône de recherche
document.getElementById('search-icon').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
        const languageText = document.getElementById('language-text').textContent;
        const resultats = dictionnaire.filter(entry => {
            if (languageText === 'Français - Occitan') {
                // Vérifier si le mot français principal correspond
                const matchesFrancais = entry.francais && normaliserChaine(entry.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                // Vérifier les mots français dans les significations
                const matchesSignifications = entry.significations && entry.significations.some(signification =>
                    signification.francais && normaliserChaine(signification.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()))
                );
                return matchesFrancais || matchesSignifications;
            } else {
                return entry.occitan && normaliserChaine(entry.occitan.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
            }
        });

        // Afficher les résultats avec la langue active
        afficherResultats(resultats, languageText);

        // Masquer les suggestions
        document.getElementById('suggestions-container').style.display = 'none';
        document.querySelector('.search-container').classList.remove('has-suggestions');
    }
});

// Logique de la touche Entrée
document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('search-input').value;
        if (query) {
            const languageText = document.getElementById('language-text').textContent;
            const resultats = dictionnaire.filter(entry => {
                if (languageText === 'Français - Occitan') {
                    // Vérifier si le mot français principal correspond
                    const matchesFrancais = entry.francais && normaliserChaine(entry.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                    // Vérifier les mots français dans les significations
                    const matchesSignifications = entry.significations && entry.significations.some(signification =>
                        signification.francais && normaliserChaine(signification.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()))
                    );
                    return matchesFrancais || matchesSignifications;
                } else {
                    return entry.occitan && normaliserChaine(entry.occitan.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                }
            });

            // Afficher les résultats avec la langue active
            afficherResultats(resultats, languageText);

            // Masquer les suggestions
            document.getElementById('suggestions-container').style.display = 'none';
            document.querySelector('.search-container').classList.remove('has-suggestions');
        }
    }
});


// Désactiver la loupe au démarrage
document.getElementById('search-icon').classList.add('disabled');

// Charger le dictionnaire au démarrage
chargerDictionnaire();

// Fonction pour appliquer le mode sombre en fonction des préférences système
function applySystemPreference() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkModeCheckbox = document.getElementById('dark-mode-toggle');

    if (prefersDarkScheme) {
        document.body.classList.add('dark-mode');
        darkModeCheckbox.checked = true; // Synchronisation ici
    } else {
        document.body.classList.remove('dark-mode');
        darkModeCheckbox.checked = false; // Synchronisation ici
    }
}


// Appliquer les préférences système au chargement de la page
applySystemPreference();

// Écouter les changements de préférences système
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemPreference);

// Écouter les changements manuels du bouton de basculement
document.getElementById('dark-mode-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
});
