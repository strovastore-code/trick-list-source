// Trick List Application
let tricks = [];
let nextId = Date.now(); // Start with timestamp, then increment

// DOM Elements
const trickInput = document.getElementById('trickInput');
const addBtn = document.getElementById('addBtn');
const trickList = document.getElementById('trickList');

// Load tricks from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTricks();
    renderTricks();
});

// Add trick event listener
addBtn.addEventListener('click', addTrick);
trickInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTrick();
    }
});

function addTrick() {
    const trickText = trickInput.value.trim();
    
    if (trickText === '') {
        alert('Please enter a trick name!');
        return;
    }
    
    const trick = {
        id: nextId++,
        text: trickText,
        completed: false
    };
    
    tricks.push(trick);
    saveTricks();
    renderTricks();
    
    trickInput.value = '';
    trickInput.focus();
}

function deleteTrick(id) {
    tricks = tricks.filter(trick => trick.id !== id);
    saveTricks();
    renderTricks();
}

function toggleTrick(id) {
    tricks = tricks.map(trick => {
        if (trick.id === id) {
            return { ...trick, completed: !trick.completed };
        }
        return trick;
    });
    saveTricks();
    renderTricks();
}

function renderTricks() {
    if (tricks.length === 0) {
        // Use DOM manipulation for consistency
        trickList.innerHTML = '';
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = 'No tricks yet. Add your first trick!';
        trickList.appendChild(li);
        return;
    }
    
    // Clear the list first
    trickList.innerHTML = '';
    
    // Create elements programmatically to avoid XSS
    tricks.forEach(trick => {
        const li = document.createElement('li');
        li.className = `trick-item ${trick.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', trick.id);
        
        const span = document.createElement('span');
        span.className = 'trick-text';
        span.textContent = trick.text; // Use textContent to prevent XSS
        span.style.cursor = 'pointer';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'trick-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(actionsDiv);
        trickList.appendChild(li);
    });
}

// Event delegation for trick list
trickList.addEventListener('click', (e) => {
    const trickItem = e.target.closest('.trick-item');
    if (!trickItem) return;
    
    const trickId = parseInt(trickItem.getAttribute('data-id'));
    
    if (e.target.classList.contains('delete-btn')) {
        deleteTrick(trickId);
    } else if (e.target.classList.contains('trick-text')) {
        toggleTrick(trickId);
    }
});

function saveTricks() {
    localStorage.setItem('tricks', JSON.stringify(tricks));
}

function loadTricks() {
    const storedTricks = localStorage.getItem('tricks');
    if (storedTricks) {
        try {
            tricks = JSON.parse(storedTricks);
            // Update nextId to be higher than any existing ID
            if (tricks.length > 0) {
                nextId = Math.max(...tricks.map(t => t.id)) + 1;
            }
        } catch (error) {
            console.error('Failed to parse stored tricks:', error);
            tricks = [];
        }
    }
}
