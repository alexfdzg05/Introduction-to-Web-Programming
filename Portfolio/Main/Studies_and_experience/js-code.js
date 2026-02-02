// === LIBROS ===
const bookText = "C/:Book recommendations! ^^";
const bookTerminal = document.querySelector('.terminal');
let bookIndex = 0;

// Crear cursor para libros
const bookCursor = document.createElement('span');
bookCursor.id = 'cursor';
bookCursor.textContent = '█';
bookTerminal.textContent = '';
bookTerminal.appendChild(bookCursor);

function typeBook() {
    if (bookIndex < bookText.length) {
        bookCursor.insertAdjacentText('beforebegin', bookText[bookIndex]);
        bookIndex++;
        setTimeout(typeBook, 100);
    } else {
        // Cuando termina el libro, empieza el curso
        typeCourse();
    }
}

// === CURSOS ===
const courseText = "C/:Course recommendations! ^^";
const courseTerminal = document.querySelector('.terminal-course');
let courseIndex = 0;

// Crear cursor para cursos
const courseCursor = document.createElement('span');
courseCursor.id = 'cursor';
courseCursor.textContent = '█';
courseTerminal.textContent = '';
courseTerminal.appendChild(courseCursor);

function typeCourse() {
    if (courseIndex < courseText.length) {
        courseCursor.insertAdjacentText('beforebegin', courseText[courseIndex]);
        courseIndex++;
        setTimeout(typeCourse, 100);
    }
}

// Iniciar animación de libros
typeBook();