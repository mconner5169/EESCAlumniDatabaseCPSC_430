document.querySelector('#submit').addEventListener('click', renderAlumni)

function renderAlumni() {
    let url = '/api/alumniByEmail/' + document.querySelector('#alumni_id').value;
    GET_alumni_by_email(url, (alumni) => {
        console.log(alumni)
    })
}

// Returns a singel alumni entry
function GET_alumni_by_email(url, callback) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            if (callback) {callback(JSON.parse(xhr.responseText))}
        }
    }

    xhr.onerror = () => {
        console.log('XMLHTTMLRequest Error')
    }

}