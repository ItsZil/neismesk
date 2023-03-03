const dropdownContent = document.querySelector('.dropdown-content');
const loggedOut = true; // change to false to see the logged-in state

if (loggedOut) {
	dropdownContent.querySelector('.logged-out').style.display = 'block';
} else {
	dropdownContent.querySelector('.logged-in').style.display = 'block';
}

