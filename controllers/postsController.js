const posts = require("../data/posts");

// INDEX → GET /posts
function index(req, res) {
    // Inizialmente, tutti i post vengono considerati
    let filteredPosts = posts;

    // Se arriva un query param 'tag', filtriamo solo i post che contengono quel tag
    if (req.query.tag) {
        filteredPosts = posts.filter(
            post => post.tags.includes(req.query.tag)
        );
    }

    // Rispondo con l'array filtrato in formato JSON
    res.json(filteredPosts);
}


// SHOW → GET /posts/:id
function show(req, res) {
    // Prendo l'id dai parametri della richiesta e lo converto in numero
    const id = parseInt(req.params.id);

    // introduciamo un errore a caso per test middelware err 500
    // throw new Error("Errore di test middleware");

    // Cerco il post con l'id corrispondente nell'array posts
    const post = posts.find(p => p.id === id);

    // Se il post non esiste, rispondo con status 404 e un messaggio JSON
    if (!post) {

        // forziamo lo stato di risposta a 404
        res.status(404);

        // rispondiamo con oggetto di errore
        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    // Se il post esiste, restituisco il post in formato JSON
    res.json(post);
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
    // Prendo l'id dai parametri della richiesta e lo converto in numero
    const id = parseInt(req.params.id);

    // Trovo l'indice del post con quell'id
    const index = posts.findIndex(post => post.id === id);

    // Se il post non esiste, rispondo con 404
    if (index === -1) {
        res.status(404);

        return res.json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        });
    }

    // Rimuovo il post dall'array
    posts.splice(index, 1);

    // Stampo la lista aggiornata nel terminale
    console.log("Lista post aggiornata:", posts);

    // forziamo status secondo convenzioni REST che chiude anche function
    res.sendStatus(204)
}


// Esportiamo tutte le funzioni

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};
