export const registerUser = async (userData) => {
	try {
		const response = await fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify(userData),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		
		// If the response is OK, return the data
		if (response.ok) {
			const data = await response.json();
			return {data, error: null}; // Return data with no error
		}
		
		// If response is not OK, extract the error message
		const errorData = await response.json();
		return {data: null, error: errorData.error || 'Registration failed'}; // Return error message with no data
		
	} catch (error) {
		console.error('Error during registration:', error.message);
		// Handle network errors or unexpected issues
		return {data: null, error: 'Something went wrong. Please try again later.'};
	}
};
