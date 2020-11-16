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


// let put = function (url, obj, callback) {
//     let req = new XMLHttpRequest();

//     req.onreadystatechange = () => {
//         if (req.readyState == XMLHttpRequest.DONE) {
//             console.log(JSON.parse(req.responseText));
//             callback(JSON.parse(req.responseText));
//         }
//     };

//     req.open("PUT", url, true);
//     req.setRequestHeader("Content-Type", "application/json");
//     req.send(JSON.stringify(obj));
// }