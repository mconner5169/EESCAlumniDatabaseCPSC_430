document.querySelector('#submit').addEventListener('click', renderAlumni)

function renderAlumni() {
    let email = document.querySelector('#alumni_id').value;
    GET_alumni_by_email(email, (alumni) => {
        console.log(alumni)
        document.querySelector('#container').style.width = '50rem';
        document.querySelector('#container').style.margin = 'auto';
    })
}

