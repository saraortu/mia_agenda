document.addEventListener("DOMContentLoaded", () => {
 
    const notesElement = document.getElementById("note-element");
    const noteInput = document.getElementById("note");
    const addNote = document.getElementById("add-note");

     //aggiungo la nota
     addNote.addEventListener("click", () => {
        //rimuove gli spazi bianchi all'inizio e alla fine della stringa
        const single_note = noteInput.value.trim();
        //controlla se la stringa non è vuota e aggiunge la nuova nota al localStorage
        if (single_note) {
            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            //aggiungo la nota con push
            notes.push(single_note);
            localStorage.setItem("notes", JSON.stringify(notes));
            noteInput.value = "";
            loadNotes();
        }
    });

    //elimina la nota
    window.deleteNote = (index) => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    };


    //carico le note dal localStorage
    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        //rimuovo eventuali note precedenti per evitare duplicati
        notesElement.innerHTML = "";
        //ripetizione per inserire le note
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            //creo un elemento dell'elenco con la classe swipe-item
            li.classList.add("swipe-item");
            //aggiungo l'indice alla proprietà data-index per identificare la posizione della nota nel localStorage
            li.dataset.index = index;
            //aggiungo il testo della nota
            li.innerHTML = `
                <span>${note}</span>
                <button class="delete-btn" onclick="deleteNote(${index})">elimina</button>
            `;
            //aggiungo l'elemento dell'elenco alla lista
            notesElement.appendChild(li);

            //aggiungo gli eventi swipe (per ora non è attivo)
            addSwipeHandler(li, index);
        });
    };


    const addSwipeHandler = (element, index) => {
        let startX, moved = false;
        
        const startDrag = (e) => {
            startX = e.clientX || e.touches[0].clientX;
            moved = false;
        };
        
        const moveDrag = (e) => {
            let moveX = e.clientX || e.touches[0].clientX;
            let diff = startX - moveX;
            if (diff > 50) {
                moved = true;
                element.style.transition = "transform 1.0s ease";
                element.style.transform = "translateX(-100%)";
            }
        };
        
        const endDrag = () => {
            if (moved) {
                setTimeout(() => {
                    deleteNote(parseInt(element.dataset.index));
                }, 400);
            } else {
                element.style.transform = "translateX(0)";
            }
        };
        
        element.addEventListener("mousedown", startDrag);
        element.addEventListener("mousemove", moveDrag);
        element.addEventListener("mouseup", endDrag);
        element.addEventListener("mouseleave", endDrag);
        
        element.addEventListener("touchstart", startDrag);
        element.addEventListener("touchmove", moveDrag);
        element.addEventListener("touchend", endDrag);
    };

    //carico le note in caso fossero già presenti
    loadNotes();

});