let getApi = function (url, callback) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            callback(JSON.parse(req.responseText));
           
        }
    };

    req.open("GET", url, false);
    req.send();
}

let postApi = function (url, obj, callback) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            callback(JSON.parse(req.responseText));
           
        }
    };

    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(obj));
}

let putApi = function (url,obj, callback) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            callback(req.responseText);
        }
    };

    req.open("PUT", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(obj));
}