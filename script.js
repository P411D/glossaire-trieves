let dictionnaire = [];

// Charger le fichier JSON
async function chargerDictionnaire() {
    try {
        const response = await fetch('dictionnaire.json');
        if (!response.ok) throw new Error('Erreur lors du chargement du dictionnaire');
        dictionnaire = await response.json();
        console.log('Dictionnaire chargé :', dictionnaire);
    } catch (erreur) {
        console.error('Erreur :', erreur);
    }
}

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

    if (term.length > 0) {
        const languageText = document.getElementById('language-text').textContent;
        const suggestions = dictionnaire.filter(entry => {
            if (languageText === 'Français - Occitan') {
                return normaliserChaine(entry.francais.toLowerCase()).startsWith(normaliserChaine(term.toLowerCase()));
            } else {
                return normaliserChaine(entry.occitan.toLowerCase()).startsWith(normaliserChaine(term.toLowerCase()));
            }
        });

        if (suggestions.length > 0) {
            suggestions.forEach((suggestion, index) => {
                const p = document.createElement('p');
                // Afficher uniquement le mot français ou occitan en fonction de la langue
                if (languageText === 'Français - Occitan') {
                    p.textContent = ' '.repeat(10) + suggestion.francais;
                } else {
                    p.textContent = ' '.repeat(10) + suggestion.occitan;
                }
                p.addEventListener('click', () => {
                    // Remplir le champ de recherche avec la suggestion cliquée
                    document.getElementById('search-input').value = languageText === 'Français - Occitan' 
                        ? suggestion.francais 
                        : suggestion.occitan;

                    // Masquer les suggestions
                    suggestionsContainer.style.display = 'none';
                    searchContainer.classList.remove('has-suggestions');

                    // Déclencher la recherche
                    const query = document.getElementById('search-input').value;
                    const resultats = dictionnaire.filter(entry => {
                        if (languageText === 'Français - Occitan') {
                            return normaliserChaine(entry.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                        } else {
                            return normaliserChaine(entry.occitan.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                        }
                    });

                    // Afficher les résultats avec la langue active
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
        // Afficher les résultats trouvés
        resultats.forEach(resultat => {
            const p = document.createElement('p');
            // Afficher les résultats en fonction de la langue
            if (langue === 'Français - Occitan') {
                p.textContent = `${resultat.francais} : ${resultat.occitan}`;
            } else {
                p.textContent = `${resultat.occitan} : ${resultat.francais}`;
            }
            container.appendChild(p);
        });
        container.style.display = 'block';
    } else {
        // Afficher "Aucun résultat" si aucun résultat n'est trouvé
        const p = document.createElement('p');
        p.textContent = 'Aucun résultat';
        p.classList.add('no-results'); // Ajouter une classe pour le style
        container.appendChild(p);
        container.style.display = 'block';
    }
}

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
                return normaliserChaine(entry.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
            } else {
                return normaliserChaine(entry.occitan.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
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
                    return normaliserChaine(entry.francais.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
                } else {
                    return normaliserChaine(entry.occitan.toLowerCase()).includes(normaliserChaine(query.toLowerCase()));
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