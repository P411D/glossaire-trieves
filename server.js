const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.static('.')); // Servir les fichiers statiques (comme admin-ajout.html)

// Chemin vers le fichier JSON
const jsonFilePath = path.join(__dirname, 'dictionnaire.json');

// Route pour récupérer tous les mots
app.get('/get-words', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON :', err);
            return res.status(500).send('Erreur serveur');
        }

        res.json(JSON.parse(data));
    });
});

// Route pour récupérer un mot spécifique
app.get('/get-word/:index', (req, res) => {
    const index = parseInt(req.params.index);

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON :', err);
            return res.status(500).send('Erreur serveur');
        }

        const dictionnaire = JSON.parse(data);
        if (index >= 0 && index < dictionnaire.length) {
            res.json(dictionnaire[index]);
        } else {
            res.status(404).send('Mot non trouvé');
        }
    });
});

// Route pour ajouter ou mettre à jour un mot
app.post('/add-word', (req, res) => {
    const newWord = req.body;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON :', err);
            return res.status(500).send('Erreur serveur');
        }

        let dictionnaire = JSON.parse(data);
        dictionnaire.push(newWord);

        fs.writeFile(jsonFilePath, JSON.stringify(dictionnaire, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier JSON :', err);
                return res.status(500).send('Erreur serveur');
            }

            res.status(200).send('Mot ajouté avec succès');
        });
    });
});

app.put('/update-word/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const updatedWord = req.body;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON :', err);
            return res.status(500).send('Erreur serveur');
        }

        let dictionnaire = JSON.parse(data);
        if (index >= 0 && index < dictionnaire.length) {
            dictionnaire[index] = updatedWord;

            fs.writeFile(jsonFilePath, JSON.stringify(dictionnaire, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier JSON :', err);
                    return res.status(500).send('Erreur serveur');
                }

                res.status(200).send('Mot modifié avec succès');
            });
        } else {
            res.status(404).send('Mot non trouvé');
        }
    });
});

// Route pour supprimer un mot
app.delete('/delete-word/:index', (req, res) => {
    const index = parseInt(req.params.index);

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON :', err);
            return res.status(500).send('Erreur serveur');
        }

        let dictionnaire = JSON.parse(data);
        if (index >= 0 && index < dictionnaire.length) {
            dictionnaire.splice(index, 1); // Supprimer le mot à l'index donné

            fs.writeFile(jsonFilePath, JSON.stringify(dictionnaire, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier JSON :', err);
                    return res.status(500).send('Erreur serveur');
                }

                res.status(200).send('Mot supprimé avec succès');
            });
        } else {
            res.status(404).send('Mot non trouvé');
        }
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});

