export function apiRequest(url) {
    return fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return data.comments
        })
        .catch((error) => console.log('Ошибка:', error.json()))
}

export function delay(interval = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}
