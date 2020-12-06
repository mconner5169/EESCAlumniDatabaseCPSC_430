// Global variable for current table filters
let alumniParams = 'status=approved';
let isReverse;


// EVENT LISTENERS

// Table Header Listener for sorting the table
const table = document.querySelector('table');
table.querySelectorAll('th').forEach((element) => {
        element.addEventListener('click', function(event) {
            const isReverse = (this.dataset.reverse == 'true');
            const sortParam = this.dataset.id;
            this.dataset.reverse = !isReverse;
            console.log(isReverse) //debugging statement
            console.log(sortParam) //debugging statement
            
            //Sorts table based on sortParam
            if (sortParam == 'First Name') {
                renderTablefirstName(isReverse);
            }
            if (sortParam == 'Last Name') {
                renderTablelastName(isReverse);
            }
            if (sortParam == 'Grad Year') {
                renderTablegradYear(isReverse);
            }
            if (sortParam == 'Degree Type') {
                renderTabledegreeType(isReverse);
            }
            if (sortParam == 'Occupation') {
                renderTableoccupation(isReverse);
            }
            if (sortParam == 'Email') {
                renderTableemail(isReverse);
            }
            if (sortParam == 'Email List') {
                renderTableemailList(isReverse);
            }
        })
    })

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

    if (document.querySelector('#submit').getAttribute('crud_type') == 'add') {
        POST_create_alumni(params, (status, err) => {
            if (status == 200) {
                renderTable();
                $('#form_modal').modal('hide');
            } else if (status == 500) { 
                renderFormErrors(err); 
            }
        })
    } else if (document.querySelector('#submit').getAttribute('crud_type') == 'update') {
        let id = document.querySelector('form').id;
        POST_update_alumni(id, params, (status, err) => {
            if (status == 200) {
                renderTable();
                $('#form_modal').modal('hide');
            } else if (status == 500) { 
                renderFormErrors(err); 
            }
        })
    }


});

document.querySelector('#search').addEventListener('click', (event) => {
    console.log("here")
    let gradYear = document.querySelector('#searchGradYear').value;
    let degreeType = document.querySelector('#searchDegreeType').value;
    let occupation = document.querySelector('#searchOccupation').value;
    alumniParams = (gradYear != '' ? 'gradYear=' + gradYear : ''  ) + (degreeType != '' ? '&degreeType=' + degreeType : '') + (occupation != '' ? '&occupation=' + occupation : '') + '&status=approved';
    renderTable();
}) 

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

function addDeleteEventListeners() {
    document.querySelectorAll('.delete_btn').forEach((btn) => { 
        btn.addEventListener('click', () => {
            DELETE_alumni(btn.getAttribute('alumni_id'), (status) => {
                if (status == 200) {
                    renderTable();
                    resetForm();
                    $('#form_modal').modal('hide');
                }
            });
        });
    })
}

addDeleteEventListeners();

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
        GET_alumni_by_id(button[0].getAttribute('alumni_id'), (alumni) => {
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
        GET_alumni_by_id(button[0].getAttribute('alumni_id'), (alumni) => {
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

$('#form_modal').on('hide.bs.modal', function (event) {
    resetForm();
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

    GET_alumni_entries(alumniParams ? alumniParams : '', (alumnis) => {
        alumnis.sort(function(a, b) {let textA = a.lastName.toUpperCase(); let textB = b.lastName.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});


        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

function renderTablefirstName(isReverse) {

    GET_alumni_sortentries(alumniParams, (alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.firstName.toUpperCase(); let textB = b.firstName.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.firstName.toUpperCase(); let textB = b.firstName.toUpperCase(); return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;});
        }

        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

function renderTablelastName(isReverse) {

    GET_alumni_sortentries(alumniParams,(alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.lastName.toUpperCase(); let textB = b.lastName.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.lastName.toUpperCase(); let textB = b.lastName.toUpperCase(); return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;});
        }
        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

function renderTablegradYear(isReverse) {

    GET_alumni_sortentries(alumniParams,(alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.gradYear; let textB = b.gradYear; return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.gradYear; let textB = b.gradYear; return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;});
        }
        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

function renderTabledegreeType(isReverse) {

    GET_alumni_sortentries(alumniParams,(alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.degreeType; let textB = b.degreeType; return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.degreeType; let textB = b.degreeType; return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;});
        }

        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

function renderTableoccupation(isReverse) {

    GET_alumni_sortentries(alumniParams,(alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.occupation.toUpperCase(); let textB = b.occupation.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.occupation.toUpperCase(); let textB = b.occupation.toUpperCase(); return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;});
        }

        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

function renderTableemail(isReverse) {

    GET_alumni_sortentries(alumniParams,(alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.email.toUpperCase(); let textB = b.email.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.email.toUpperCase(); let textB = b.email.toUpperCase(); return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;});
        }

        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}


function renderTableemailList(isReverse) {

    GET_alumni_sortentries(alumniParams,(alumnis) => {
        if (!isReverse) {
            alumnis.sort(function(a, b) {let textA = a.emailList; let textB = b.emailList; return (textA === textB) ? 0 : textA ? -1 : 1});
        }
        else {
            alumnis.sort(function(a, b) {let textA = a.emailList; let textB = b.emailList; return (textA === textB) ? 0 : textA ? 1 : -1});
        }
        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-secondary btn-sm mr-3' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>Update</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm delete_btn' alumni_id='${alumnis[i]._id}'>Delete</button></td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
    })
}

// AJAX CALLS

console.log('dashboard.js is loaded')