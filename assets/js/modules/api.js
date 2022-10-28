const getUsers = async () => {
	try {
		const response = await fetch("https://jsonplaceholder.typicode.com/users");
		if (response.status === 200) {
			const json = await response.json();

			return json;
		}

		throw new Error("Server error", response.status);
	} catch (error) {
		console.error("Ошибка в запросе", error);
	}
};

export { getUsers };
