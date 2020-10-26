
// alumni_table event listener for displaying edit and delete links
document.querySelector('#alumni_table tbody').addEventListener('mouseover', (event) => {

    // Reset the display of all edit and delete links
    document.querySelectorAll('#alumni_table tbody a').forEach((link) => {
        link.style.visibility = 'hidden';
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
        tr.querySelectorAll('a').forEach((link) => {
            console.log(link.innerHTML);
            link.style.visibility = 'visible';
        });
    }
});

document.querySelector('#alumni_table').addEventListener('mouseleave', (event) => {
    document.querySelectorAll('#alumni_table tbody a').forEach((link) => {
        link.style.visibility = 'hidden';
    });
});