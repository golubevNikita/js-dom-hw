export function apiRequest() {
    return fetch('https://wedev-api.sky.pro/api/v1/golubev-nikita/comments')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return data
        })
}

export function delay(interval = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}
