
// EVENT LISTENERS

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
        let id = btn.getAttribute('alumni_id');
        btn.addEventListener('click', () => {
            POST_approve_alumni(id, (status) => {
                if (status == 200) {
                    renderTable();
                }
            });
        });
    })
    document.querySelectorAll('.reject_btn').forEach((btn) => { 
        btn.addEventListener('click', () => {
            DELETE_alumni(btn.getAttribute('alumni_id'), (status) => {
                if (status == 200) {
                    renderTable();
                }
            })
        });
    })
}

addButtonEventListeners();


// PAGE RENDERING FUNCTIONS


// Renders table with updated database
function renderTable() {
    GET_alumni_entries('status=pending', (alumnis) => {
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


// AJAX CALLS

// function updateHandler(url){
    // POST_alumni(url, null, (status) => {
    //     console.log('all good in the neighborhood');
    // });
// }

console.log('pending.js loaded')