/*
    Notification.js by VoidCloud
    Custom Notification Generation System
*/

/**
 * @param {string} text  This is the text for the notification
 * @param {string} type  Options are: info,error,warn,success 
 */
function generateNotification(text,type) {
    const id = getRandom(0,100000);
    const HTMLString = `
        <p id="notification${id}" class="notification-${type}">${text}</p>
    `
    document.getElementById('notificationHolder').insertAdjacentHTML('beforeend',HTMLString);
    
    const notifications = document.getElementsByClassName(`notification-${type}`)
    let notification
    for(let i = 0; i < notifications.length; i++) {
        if(notifications[i].getAttribute('id') === `notification${id}`) {
            notification = notifications[i]
            break
        }
    }

    //notification.addEventListener('click',() => removeNotification(id,type))
    setTimeout(() => removeNotification(id,type),3000)
}

function removeNotification(id,type) {
    const notifications = document.getElementsByClassName(`notification-${type}`)
    let notification
    for(let i = 0; i < notifications.length; i++) {
        if(notifications[i].getAttribute('id') === `notification${id}`) {
            notification = notifications[i]
            break
        }
    }

    notification.remove()
}