const draggables = document.querySelectorAll('.btn-draggable');
const droppables = document.querySelectorAll('.droppable');
const submitButton = document.getElementById('submit');
const errorMessage = document.getElementById('error-message');
const importantOptions = document.getElementById('important-options');
const notImportantOptions = document.getElementById('not-important-options');

// Helper to handle drag and drop for both mouse and touch
function enableDragAndDrop(draggable) {
  // Mouse events
  draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text', e.target.id);
  });

  // Touch events
  draggable.addEventListener('touchstart', (e) => {
    e.target.classList.add('dragging');
  });

  draggable.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const draggable = document.querySelector('.dragging');
    draggable.style.position = 'absolute';
    draggable.style.left = `${touch.clientX - draggable.offsetWidth / 2}px`;
    draggable.style.top = `${touch.clientY - draggable.offsetHeight / 2}px`;
  });

  draggable.addEventListener('touchend', (e) => {
    const draggable = document.querySelector('.dragging');
    draggable.style.position = 'static';
    draggable.classList.remove('dragging');
    droppables.forEach((droppable) => {
      const rect = droppable.getBoundingClientRect();
      const touch = e.changedTouches[0];
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        if (!droppable.contains(draggable)) {
          droppable.appendChild(draggable);
        }
      }
    });
  });
}

// Apply drag-and-drop functionality to each draggable item
draggables.forEach((draggable) => enableDragAndDrop(draggable));

// Handle droppable areas
droppables.forEach((droppable) => {
  droppable.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  droppable.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const draggable = document.getElementById(id);
    if (!droppable.contains(draggable)) {
      droppable.appendChild(draggable);
    }
  });
});

// Handle form submission
submitButton.addEventListener('click', () => {
  const importantItems = document.querySelectorAll('#important .btn-draggable');
  const notImportantItems = document.querySelectorAll('#not-important .btn-draggable');

  if (importantItems.length + notImportantItems.length !== draggables.length) {
    errorMessage.textContent = "Error: Please drag all the options to either 'Important' or 'Not Important' sections.";
    return;
  }
  errorMessage.textContent = "";

  importantOptions.textContent = "Important: " + Array.from(importantItems).map((item) => item.textContent.trim()).join(", ");
  notImportantOptions.textContent = "Not Important: " + Array.from(notImportantItems).map((item) => item.textContent.trim()).join(", ");
});
