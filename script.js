const draggables = document.querySelectorAll('.btn-draggable');
const droppables = document.querySelectorAll('.droppable');
const submitButton = document.getElementById('submit');
const errorMessage = document.getElementById('error-message');
const importantOptions = document.getElementById('important-options');
const notImportantOptions = document.getElementById('not-important-options');


draggables.forEach((draggable) => {
	draggable.addEventListener('dragstart', (e) => {
		e.dataTransfer.setData('text', e.target.id);
	})
});

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

