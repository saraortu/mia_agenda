document.addEventListener('DOMContentLoaded', function() {
    // Elementi del DOM
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const prevYearBtn = document.getElementById('prev-year');
    const nextYearBtn = document.getElementById('next-year');
    const noteModal = document.getElementById('note-modal');
    const modalDate = document.getElementById('modal-date');
    const noteText = document.getElementById('note-text');
    const saveNoteBtn = document.getElementById('save-note');
    const deleteNoteBtn = document.getElementById('delete-note');
    const cancelNoteBtn = document.getElementById('cancel-note');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Selezione della data attuale
    let currentDate = new Date();
    let selectedDate = null;
    
    // Inizializza il calendario
    renderCalendar();
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    prevYearBtn.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        renderCalendar();
    });
    
    nextYearBtn.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        renderCalendar();
    });
    
    saveNoteBtn.addEventListener('click', saveNote);
    deleteNoteBtn.addEventListener('click', deleteNote);
    cancelNoteBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Funzione per renderizzare il calendario
    function renderCalendar() {
        // Aggiorna il titolo del mese/anno
        const months = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        currentMonthYear.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Pulisci il calendario
        calendarDays.innerHTML = '';
        
        // Ottieni il primo giorno del mese e l'ultimo giorno del mese
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const today = new Date();
        
        // Ottieni il giorno della settimana del primo giorno (0 = Domenica, 1 = Lunedì, ecc.)
        let firstDayOfWeek = firstDay.getDay();
        // Convertiamo in formato italiano (Lunedì = 0)
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Aggiungi giorni vuoti per allineare il primo giorno
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            calendarDays.appendChild(emptyDay);
        }
        
        // Aggiungi i giorni del mese
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            
            // Evidenzia il giorno corrente
            if (dayDate.toDateString() === today.toDateString()) {
                day.classList.add('today');
            }
            
            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = i;
            
            const dayNotePreview = document.createElement('div');
            dayNotePreview.classList.add('day-note-preview');
            
            day.appendChild(dayNumber);
            day.appendChild(dayNotePreview);
            
            // Crea una data per questo giorno
            const dateKey = formatDateKey(dayDate);
            
            // Controlla se c'è una nota per questo giorno
            const note = getNote(dateKey);
            if (note) {
                day.classList.add('has-note');
                dayNotePreview.textContent = note.length > 20 ? note.substring(0, 20) + '...' : note;
            }
            
            // Aggiungi event listener per aprire la nota
            day.addEventListener('click', () => openNoteModal(dayDate));
            
            calendarDays.appendChild(day);
        }
    }
    
    // Funzione per formattare la data come chiave (YYYY-MM-DD)
    function formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Funzione per ottenere una nota dal localStorage
    function getNote(dateKey) {
        const notes = JSON.parse(localStorage.getItem('calendarNotes') || '{}');
        return notes[dateKey];
    }
    
    // Funzione per salvare una nota nel localStorage
    function saveNoteToStorage(dateKey, note) {
        const notes = JSON.parse(localStorage.getItem('calendarNotes') || '{}');
        if (note) {
            notes[dateKey] = note;
        } else {
            delete notes[dateKey];
        }
        localStorage.setItem('calendarNotes', JSON.stringify(notes));
    }
    
    // Funzione per aprire il modal della nota
    function openNoteModal(date) {
        selectedDate = date;
        const dateKey = formatDateKey(date);
        
        // Formatta la data per il titolo
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        modalDate.textContent = `Note per ${date.toLocaleDateString('it-IT', options)}`;
        
        // Carica la nota esistente
        noteText.value = getNote(dateKey) || '';
        
        // Mostra il modal
        noteModal.style.display = 'flex';
        noteText.focus();
    }
    
    // Funzione per chiudere il modal
    function closeModal() {
        noteModal.style.display = 'none';
        selectedDate = null;
    }
    
    // Funzione per salvare la nota
    function saveNote() {
        if (!selectedDate) return;
        const dateKey = formatDateKey(selectedDate);
        const note = noteText.value.trim();
        saveNoteToStorage(dateKey, note);
        closeModal();
        renderCalendar();
    }
    
    // Funzione per eliminare la nota
    function deleteNote() {
        if (!selectedDate) return;
        const dateKey = formatDateKey(selectedDate);
        saveNoteToStorage(dateKey, null);
        closeModal();
        renderCalendar();
    }
    
    // Chiudi il modal se si clicca fuori dal contenuto
    window.addEventListener('click', (e) => {
        if (e.target === noteModal) {
            closeModal();
        }
    });
    

});