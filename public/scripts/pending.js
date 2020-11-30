// Global Variables
let isReverse;

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
        btn.addEventListener('click', POST_approve_alumni);
    })
    document.querySelectorAll('.reject_btn').forEach((btn) => { 
        btn.addEventListener('click', DELETE_alumni);
    })
}

addButtonEventListeners();


// PAGE RENDERING FUNCTIONS


// Renders table with updated database
function renderTable() {
    GET_pending_alumni_entries((alumnis) => {
        alumnis.sort(function(a, b) {let textA = a.lastName.toUpperCase(); let textB = b.lastName.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr');
            tr.innerHTML = `
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTablefirstName(isReverse) {

    GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTablelastName(isReverse) {

    GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTablegradYear(isReverse) {

    GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

       addButtonEventListeners();
    })
}

function renderTabledegreeType(isReverse) {

    GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTableoccupation(isReverse) {

   GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

function renderTableemail(isReverse) {

    GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

// doesn't sort - fix this
function renderTableemailList(isReverse) {

    GET_pending_alumni_entries((alumnis) => {
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
            <td class='text-truncate'>${alumnis[i].firstName}</td>
            <td class='text-truncate'>${alumnis[i].lastName}</td>
            <td class='text-truncate'>${alumnis[i].gradYear}</td>
            <td class='text-truncate'>${alumnis[i].degreeType}</td>
            <td class='text-truncate'>${alumnis[i].occupation}</td>
            <td class='text-truncate'>${alumnis[i].email}</td>
            <td>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
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
function GET_pending_alumni_entries(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/alumnis/pending', true);
    
    xhr.send();

    xhr.onload = function() {
        if (callback) {callback(JSON.parse(xhr.response))}
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
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
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }


}

function POST_approve_alumni(event) {
    let url = '/admin/' + event.srcElement.getAttribute('alumni_id') + '/approve';

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            renderTable();
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }
}