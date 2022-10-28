
import { getUsers } from "./modules/api.js";
import { createRadioButtons, createButton, renderUi } from "./modules/renderUi.js";
const buttonsParent = document.querySelector(".buttons-container");
const form = document.querySelector("#form");
import EventHub from "./modules/eventHub.js";
let users = [];
let filteredUsers = [];

document.querySelector(".container").addEventListener("click", ({ target }) => {
	const action = target?.dataset?.jsAction;
	if(action) {
		EventHub.dispatch(action, { value: target?.value, target });
	}
});

const changeAction = (selector, text, action) => {
	const btn = document.querySelector(selector);
	btn.textContent = text;
	btn.dataset.jsAction = action;
};

const filterUsers = users => users.map(({id, name, email, phone}) => ({id, name, email, phone}));

const onFormSubmit = form => {
	const user = {};
	const elements = form.elements;
	const ids = filteredUsers.map(user => user.id);
	user.id = ids.length ? Math.max(...ids) + 1 : 1;
	for (const element of elements) {
		if (element.value) {
			user[element.id] = element.value;
		}
	}
	
	if (Object.keys(user).length === 4) {
		filteredUsers.push(user);
		form.reset();
	}
};

const getCheckedValue = selector => {
	let value = null;
	document.querySelectorAll(selector).forEach(input => {
		if (input.checked) {
			value = input.value;
		}
	});

	return value;
};

const deleteUser = id => {
	filteredUsers = filteredUsers.filter(user => user.id !== +id);
};

EventHub.on(
	"click:get-users",
	async () => {
		users = await getUsers();
		console.log(users);
		changeAction("#step-1", "Get Filtered Users", "click:get-filtered-users");
	},
	{ once: true }
);

EventHub.on(
	"click:get-filtered-users",
	() => {
		filteredUsers = filterUsers(users);
		console.log(filteredUsers);
		const button = createButton("#render-table", "btn btn-secondary", "click:render-table", "Render Table");
		buttonsParent.insertAdjacentHTML("beforeend", button);
	},
	{ once: true }
);

EventHub.on("click:render-table", () => {
		const radioButtons = createRadioButtons();
		buttonsParent.insertAdjacentHTML("beforeend", radioButtons);
		EventHub.dispatch("render-ui");
		form.classList.remove("d-none");
	},
	{ once: true }
);

EventHub.on("click:add-new-user", () => {
	onFormSubmit(form);
	EventHub.dispatch("render-ui");
});

EventHub.on("click:delete", e => {
	deleteUser(e.target.id);
	EventHub.dispatch("render-ui");
});

EventHub.on("render-ui", () => {
	const container = document.querySelector(".table-container");
	const value = getCheckedValue(".js-radio-input");
	renderUi(container, value, filteredUsers);
});

