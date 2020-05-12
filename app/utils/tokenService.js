export const storeTokenToLocalStore=token=>{
    localStorage.setItem("jwtToken", token);
}

export const removeToken=()=>{
    localStorage.removeItem("jwtToken");
}

export const getToken = ()=>{
    return localStorage.getItem("jwtToken")
}