import icon from 'images/icon-512x512.png';


export function notifyMe(title, body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log('here1')
        alert("This browser does not support system notifications");
        // This is not how you would really do things if they aren't supported. :)
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        console.log('here2')
        // If it's okay let's create a notification
        var notification = new Notification(title, { icon, body });
        setTimeout(notification.close.bind(notification), 4000);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        console.log('here3')
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(title, { icon, body });
                setTimeout(notification.close.bind(notification), 4000);
            }
        });
    }
    console.log(Notification.permission)

    // Finally, if the user has denied notifications and you
    // want to be respectful there is no need to bother them any more.
}