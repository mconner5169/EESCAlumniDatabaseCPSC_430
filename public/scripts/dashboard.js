
// If you have any questions lmk
// General TODO: add ui feedback when adding and updataing UI <- I'll do this

//const { everyLimit } = require("async");



document.querySelector('tbody').addEventListener('mouseover', buttonVisibility);

// tbody event listener for displaying update and delete buttons
function buttonVisibility(event) {

    // Reset the display of all update and delete buttons
    document.querySelectorAll('tbody button').forEach((button) => {
        button.style.visibility = 'hidden';
    });

    let tr = event.target;
    // Search block
    while (tr !== this && !tr.matches('tr')) {
        tr = tr.parentNode;
    }
    // Error block
    if (tr === this) {
        console.log("No table cell found");
    // Found block
    } else {
        tr.querySelectorAll('button').forEach((button) => {
            button.style.visibility = 'visible';
        });
    }
};

// table event listener for hiding all update and delete buttons when mouse leaves table
document.querySelector('table').addEventListener('mouseleave', (event) => {
    document.querySelectorAll('tbody button').forEach((button) => {
        button.style.visibility = 'hidden';
    });
});

// Modal handler
$('#form_modal').on('show.bs.modal', function (event) {
    let errorList = document.querySelector('#errorList');
    errorList.innerHTML = '';
    let button = $(event.relatedTarget); 
    let crud_type = button.data('type'); 
    let modal = $(this);
    modal.find('.modal-title').text(crud_type + ' Alumni Entry');

    if (crud_type == 'Update') {
        GET_alumni('/api/alumni/' + button[0].getAttribute('alumni_id'), (alumni) => {
            document.querySelector('#firstName').value = alumni.firstName;
            document.querySelector('#lastName').value = alumni.lastName;
            document.querySelector('#email').value = alumni.email;
            document.querySelector('#gradYear').value = alumni.gradYear;
            document.querySelector('#degreeType').value = alumni.degreeType;
            document.querySelector('#occupation').value = alumni.occupation;
            document.querySelector('#description').value = alumni.description === undefined ? '' : alumni.description;
            document.querySelector('#emailList').checked = alumni.emailList;

            document.querySelector('form').id = button[0].getAttribute('alumni_id');
        });
    } else {
        document.querySelector('form').id = '';
    }

    document.querySelector('#submit').setAttribute('crud_type', crud_type.toLowerCase());
});

document.querySelector('.alumni_form').addEventListener('submit', (event) => {
    event.preventDefault();
    POST_alumni_form(document.querySelector('#submit').getAttribute('crud_type') == 'add' ? '/admin/create' : '/admin/' + document.querySelector('form').id + '/update')
});

// Alumni form post handler using ajax
function POST_alumni_form(url) {

    // Get data from DOM
    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let gradYear = document.querySelector('#gradYear').value;
    let degreeType = document.querySelector('#degreeType').value;
    let occupation = document.querySelector('#occupation').value;
    let email = document.querySelector('#email').value;
    let emailList = document.querySelector('#emailList').value;
    let description = document.querySelector('#description').value;

    let params = "firstName="+firstName+"&lastName="+lastName+"&gradYear="+gradYear+"&degreeType="+degreeType+"&occupation="+occupation+"&email="+email+"&emailList="+emailList+"&description"+description;
   
    // AJAX 
    let xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
        if (xhr.status == 500) {  
            // Error Block
            renderFormErrors(xhr.responseText);
        } else if (xhr.status == 200) {
            // Success Block
            GET_alumni_entries();
            resetForm();
            $('#form_modal').modal('hide');
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}

// Renders modal with errors
function renderFormErrors(errors) {
    errors = JSON.parse(errors);
    let modal = $('#form_modal')
    let errorList = document.querySelector('#errorList');
    errorList.innerHTML = '';
    for (i in errors) {
        let errorMsg = document.createTextNode('*' + errors[i].msg)
        let br = document.createElement('br')
        errorList.appendChild(errorMsg);
        errorList.appendChild(br);
    }

}

// Remove user inputed values in form
function resetForm() {
    document.querySelector('#firstName').value = '';
    document.querySelector('#lastName').value = '';
    document.querySelector('#gradYear').value = '';
    document.querySelector('#degreeType').value = '';
    document.querySelector('#occupation').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#emailList').value = '';
    document.querySelector('#description').value = '';
}

// Alumni entries get handler using ajax
function GET_alumni_entries() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis', true);
    
    xhr.send();

    xhr.onload = function() {
        if (xhr.status == 200) {
            renderTable(xhr.response)
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }

}

// Renders table with updated database
// res - server response containing all alumni entries
function renderTable(res) {
    alumnis = JSON.parse(res);
    alumnis.sort(function(a, b) {let textA = a.lastName.toUpperCase(); let textB = b.lastName.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
    let tbody = document.querySelector('tbody');
    let clone = tbody.cloneNode(false);
    tbody.parentNode.replaceChild(clone, tbody);
    tbody = clone;
    tbody.addEventListener('mouseover', buttonVisibility);
    for (i in alumnis) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${alumnis[i].firstName}</td>
        <td>${alumnis[i].lastName}</td>
        <td>${alumnis[i].gradYear}</td>
        <td>${alumnis[i].degreeType}</td>
        <td>${alumnis[i].occupation}</td>
        <td>${alumnis[i].email}</td>
        <td>${alumnis[i].emailList}</td>
        <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
        <td class='px-0'><button class='btn btn-danger btn-sm' alumni_id='${alumnis[i]._id}' onclick='DELETE_alumni(event)'>Delete</button></td>`;
        tbody.appendChild(tr);
    }
}

// Returns a singel alumni entry
function GET_alumni(url, callback) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onload = () => {
        if (callback) {callback(JSON.parse(xhr.responseText))}
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }

}

function DELETE_alumni(event) {
    let url = '/admin/' + event.srcElement.getAttribute('alumni_id') + '/delete';

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            GET_alumni_entries();
            resetForm();
            $('#form_modal').modal('hide');
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }


}