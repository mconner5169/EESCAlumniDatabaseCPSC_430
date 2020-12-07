document.querySelector('#submit').addEventListener('click', renderAlumni)

function renderAlumni() {


    let email = document.querySelector('#email-search').value;

    if (email != '') {
        GET_alumni_by_email(email, (alumni) => {


            if (alumni !== undefined) {
                if (document.querySelector('.card').classList.contains('expanded')) {
                    document.querySelector('.card').style.height = '8rem';
                    document.querySelector('.card').style.width = '22rem';
                    setTimeout(() => {
                        document.querySelector('#alumni_entry').style.display = 'none';
                        document.querySelector('#email-search').classList.remove('col-md-10');
                        document.querySelector('#search-btn-container').classList.remove('col-md-2');
                    }, 300);
                    setTimeout(() => {
                        document.querySelector('.expanded').classList.remove('expanded');
                        expand(alumni)
                    }, 800);
                } else {
                expand(alumni);     
                }           
            }
        })
    }
}

function expand(alumni) {
    document.querySelector('#firstName').value = alumni.firstName;
    document.querySelector('#lastName').value = alumni.lastName;
    document.querySelector('#gradYear').value = alumni.gradYear;
    document.querySelector('#degreeType').value = alumni.degreeType;
    document.querySelector('#email').value = alumni.email;
    document.querySelector('#occupation').value = alumni.occupation;
    document.querySelector('#description').value = alumni.description;



    if (window.innerWidth <= 768) {
        document.querySelector('.card').style.width = '100%';
    } else  {
        document.querySelector('.card').style.width = '70%';
        document.querySelector('#email-search').classList.toggle('col-md-10', true);
        document.querySelector('#search-btn-container').classList.toggle('col-md-2', true);
    }
    document.querySelector('.card').style.height = '40rem';
    setTimeout( () => {
        document.querySelector('#alumni_entry').style.display = 'block';
        document.querySelector('.card').classList.toggle('expanded', true);
    }, 300);


}

