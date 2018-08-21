/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/
//***Pagination***
// Variables that store DOM elements
const students = document.querySelectorAll('.student-item');
// Converting "students" nodelist to an array
let arrayOfStudents = Array.from(students);
const page = document.querySelector('.page');

//  A function which displays a list of students according to a page number
const showPage = (pageNumber, studentList) => {
  // Looping through a students array
  for (let i=0; i < studentList.length; i +=1) {
    // Hiding all students on the page
    studentList[i].style.display="none";
    /* Extracting indexes of every student from the array.
       These indexes are then compared to a page number. Every page contains
       ten students (ten indexes). If index of a particular student is lower than
       a page number multiplied by ten and is equal to or greater than
       the result of an expression (page number * 10)-10, then this
       student will be displayed on the page.
       The mentioned expression represents indexes of previous pages.
    */
    if (studentList.indexOf(studentList[i]) < (pageNumber*10) &&
      studentList.indexOf(studentList[i]) >= ((pageNumber*10)-10)) {
      studentList[i].style.display = "block";
    }
  }
}


// A function that creates and appends pagination links
const appendPageLinks = (studentList) => {
  // Determing the number of pages depending on number of students
    const numberOfPages = Math.ceil(studentList.length / 10);
  /* Adding page links to the page link section by creating and appending
   new DOM elements*/
 // Creating a page link section
   const div = document.createElement('div');
   const paginationDiv = page.appendChild(div);
   paginationDiv.className = 'pagination';

   const ul = document.createElement('ul');
   let pageCounter = 0;
   for (let j=0; j < numberOfPages; j+=1) {
        pageCounter +=1;
        const li = document.createElement('li');
        const anchor = document.createElement('a');
        const paginationList = paginationDiv.appendChild(ul);
        const paginationListItem = paginationList.appendChild(li);
        const paginationAnchor = paginationListItem.appendChild(anchor);
        // Each pagination link will have its own number
        paginationAnchor.innerHTML = pageCounter;
    }

    /* Adding an eventlistener for the clicked page link*/
    const createdDiv = document.querySelector('div.pagination');
    function listen(event)  {
      if (event.target.tagName.toLowerCase() === "a") {
        showPage(event.target.textContent, studentList);
        event.target.className = 'active';
        }
      }
/* The following code allows to avoid duplication of event listeners
 when function is called more than once*/
    createdDiv.removeEventListener('click', listen);
    createdDiv.addEventListener('click', listen);
}

// Calling functions for displaying the first ten students from the list
showPage(1, arrayOfStudents);
appendPageLinks(arrayOfStudents);


//***Content filter***
// Creation of DOM elements: input field and "Search" button
const searchDiv = document.createElement('div');
const searchBox = document.createElement('input');
const buttonSearch = document.createElement('button');
buttonSearch.innerHTML = 'Search';
buttonSearch.setAttribute('id', 'searchButton');
searchBox.setAttribute('id', 'searchBox');

// Assigning classes and attributes to created DOM elements
searchDiv.className = 'student-search';
searchBox.type = 'text';
searchBox.placeholder = 'Search for students...'

// Appending created elements to the "header" div
const header = document.querySelector('.page-header');
header.appendChild(searchDiv);
searchDiv.appendChild(searchBox);
searchDiv.appendChild(buttonSearch);


// Processing input value typed in the searchBox
const contentFilter = (studentList) => {
  const search = searchBox.value;
  // Removing elements created by appendPageLinks function
  /* If pagination links were created previously (while making search
   requests through "Search" button, for example), they must be removed)*/
  const removePreviousLinks =() => {
    const createdDiv = document.querySelector('div.pagination');
    if (page.contains(createdDiv)=== true) {
      page.removeChild(createdDiv);
    }
  }
  removePreviousLinks();

  // Creation of a message which appears if no match is found
  const message = document.createElement('h1');
  message.innerHTML = 'No matching results have been found.';
  message.className = 'createdMessage';
  const matchedStudents = [];

    // Hiding currently displayed students
    for (let i=0; i < studentList.length; i +=1) {
      // Hiding all students on the page
      studentList[i].style.display="none";
      // Extracting text data from a Node list
      const name = studentList[i].querySelector('h3').textContent;
      const email = studentList[i].querySelector('.email').textContent;
      /* Comparison of input value from the search box to extacted text data,
      checking for full or partial match. If there is a match,
      a student information is displayed*/
      if (name.toLowerCase() === search.toLowerCase() ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase() === search.toLowerCase() ||
      email.toLowerCase().includes(search.toLowerCase())
    ) {
      matchedStudents.push(studentList[i]);
      studentList[i].style.display = 'block';
    }
  }
  /* If the message about zero matches has already been displayed as a
  result of previous search runs, it will be removed from the page. Thus
  multiple appearances of the same message are avoided*/
  const createdMessage = document.querySelector('.createdMessage');
  if (page.contains(createdMessage)=== true) {
    page.removeChild(createdMessage);
  }

    // If no matches are found, a message is appended to the page
    if (matchedStudents.length === 0) {
      page.appendChild(message);
    }

    /* If there is no input in the search box and
    button "Search" is pressed, first ten students from the array are displayed*/
    if (search === '') {
      showPage(1, arrayOfStudents);
      appendPageLinks(arrayOfStudents);
      removePreviousLinks();
    }

//if 10 or fewer results are returned, 0 pagination links are displayed
    if (matchedStudents.length > 10) {
      removePreviousLinks();
      appendPageLinks(matchedStudents);
    }
}

// Event listeners
document.addEventListener('click', function filter(event) {
   if(event.target && event.target.id == 'searchButton'){
     contentFilter(arrayOfStudents);
   }
});

document.addEventListener('keyup', function filter(event) {
   if(event.target && event.target.id == 'searchBox'){
     contentFilter(arrayOfStudents);
   }
});
