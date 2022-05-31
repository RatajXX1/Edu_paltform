import crypto from "./crypto";
import serverPath from "./server-path";

export default {

    async authorize(login_input, password_input, auto_login = false) {
        try {
            password_input = await crypto.sha256(password_input)
            const resp = await fetch(serverPath() + 'api/auth/login.php', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: login_input,
                    password: password_input,
                    Auto_login: auto_login
                }),
                credentials: 'include'
            }).then(data => data.json()).catch(null)

            if (resp !== null) {
                if (resp["CODE"] === 'OK') {
                    window.sessionStorage.setItem('Token', resp['Token'])
                    return true
                } else {
                    return false
                }
            } else return false;
        } catch (e) {
            return false
        }
    },

    async register(login_input, password_input, name_input, surrname_input) {
        try {
            password_input = await crypto.sha256(password_input)
            const resp = await fetch(serverPath() + 'api/auth/register.php', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: name_input,
                    Surrname: surrname_input,
                    login: login_input,
                    password: password_input,
                }),
                credentials: 'include'
            }).then(data => data.json()).catch(null)

            if (resp !== null) {
                if (resp["CODE"] === 'OK') {
                    window.sessionStorage.setItem('Token', resp['Token'])
                    return true
                } else {
                    return false
                }
            } else return false;
        } catch (e) {
            return false
        }
    },

    async CheckAuthorize() {
        try {
            const resp = await fetch(serverPath() + 'api/auth/authorize.php', {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin':'*'
                },
                credentials: 'include'
            }).then(data => data.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    return resp['DATA']
                } else return null
            } else return null
        } catch (e) {
            return null
        }
    },

    isAuthorized(AuthorizedState) {
        if (!AuthorizedState) {
            if (window.location.pathname !== '/') window.location.href = '/'
        }
    }
}