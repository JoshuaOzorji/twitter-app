export const formatPostDate = (createdAt: string | number | Date) => {
	const currentDate = new Date();
	const createdAtDate = new Date(createdAt);

	const timeDifferenceInSeconds = Math.floor(
		(currentDate.getTime() - createdAtDate.getTime()) / 1000,
	);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);

	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);

	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	} else if (timeDifferenceInDays === 1) {
		return "1d";
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`;
	} else {
		return "Just now";
	}
};

// export const formatMemberSinceDate = (createdAt: string) => {

// 	const date = new Date(createdAt);
// 	const months = [
// 		"January",
// 		"February",
// 		"March",
// 		"April",
// 		"May",
// 		"June",
// 		"July",
// 		"August",
// 		"September",
// 		"October",
// 		"November",
// 		"December",
// 	];
// 	const month = months[date.getMonth()];
// 	const year = date.getFullYear();
// 	return `Joined ${month} ${year}`;
// };
export const formatMemberSinceDate = (objectId: string) => {
	if (typeof objectId === "string" && /^[a-f\d]{24}$/i.test(objectId)) {
		// Extract the timestamp from the ObjectId and convert it to a date
		const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
		const date = new Date(timestamp);

		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const month = months[date.getMonth()];
		const year = date.getFullYear();

		return `Joined ${month} ${year}`;
	} else {
		// If objectId is not a valid ObjectId, return "Invalid Date"
		return "Invalid Date";
	}
};
