// Mon premier server Http
const http = require('http');
const queryString = require('query-string');
const server = http.createServer((req, res) => {
    console.log(req.url);
    let reqInfo = { url: req.url, method: req.method, contentType: req.headers['content-type'] };

    res.writeHead(200, { "Content-Type": "application/json" }); // Entête contient des meta-données, descriptions des données
                    // "Content-Type" : MIME --> http MIME sur google
    if (req.method == 'GET') {
        let stringifyJSONObj = JSON.stringify(reqInfo); // Le contenu de body est souvent référé par payload.
        res.end(stringifyJSONObj);
    } else {
        if (req.method == 'POST') {
            // PUT: Modifier une donnée existante dans la BD
            // POST: Ajouter une donnée dans la BD
            let body = [];
            req.on('data', chunk => { 
                body.push(chunk);
            }).on('end', () => {
                try {
                    if (req.headers['content-type'] === "application/json")
                        reqInfo.body = JSON.parse(body); // Tranformer body (suite de code ASCII) en JSON.
                    else
                        if (req.headers['content-type'] === "application/x-www-form-urlencoded")
                            reqInfo.body = queryString.parse(body.toString());
                        else
                            reqInfo.body = body.toString();
                    res.end(JSON.stringify(reqInfo)); // reqInfo est en format binaire, stringify le convertit en chaine de caractères
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }

});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));