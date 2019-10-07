document.addEventListener("DOMContentLoaded", () => {
    
    const data = {
        action: 'simple-wp-calendar',
        year: 2019,
        month: 10,
        security: simpleWPCal.security
    };


    const xhr = new XMLHttpRequest();
    xhr.open("POST", simpleWPCal.ajaxurl, true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
    
    console.log(data);
    console.log(simpleWPCal.ajaxurl);
    console.log(xhr);

    return false;

    // $.post(eventListCal.ajaxurl, data, function(response) {
    //     console.log(response);
    //     $('#event-list-cal').html(response);
    //     $('#event-list-cal').animate({ opacity : 1 }, 500);
    //     working = 0;

    //     isCurrentDay('full');
    // });
});