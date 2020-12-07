
// Alumni form post handler using ajax
// Returns http response status and any errors in callback function e.g. POST_alumni_form(url, params, (status, err) => {})
function POST_create_alumni(params, callback) {
    // AJAX 

    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/admin/create', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
        if (xhr.status == 500) {  
            // Error Block
            if (callback) {  callback(500, xhr.responseText) }
        } else if (xhr.status == 200) {
            // Success Block
           if (callback) { callback(200)}
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}

function POST_update_alumni(id, params, callback) {
    // AJAX 

    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/admin/' + id + '/update', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
        if (xhr.status == 500) {  
            // Error Block
            if (callback) {  callback(500, xhr.responseText) }
        } else if (xhr.status == 200) {
            // Success Block
           if (callback) { callback(200)}
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}

function POST_approve_alumni(id, callback) {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/admin/' + id + '/approve');
    xhr.send();

    xhr.onload = function() {
        if (xhr.status == 200) {
            if (callback) { callback(200) }
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}

// Alumni entries get handler using ajax
function GET_alumni_entries(params, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis?' + params, true);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status == 200){
            if (callback) {callback(JSON.parse(xhr.response))}
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }

}

// Sorting alumni entries using headers
function GET_alumni_sortentries(params, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis?' + params, true);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status == 200){
            if (callback) {callback(JSON.parse(xhr.response))}
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }

}

function GET_pending_alumni_sortentries(params, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis?' + params, true);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status == 200){
            if (callback) {callback(JSON.parse(xhr.response))}
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}

// Returns a singel alumni entry
function GET_alumni_by_id(id, callback) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis/?_id=' + id, true);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            if (callback) {callback(JSON.parse(xhr.responseText)[0])}
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }

}

// Returns a singel alumni entry
function GET_alumni_by_email(email, callback) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis?email=' + email, true);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            if (callback) {callback(JSON.parse(xhr.responseText)[0])}
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }

}


function DELETE_alumni(id, callback) {
    let url = '/admin/' + id + '/delete';

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            if (callback) {callback(xhr.status)};
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }


}


