// const path = "http://192.168.0.9:8080/"
const path = window.location.origin + '/'

export default function serverPath() {
    if (window.localStorage.getItem("RPath") !== undefined) {
        return path
    } else {
        return window.localStorage.getItem("RPath")
    }
}