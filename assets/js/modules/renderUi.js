const clearContainer = (container) => {
	container.innerHTML = "";
};

const renderCell = (cell, text) => {
	return `<${cell}>${text}</${cell}>`;
};

const createButton = (id, className, action, textContent, ) => {
	return `<button id="${id}" class="${className}" data-js-action="${action}">${textContent}</button>`;
};

const renderRow = (cell, user, button = "") => {
	let row = "";
	user.forEach(text => {
		row += renderCell(cell, text);
	});
	return `<tr>${row} <td>${button}</td></tr>`;
};

const renderList = (container, users) => {
	clearContainer(container);
	let fragment = "";
	users.forEach(user => {
		const { id, name, email, phone } = user;
		const btn = createButton(id, "btn btn-danger ms-auto", "click:delete", "Delete");
		fragment += `
		<li class="list-group-item d-flex align-items-center">
			${id}. ${name}, ${email}, ${phone} ${btn}
		</li>`;
	});
	const ul = `
		<ul class="list-group">
			${fragment}
		</ul>
	`;

	container.insertAdjacentHTML("afterbegin", ul);
};

const renderTable = (container, users) => {
	clearContainer(container);
	let thead = "";
	let tbody = "";
	users.forEach((user, index) => {
		const btn = createButton(user.id, "btn btn-danger", "click:delete", "Delete");
		if (index === 0) {
			thead += renderRow("th", Object.keys(user));
		}
		tbody += renderRow("td", Object.values(user), btn);
	});
	const table = `
		<table class="table table-striped">
			${thead}
			${tbody}
		</table>
	`;
	container.insertAdjacentHTML("afterbegin", table);
};

const createRadioButtons = () => {
	return `
	<div class="form-check form-check-inline">
		<label class="form-check-label">
			<input class="form-check-input js-radio-input" type="radio" name="toggler" value="table" data-js-action="render-ui" checked>
			<span>Table view</span>
		</label>
		<label class="form-check-label">
			<input class="form-check-input js-radio-input" type="radio" name="toggler" value="list" data-js-action="render-ui">
			<span>List view</span>
		</label>
  	</div>
	`;
};

const renderUi = (container, value, filteredUsers) => (value === "table" ? renderTable(container, filteredUsers) : renderList(container, filteredUsers));

export { createRadioButtons, createButton, renderUi };
