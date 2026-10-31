const notificationDuration = 3000

let nextId = 0

export let notifications = $state([])

export function generateNotification(text, type = 'info') {
    const id = nextId++
    notifications.push({ id, text, type })

    setTimeout(() => removeNotification(id), notificationDuration)
}

export function removeNotification(id) {
    const index = notifications.findIndex((notification) => notification.id === id)
    if (index !== -1) notifications.splice(index, 1)
}
