// How long has it been since the their last confession?
document.getElementById('last-confession').addEventListener('change', updateElapsedTime);

function updateElapsedTime()
{
	const dateInput = document.getElementById('last-confession').value;
	const output = document.getElementById('confession-elapsed');

	if (!dateInput)
	{
		output.textContent = '';
		return;
	}

	const selectedDate = new Date(dateInput);
	const today = new Date();

	// Clear the time portions
	selectedDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	const diffTime = today.getTime() - selectedDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const weeks = Math.floor(diffDays / 7);
	const days = diffDays % 7;

	if (diffDays < 0)
	{
		output.textContent = "That date is in the future.";
	}
	else if (diffDays === 0)
	{
		output.textContent = "Today is your confession day!";
	}
	else
	{
		let message = "It has been ";
		if (weeks > 0) message += `${weeks} week${weeks > 1 ? 's' : ''}`;
		if (weeks > 0 && days > 0) message += " and ";
		if (days > 0) message += `${days} day${days > 1 ? 's' : ''}`;
		message += " since your last confession.";
		output.textContent = message;
	}
}
document.getElementById('last-confession').addEventListener('change', updateElapsedTime);
window.addEventListener('DOMContentLoaded', () =>
{
	updateElapsedTime(); // Updates on page load if a value is present
});