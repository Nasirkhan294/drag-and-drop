const draggables = document.querySelectorAll('.btn-draggable');
const droppables = document.querySelectorAll('.droppable');
const submitButton = document.getElementById('submit');
const errorMessage = document.getElementById('error-message');
const importantOptions = document.getElementById('important-options');
const notImportantOptions = document.getElementById('not-important-options');

// Function to update button background color
function updateButtonColors(button) {
	button.style.backgroundColor = 'rgb(77, 77, 241)';
	button.style.opacity = '50%';
	button.style.color = '#fff';
	button.style.fontWeight = '700';
}

// Function to revert button to its original position
function revertButton(clonedButton) {
	const originalButton = document.getElementById(clonedButton.dataset.originalId);
	originalButton.disabled = false; // Enable the original button
	clonedButton.remove(); // Remove the cloned button
}

// Function to clone and move the button
function moveToContainer(button, container) {
	const clonedButton = button.cloneNode(true);
	clonedButton.setAttribute('draggable', false); // Disable drag on cloned button
	clonedButton.dataset.originalId = button.id; // Store reference to the original button
	updateButtonColors(clonedButton);
	container.appendChild(clonedButton);
	button.disabled = true; // Disable the original button

	// Add double-click event to revert the button
	clonedButton.addEventListener('dblclick', () => {
		revertButton(clonedButton);
    });
}

// Helper function to handle drag and drop for both mouse and touch
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
		draggable.style.zIndex = '1000';
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
				if(!droppable.querySelector(`#${draggable.id}`)) {
					moveToContainer(draggable, droppable);
				}
			}
		});
	});

	// Add click functionality to move button
	draggable.addEventListener('click', () => {
		const targetContainer = confirm('Move to Important? Click OK for Important or Cancel for Not Important.')
		    ? document.getElementById('important')
			: document.getElementById('not-important');
		if (!targetContainer.querySelector(`#${draggable.id}`)) {
			moveToContainer(draggable, targetContainer);
		}
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
		if (!droppable.querySelector(`#${draggable.id}`)) {
			moveToContainer(draggable, droppable);
		}
	});
});

// Handle form submission
submitButton.addEventListener('click', () => {
	const importantItems = document.querySelectorAll('#important .btn-draggable');
	const notImportantItems = document.querySelectorAll('#not-important .btn-draggable');

	if (importantItems.length + notImportantItems.length !== draggables.length) {
		errorMessage.textContent = "Error: Please drag or click all the options to either 'Important' or 'Not Important' sections.";
		return;
	}
	errorMessage.textContent = "";

	importantOptions.textContent = "Important: " + Array.from(importantItems).map((item) => item.textContent.trim()).join(", ");
	notImportantOptions.textContent = "Not Important: " + Array.from(notImportantItems).map((item) => item.textContent.trim()).join(", ");
});