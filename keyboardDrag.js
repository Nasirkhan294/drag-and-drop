document.addEventListener('DOMContentLoaded', function () {
	let clonedButton = null;
	let currentContainer = null;

	// Button selection logic (1-6)
	document.addEventListener('keydown', function (e) {
		if (e.key >= '1' && e.key <= '6') {
			const buttonIndex = parseInt(e.key) - 1;
			selectButton(buttonIndex);
		}

		// Container selection (A-D)
		if (e.key >= 'a' && e.key <= 'd') {
			const containerIndex = e.key.charCodeAt(0) - 'a'.charCodeAt(0);
			selectContainer(containerIndex);
		}

		// Remove button from container (Ctrl + 1-6)
		if (e.key >= '1' && e.key <= '6') {
			const buttonIndex = parseInt(e.key) - 1;
			removeButtonFromContainer(buttonIndex);
		}

		// Submit form (Enter key)
		if (e.key === 'Enter') {
			submitForm();
		}
	});

	// Function to highlight and select a button
	function selectButton(index) {
		const button = draggables[index];
		highlightButton(button);

		// Check if the button is already disabled (already moved to a container)
		if (button.disabled) return;

		// Clone the selected button
		clonedButton = button.cloneNode(true);
		clonedButton.classList.add('cloned');
		clonedButton.dataset.originalIndex = index; // Store original index
	}

	// Function to select a container
	function selectContainer(index) {
		if (!clonedButton) return;
		clonedButton.classList.remove('highlighted');
		currentContainer = droppables[index];
		updateButtonStyles(clonedButton);
		currentContainer.appendChild(clonedButton);
		// Disable the original button and remove highlight
		highlightedButton.disabled = true;
		unhighlightButton();
	}

	// Function to remove the button from the container
	function removeButtonFromContainer(buttonIndex) {
		const buttonId = draggables[buttonIndex].id;

		// Find and remove the correct cloned button from any container
		let found = false;
		droppables.forEach(container => {
			const clonedButtons = container.querySelectorAll('.cloned');
			clonedButtons.forEach(clone => {
				if (clone.id === buttonId) {
					container.removeChild(clone);
					draggables[buttonIndex].disabled = false;
					draggables[buttonIndex].classList.remove('highlighted');
					found = true;
				}
			});
		});

		if (found) {
			highlightedButton = null;
		}
	}

	// Function to submit form
	function submitForm() {
		if (selectAllSwitch.checked) {
			if (!checkIfAllButtonsMoved()) {
				errorMessage.textContent = "Error: Please drag all options to either 'Important', 'Highly Important', 'Not Important' or 'Neutral' sections.";
			}
			errorMessage.textContent = "";
		} else {
			errorMessage.textContent = "";
		}

		updateListItems();
	}


	// Click event for submit button
	submitButton.addEventListener('click', submitForm);

	// Remove highlighted class when dragstart or click drag events triggered
	draggables.forEach(draggable => {
		draggable.addEventListener('dragstart', function () {
			if (highlightedButton) {
				highlightedButton.classList.remove('highlighted');
			}
		});

		draggable.addEventListener('mousedown', function () {
			// If there was a previously highlighted button, remove the class
			if (highlightedButton) {
				highlightedButton.classList.remove('highlighted');
			}
		});
	});
});
