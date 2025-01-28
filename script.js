const draggables = document.querySelectorAll('.btn-draggable');
const droppables = document.querySelectorAll('.droppable');
const submitButton = document.getElementById('submit');
const errorMessage = document.getElementById('error-message');
const importantOptions = document.getElementById('important-options');
const highlyImportantOptions = document.getElementById('highly-important-options');
const notImportantOptions = document.getElementById('not-important-options');
const neutralOptions = document.getElementById('neutral-options');
const selectAllSwitch = document.getElementById('select-all-switch');

let highlightedButton = null; // To track the highlighted button

// Function to highlight the button
function highlightButton(button) {
	if (highlightedButton) {
		highlightedButton.classList.remove('highlighted');
	}
	highlightedButton = button;
	button.classList.add('highlighted');
}

// Function to unhighlight the button
function unhighlightButton() {
	if (highlightedButton) {
		highlightedButton.classList.remove('highlighted');
		highlightedButton = null;
	}
}

// Function to update button styles
function updateButtonStyles(button) {
	button.style.backgroundColor = 'rgb(109, 109, 245)';
	button.style.color = '#fff';
}

// Function to create and add the cross button
function createCrossButton(clonedButton) {
	const crossBtn = document.createElement('i');
	crossBtn.classList.add('fas', 'fa-times');

	// Add event listener to remove the button when the cross is clicked
	crossBtn.addEventListener('click', () => {
		revertButton(clonedButton);
	});

	clonedButton.appendChild(crossBtn);
}

// Function to revert the button
function revertButton(clonedButton) {
	const originalButton = document.getElementById(clonedButton.dataset.originalId);
	originalButton.disabled = false; // Enable the original button
	clonedButton.remove(); // Remove the cloned button
	updateListItems(); // Re-update the Important and Not Important lists
}

// Function to move the button
function moveToContainer(button, container) {
	// Ensure the highlighted class is removed before moving
	button.classList.remove('highlighted');

	const clonedButton = button.cloneNode(true);
	clonedButton.setAttribute('draggable', false); // Disable drag on cloned button
	clonedButton.dataset.originalId = button.id; // Store reference to the original button
	updateButtonStyles(clonedButton);
	container.appendChild(clonedButton);
	button.disabled = true; // Disable the original button

	// Add the cross button to allow the user to revert the button
	createCrossButton(clonedButton);

	// Add double-click event to revert the button
	clonedButton.addEventListener('dblclick', () => {
		revertButton(clonedButton);
	});
}

// Function to handle click-to-move
function handleClickToMove(container) {
	if (highlightedButton && !container.querySelector(`#${highlightedButton.id}`)) {
		moveToContainer(highlightedButton, container);
		unhighlightButton();
	}
}

// Enable drag-and-drop functionality
function enableDragAndDrop(draggable) {
	draggable.addEventListener('dragstart', (e) => {
		unhighlightButton(); // Unhighlight any previously highlighted button
		e.dataTransfer.setData('text', e.target.id);
	});

	// Touch events
	draggable.addEventListener('touchstart', (e) => {
		unhighlightButton(); // Unhighlight any previously highlighted button
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
		draggable.style.position = 'relative';
		draggable.style.left = '';
		draggable.style.top = '';
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
				if (!droppable.querySelector(`#${draggable.id}`)) {
					moveToContainer(draggable, droppable);
				}
			}
		});
	});

	draggable.addEventListener('click', () => {
		highlightButton(draggable); // Highlight the button on click
	});
}

// Apply drag-and-drop functionality to each draggable
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

	droppable.addEventListener('click', () => {
		handleClickToMove(droppable); // Move the highlighted button on click
	});
});

// Function to update the "Important" and "Not Important" lists
function updateListItems() {
	const importantItems = document.querySelectorAll('#important .btn-draggable');
	const highlyImportantItems = document.querySelectorAll('#highly-important .btn-draggable');
	const notImportantItems = document.querySelectorAll('#not-important .btn-draggable');
	const neutralItems = document.querySelectorAll('#neutral .btn-draggable');

	// Update the content for Important and Not Important sections
	importantOptions.textContent = "Important: " + Array.from(importantItems).map((item) => item.textContent.trim()).join(", ");
	highlyImportantOptions.textContent = "Highly Important: " + Array.from(highlyImportantItems).map((item) => item.textContent.trim()).join(", ");
	notImportantOptions.textContent = "Not Important: " + Array.from(notImportantItems).map((item) => item.textContent.trim()).join(", ");
	neutralOptions.textContent = "Neutral: " + Array.from(neutralItems).map((item) => item.textContent.trim()).join(", ");

	// Update error message based on the select all status
	if(selectAllSwitch.checked) {
		if (!checkIfAllButtonsMoved()) {
			errorMessage.textContent = "Error: Please drag all options to either 'Important' or 'Not Important' sections"
		} else {
			errorMessage.textContent = "";
		}
	}
}

// Function to check if all buttons are moved
function checkIfAllButtonsMoved() {
	const importantItems = document.querySelectorAll('#important .btn-draggable');
	const highlyImportantItems = document.querySelectorAll('#highly-important .btn-draggable');
	const notImportantItems = document.querySelectorAll('#not-important .btn-draggable');
	const neutralItems = document.querySelectorAll('#neutral .btn-draggable');
	return importantItems.length + highlyImportantItems.length + notImportantItems.length + neutralItems.length === draggables.length;
}

// Handle form submission
submitButton.addEventListener('click', () => {
	
	if (selectAllSwitch.checked) {
		// If the "Select All" switch in ON, check if all buttons are moved
		if (!checkIfAllButtonsMoved()) {
			errorMessage.textContent = "Error: Please drag all options to either 'Important' or 'Not Important' sections.";
			return;
		}
		errorMessage.textContent = "";
	} else {
		// If the "Select all" switch is OFF, just display the added buttons without error
		errorMessage.textContent = "";
	}

	//  If everything is working fine, update the "Important" and "Not Important sections."
	updateListItems();
});

// Dark Mode theme
const darkMode = document.getElementById('dark-mode-toggle');
darkMode.addEventListener('click', () => {
	document.body.classList.toggle('dark-mode');
});
