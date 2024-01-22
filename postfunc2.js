import { setInner, getValue } from "https://jscroot.github.io/element/croot.js";
export default function Registrasi() {
    let target_url = "https://asia-southeast2-project3-403605.cloudfunctions.net/CreateUser";
    let datainjson = {
        "username": getValue("username"),
        "password": getValue("password")
    }
    postNoToken(target_url, datainjson, responseData);
}

function responseData(result) {

    setInner("pesan", result.message);
    if (result.message == "Berhasil Input data") {
        window.location.href = "index.html";    
    } else {
        console.log(result.message);
    }
}

function postNoToken(target_url,datajson,responseFunction){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(datajson);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(target_url, requestOptions)
    .then(response => response.text())
    .then(result => responseFunction(JSON.parse(result)))
    .catch(error => console.log('error', error));
}