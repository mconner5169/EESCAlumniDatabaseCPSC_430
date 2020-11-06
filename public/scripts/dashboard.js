
// EVENT LISTENERS

//  tbody event listener for displaying update and delete buttons
document.querySelector('tbody').addEventListener('mouseover', buttonVisibility);

// table event listener for hiding all update and delete buttons when mouse leaves table
document.querySelector('table').addEventListener('mouseleave', (event) => {
    document.querySelectorAll('tbody button').forEach((button) => {
        button.style.visibility = 'hidden';
    });
});

// from event listener for dynamically setting form POST request url 
document.querySelector('.alumni_form').addEventListener('submit', (event) => {
    event.preventDefault();
    POST_alumni_form(document.querySelector('#submit').getAttribute('crud_type') == 'add' ? '/admin/create' : '/admin/' + document.querySelector('form').id + '/update')
});

function buttonVisibility(event) {
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
}

// PAGE RENDERING FUNCTIONS


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
    } else if (crud_type == 'View') {
        GET_alumni('/api/alumni/' + button[0].getAttribute('alumni_id'), (alumni) => {
            document.querySelector('#firstName').value = alumni.firstName;
            document.querySelector('#firstName').setAttribute('readonly', true);
            document.querySelector('#lastName').value = alumni.lastName;
            document.querySelector('#lastName').setAttribute('readonly', true);
            document.querySelector('#email').value = alumni.email;
            document.querySelector('#email').setAttribute('readonly', true);
            document.querySelector('#gradYear').value = alumni.gradYear;
            document.querySelector('#gradYear').setAttribute('readonly', true);
            document.querySelector('#degreeType').value = alumni.degreeType;
            document.querySelector('#degreeType').setAttribute('readonly', true);
            document.querySelector('#occupation').value = alumni.occupation;
            document.querySelector('#occupation').setAttribute('readonly', true);
            document.querySelector('#description').value = alumni.description === undefined ? '' : alumni.description;
            document.querySelector('#description').setAttribute('readonly', true);
            document.querySelector('#emailList').checked = alumni.emailList;
            document.querySelector('#emailList').setAttribute('disabled', true);
            document.querySelector('form').id = button[0].getAttribute('alumni_id');
            document.querySelector('#submit').setAttribute('style', 'display: none;');
        });
    } else {
        document.querySelector('form').id = '';
    }

    document.querySelector('#submit').setAttribute('crud_type', crud_type.toLowerCase());
   
});

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
    document.querySelector('#firstName').removeAttribute('readonly');
    document.querySelector('#lastName').removeAttribute('readonly');
    document.querySelector('#gradYear').removeAttribute('readonly');
    document.querySelector('#degreeType').removeAttribute('readonly');
    document.querySelector('#occupation').removeAttribute('readonly');
    document.querySelector('#email').removeAttribute('readonly');
    document.querySelector('#emailList').removeAttribute('disabled');
    document.querySelector('#description').removeAttribute('readonly');
    document.querySelector('#submit').setAttribute('style', 'display: inline-block');
}


// Renders table with updated database
function renderTable() {
    GET_alumni_entries((alumnis) => {
        alumnis.sort(function(a, b) {let textA = a.lastName.toUpperCase(); let textB = b.lastName.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            //Orignally wanted to set toggle on tr but delete button triggered the modal to appear 
            //So set it to each col so can give the idea the 'entire' row is clickable 
            // tr.setAttribute('data-toggle', 'modal');
            // tr.setAttribute('data-target', '#form_modal');
            // tr.setAttribute('data-type', 'View');
            // tr.setAttribute('alumni_id', `${alumnis[i]._id}`);
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm' alumni_id='${alumnis[i]._id}' onclick='DELETE_alumni(event)'>Delete</button></td>`;
            tbody.appendChild(tr);
        }
    })
}



// AJAX CALLS

// Alumni form post handler using ajax
function POST_alumni_form(url) {

    // Get data from DOM
    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let gradYear = document.querySelector('#gradYear').value;
    let degreeType = document.querySelector('#degreeType').value;
    let occupation = document.querySelector('#occupation').value;
    let email = document.querySelector('#email').value;
    let emailList = document.querySelector('#emailList').checked;
    let description = document.querySelector('#description').value;

    let params = "firstName="+firstName+"&lastName="+lastName+"&gradYear="+gradYear+"&degreeType="+degreeType+"&occupation="+occupation+"&email="+email+"&emailList="+emailList+"&description="+description;
   
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
            renderTable();
            resetForm();
            $('#form_modal').modal('hide');
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}



// Alumni entries get handler using ajax
function GET_alumni_entries(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis', true);
    
    xhr.send();

    xhr.onload = function() {
        if (callback) {callback(JSON.parse(xhr.response))}
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
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
            renderTable();
            resetForm();
            $('#form_modal').modal('hide');
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }


}