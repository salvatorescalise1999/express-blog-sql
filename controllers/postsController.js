// Importiamo il file di connessione al database
const connection = require('../data/db');


// const posts = require("../data/posts");

// INDEX → GET /posts
function index(req, res) {

    // prepariamo la query
    const sql = 'SELECT * FROM posts';

    // eseguiamo la query!
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}


// SHOW → GET /posts/:id
function show(req, res) {
    // Prendo l'id dai parametri della richiesta e lo converto in numero
    const id = parseInt(req.params.id);

    const sql = 'SELECT * FROM posts WHERE id = ?';

    // Prepariamo la query per i tags aiutandoci con una join e Where
    const tagsSql = `
    SELECT T.*
    FROM tags T
    JOIN post_tag PT ON T.id = PT.tag_id
    WHERE PT.post_id = ?
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Post not found' });

        // Recuperiamo il post
        const post = results[0];

        // Facciamo partire la seconda query (join) per recuperare i tag
        connection.query(tagsSql, [id], (err, tagsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });

            // Aggiungiamo i tag al post
            post.tags = tagsResults;

            res.json(post);
        });
    });

}


// CREATE → POST /posts
function store(req, res) {

    const newId = Date.now(); // genera un ID unico basato sul timestamp

    // Creiamo il nuovo post usando i dati dal body
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    };

    // Aggiungiamo il post all'array
    posts.push(newPost);

    // Stampiamo nel terminale per debug
    console.log("Nuovo post creato:", newPost);

    // Restituiamo lo status corretto e la pizza appena creata
    res.status(201);
    res.json(newPost);
}


// UPDATE → PUT /posts/:id
function update(req, res) {

    // recuperiamo l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    // cerchiamo il post tramite id
    const post = posts.find(post => post.id === id);

    // Piccolo controllo
    if (!post) {
        res.status(404);

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // Aggiorniamo il post
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    // Controlliamo tutto il blog 
    console.log(posts)

    // Restituiamo il post appena aggiornato...
    res.json(post);
}


// DELETE → DELETE /posts/:id
function destroy(req, res) {

    // recuperiamo l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    const sql = 'DELETE FROM posts WHERE id = ?';

    //Eliminiamo la pizza dal menu                       
    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete post' });
        res.sendStatus(204)
    });
}


// Esportiamo tutte le funzioni

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};
