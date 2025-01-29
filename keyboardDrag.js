document.addEventListener('DOMContentLoaded', function () {
	let selectedButton = null;
	let clonedButton = null;
	let currentContainer = null;
	const buttons = document.querySelectorAll('.btn-draggable');
	const containers = document.querySelectorAll('.droppable');
	const submitButton = document.getElementById('submit');

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
		if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
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
		const button = buttons[index];
		if (selectedButton) {
			selectedButton.classList.remove('highlighted');
		}
		selectedButton = button;
		selectedButton.classList.add('highlighted');

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
		currentContainer = containers[index];
		currentContainer.appendChild(clonedButton);
		// Disable the original button and remove highlight
		selectedButton.disabled = true;
		selectedButton.classList.remove('highlighted');
		
		// Reset clonedButton & selectedButton to prevent duplicate cloning
		clonedButton = null;
		selectedButton = null; 
	}

	// Function to remove the button from the container
	function removeButtonFromContainer(buttonIndex) {
		const buttonId = buttons[buttonIndex].id;

		// Find and remove the correct cloned button from any container
		let found = false;
		containers.forEach(container => {
			const clonedButtons = container.querySelectorAll('.cloned');
			clonedButtons.forEach(clone => {
				if (clone.id === buttonId) {
					container.removeChild(clone);
					buttons[buttonIndex].disabled = false;
					buttons[buttonIndex].classList.remove('highlighted');
					found = true;
				}
			});
		});

		if (found) {
			selectedButton = null;
		}
	}

	// Function to submit form
	function submitForm() {
		document.getElementById('important-options').innerHTML =
			'Important: ' + getContainerOptions('important');
		document.getElementById('highly-important-options').innerHTML =
			'Highly Important: ' + getContainerOptions('highly-important');
		document.getElementById('not-important-options').innerHTML =
			'Not Important: ' + getContainerOptions('not-important');
		document.getElementById('neutral-options').innerHTML =
			'Neutral: ' + getContainerOptions('neutral');
	}

	// Function to get selected options from a container
	function getContainerOptions(containerId) {
		const container = document.getElementById(containerId);
		const items = Array.from(container.children).map((item) => item.textContent.trim());
		return items.length > 0 ? items.join(', ') : '';
	}

	// Click event for submit button
	submitButton.addEventListener('click', submitForm);
});
