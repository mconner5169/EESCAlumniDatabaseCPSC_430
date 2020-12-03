// Global Variables
let isReverse;
let alumniParams = 'status=pending';

// EVENT LISTENERS

// Table Header Listener for sorting the table
const table = document.querySelector('table');
table.querySelectorAll('th').forEach((element) => {
        element.addEventListener('click', function(event) {
            const isReverse = (this.dataset.reverse == 'true');
            const sortParam = this.dataset.id;
            this.dataset.reverse = !isReverse;
            //console.log(isReverse) //debugging statement
            //console.log(sortParam) //debugging statement
            
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

//  tbody event listener for displaying accept and reject buttons
document.querySelector('tbody').addEventListener('mouseover', buttonVisibility);

// table event listener for hiding all accept and reject buttons when mouse leaves table
document.querySelector('table').addEventListener('mouseleave', (event) => {
    document.querySelectorAll('tbody button').forEach((button) => {
        button.style.visibility = 'hidden';
    });
});

document.querySelector('#search').addEventListener('click', (event) => {
    let gradYear = document.querySelector('#searchGradYear').value;
    let degreeType = document.querySelector('#searchDegreeType').value;
    let occupation = document.querySelector('#searchOccupation').value;
    alumniParams = (gradYear != '' ? 'gradYear=' + gradYear : ''  ) + (degreeType != '' ? '&degreeType=' + degreeType : '') + (occupation != '' ? '&occupation=' + occupation : '') + '&status=pending';
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



function addButtonEventListeners() {
    document.querySelectorAll('.accept_btn').forEach((btn) => { 
        let id = btn.getAttribute('alumni_id');
        btn.addEventListener('click', () => {
            POST_approve_alumni(id, (status) => {
                if (status == 200) {
                    renderTable();
                    resetForm();
                    $('#form_modal').modal('hide');
                }
            });
        });
    })
    document.querySelectorAll('.reject_btn').forEach((btn) => { 
        btn.addEventListener('click', () => {
            DELETE_alumni(btn.getAttribute('alumni_id'), (status) => {
                if (status == 200) {
                    renderTable();
                    resetForm();
                    $('#form_modal').modal('hide');
                }
            })
        });
    })
}

addButtonEventListeners();


// PAGE RENDERING FUNCTIONS


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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTablefirstName(isReverse) {

    GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTablelastName(isReverse) {

    GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTablegradYear(isReverse) {

    GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

       addButtonEventListeners();
    })
}

function renderTabledegreeType(isReverse) {

    GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTableoccupation(isReverse) {

   GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTableemail(isReverse) {

    GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

// doesn't sort - fix this
function renderTableemailList(isReverse) {

    GET_pending_alumni_sortentries(alumniParams, (alumnis) => {
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
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

//Modal Handler

$('#form_modal').on('show.bs.modal', function (event) {
    let errorList = document.querySelector('#errorList');
    errorList.innerHTML = '';
    let button = $(event.relatedTarget); 
    let crud_type = button.data('type'); 
    let modal = $(this);
    modal.find('.modal-title').text(crud_type + ' Alumni Entry');
 
    if (crud_type == 'View') {
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
    } 
});

$('#form_modal').on('hide.bs.modal', function (event) {
    resetForm();
}); 

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


// AJAX CALLS

// function updateHandler(url){
    // POST_alumni(url, null, (status) => {
    //     console.log('all good in the neighborhood');
    // });
// }

console.log('pending.js loaded')