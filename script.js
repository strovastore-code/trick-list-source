// Trick List Application
let tricks = [];

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
        id: Date.now(),
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
        trickList.innerHTML = '<li class="empty-state">No tricks yet. Add your first trick!</li>';
        return;
    }
    
    trickList.innerHTML = tricks.map(trick => `
        <li class="trick-item ${trick.completed ? 'completed' : ''}" data-id="${trick.id}">
            <span class="trick-text" onclick="toggleTrick(${trick.id})">${trick.text}</span>
            <div class="trick-actions">
                <button class="delete-btn" onclick="deleteTrick(${trick.id})">Delete</button>
            </div>
        </li>
    `).join('');
}

function saveTricks() {
    localStorage.setItem('tricks', JSON.stringify(tricks));
}

function loadTricks() {
    const storedTricks = localStorage.getItem('tricks');
    if (storedTricks) {
        tricks = JSON.parse(storedTricks);
    }
}
