import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import { setInner, getValue } from "https://jscroot.github.io/element/croot.js";
import { setCookieWithExpireHour } from "https://jscroot.github.io/cookie/croot.js";

export default function PostSignUp() {
    let target_url = "https://asia-southeast2-project3-403605.cloudfunctions.net/GCFPostHandler";
    let tokenkey = "token";
    let tokenvalue = "e88643e9589a250ac8daa353cde00a794ac47a8793a7714f54ad2cdfee5a694a";
    let datainjson = {
        "username": getValue("username"),
        "password": getValue("password")
    }
    postWithToken(target_url, tokenkey, tokenvalue, datainjson, responseData);
}

function responseData(result) {

    setInner("pesan", result.message);
    if (result.message == "Selamat Datang") {
        setCookieWithExpireHour("token", result.token, 2); 
        window.location.href = "splash.html";    
    } else {
        console.log(result.message);
    }
}