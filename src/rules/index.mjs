/* eslint-disable no-console */
import chalk from "chalk";
import defaultRules from "./defaultRules.json";

const defaultUser = {
	name: "Jay",
	email: "jay.v.nisbett@gmail.com",
	password: "123456",
};

class UserSettings {
	constructor(userData = {}) {
		this.userData = userData || defaultUser;
		this.access_token = null;
		this.refresh_token = null;
		this.lastRequest = null;
	}

	async fetchWithoutAuthorization(url, options) {
		this.lastRequest = {
			url: url,
			method: options.method || "GET",
			parameters: options.body || {},
		};

		try {
			const response = await fetch(url, options);
			if (response.access_token) {
				this.access_token = response.access_token;
			}
			if (response.refresh_token) {
				this.refresh_token = response.refresh;
			}

			return await this.handleResponse(response);
		} catch (error) {
			console.error(chalk.red(("Error during fetch without authorization", error)));
			throw error;
		}
	}

	async fetchWithAuthorization(url, options) {
		this.lastRequest = {
			url: url,
			method: options.method || "GET",
			parameters: options.body || {},
		};

		if (!this.access_token) {
			if (!this.refresh_token) {
				await this.login(this.userData.email, this.userData.password);
			} else {
				await this.authenticateDefaultUser();
			}
		}

		const fullOptions = {
			...options,
			headers: {
				...options.headers,
				"Content-Type": "application/json",
				Authorization: `${this.access_token}`,
			},
		};

		try {
			const response = await fetch(url, fullOptions);
			return await this.handleResponse(response);
		} catch (error) {
			console.error(chalk.red(("Error during fetch with authorization", error)));
			throw error;
		}
	}

	async handleResponse(response) {
		try {
			const data = await response.json();

			// Handle the response based on the HTTP status code
			if (response.ok) {
				console.log(
					chalk.green({
						request: this.lastRequest,
						response: response,
					})
				);
				// The 'ok' property checks for status in the range 200-299
				// If the response contains token information, update tokens
				if (data.access_token || data.refresh_token) {
					this.updateTokens(data);
				}
				// Assume updateUserData is only necessary if data contains specific user-related updates
				if (data.user) {
					await this.updateUserData(data.user);
				}
				return data;
			} else {
				// Handle non-200 responses
				if (data.message) {
					return await this.handleError(data.message); // Ensures error handling is centralized
				} else {
					// Log the entire data if no specific message is available
					console.log(chalk.green(("Response Data:", data)));
					throw new Error(`API responded with status: ${response.status}`); // Create a clearer error message
				}
			}
		} catch (error) {
			// Log the error context before throwing to ensure it's clear in logs
			console.error(chalk.red(("Error processing response from", this.lastRequest.url, error)));
			throw new Error("Error processing the response");
		}
	}

	async handleError(message) {
		console.error(chalk.red(("Request leading to error:", this.lastRequest)));
		console.error(chalk.red(`Error: ${message}`));
		switch (message) {
			case "Email already in use.":
				console.log(chalk.green(`${message}, trying to login...`));
				return await this.login(this.userData.email, this.userData.password);
			case "jwt malformed":
			case "jwt expired":
			case "invalid token":
				console.log(chalk.green("Token is malformed, trying to refresh token..."));
				if (!this.refresh_token) {
					console.log(chalk.green("No refresh token, attempting login..."));
					return await this.login(this.userData.email, this.userData.password);
				} else {
					return await this.refreshToken();
				}
			case "A token is required for authentication":
				console.log(chalk.green("Token is required, attempting to login..."));
				return await this.login(this.userData.email, this.userData.password);
			default:
				console.error(chalk.red(`Unhandled message: ${message}`));
		}
	}

	async updateTokens(data) {
		if (data.access_token) {
			this.access_token = data.access_token;
		}
		if (data.refresh_token) {
			this.refresh_token = data.refresh_token;
		}
	}

	async updateUserData(data) {
		if (data.user) {
			this.userData = {
				...this.userData,
				...data.user,
			};
		}
	}

	/* async handleError(message) {
		switch (message) {
			case "Email already in use.":
				console.log(chalk.green((`${message}, trying to login...`)));
				return await this.login(defaultUser.email, defaultUser.password);
			case "jwt malformed":
			case "jwt expired":
			case "invalid token":
				console.log(chalk.green(("Token is malformed, trying to refresh token...")));
				if (!this.refresh_token) {
					console.log(chalk.green(("No refresh token, attempting login...")));
					return await this.login(defaultUser.email, defaultUser.password);
				} else {
					return await this.refreshToken();
				}
			case "A token is required for authentication":
				console.log(chalk.green(("Token is required, attempting to login...")));
				return await this.login(defaultUser.email, defaultUser.password);
			default:
				console.error(chalk.red((`Unhandled message: ${message}`)));
				throw new Error(message);
		}
	} */

	async refreshToken() {
		console.log(chalk.green("Refreshing token"));
		if (!this.refresh_token) {
			await this.login(this.userData.email, this.userData.password);
		}
		try {
			const response = await this.fetchWithoutAuthorization(
				"https://spaastic-server-73293c98e8f2.herokuapp.com/auth/refresh-token/spaastic_users",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refresh_token: `${this.refresh_token}` }),
				}
			);
			return await this.handleResponse(response);
		} catch (error) {
			console.error(chalk.red(("Failed to refresh token", error)));
			throw error;
		}
	}

	async authenticateDefaultUser() {
		console.log(chalk.green("Checking default user authentication"));
		if (this.access_token) {
			return this.access_token;
		} else if (this.refresh_token) {
			return await this.refreshToken();
		} else if (this.userData.email && this.userData.password) {
			return await this.login(this.userData.email, this.userData.password);
		} else {
			return await this.createDefaultAccount();
		}
	}

	async getAccount(email, password) {
		console.log(chalk.green("Getting account"));
		try {
			const response = await this.fetchWithoutAuthorization("https://spaastic-server-73293c98e8f2.herokuapp.com/auth/spaastic_users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			if (response.access_token) {
				this.access_token = response.access_token;
			}
			if (response.refresh_token) {
				this.refresh_token = response.refresh;
			}

			return await this.handleResponse(response);
		} catch (error) {
			console.error(chalk.red(("Failed to get account", error)));
			throw error;
		}
	}

	async createDefaultAccount() {
		console.log(chalk.green("Creating default account"));
		try {
			const response = await this.fetchWithoutAuthorization("https://spaastic-server-73293c98e8f2.herokuapp.com/auth/register/spaastic_users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(defaultUser),
			});
			if (response.access_token) {
				this.access_token = response.access_token;
			}
			if (response.refresh_token) {
				this.refresh_token = response.refresh;
			}
			return await this.handleResponse(response);
		} catch (error) {
			console.error(chalk.red(("Failed to create default account", error)));
			throw error;
		}
	}

	async login(email, password) {
		console.log(chalk.green("Logging in"));
		try {
			return await this.fetchWithoutAuthorization("https://spaastic-server-73293c98e8f2.herokuapp.com/auth/spaastic_users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
		} catch (error) {
			console.error(chalk.red(("Login error", error)));
			throw error;
		}
	}

	async fetchRule(id) {
		if (!this.access_token) {
			if (!this.refresh_token) {
				await this.login(this.userData.email, this.userData.password);
			} else {
				await this.refreshToken();
			}
			await this.login(this.userData.email, this.userData.password);
		}

		try {
			return await this.fetchWithAuthorization(`https://spaastic-server-73293c98e8f2.herokuapp.com/crud/rules/${id}`, {
				method: "GET",
			});
		} catch (error) {
			return error;
		}
	}

	async saveRule(data) {
		const rule = data?.rule || { data };
		if (Object.keys(rule).length === 0) {
			return "No rule to save";
		}

		const id = data?.id || null;
		const method = id ? "PUT" : "POST";
		const endpoint = id
			? `https://spaastic-server-73293c98e8f2.herokuapp.com/crud/rules/${id}`
			: "https://spaastic-server-73293c98e8f2.herokuapp.com/crud/rules";

		try {
			return await this.fetchWithAuthorization(endpoint, {
				method: method,
				body: JSON.stringify({ rule }),
			});
		} catch (error) {
			return error;
		}
	}

	async createDefaultRules() {
		try {
			const rulePromises = defaultRules.map(entry =>
				this.fetchWithAuthorization("https://spaastic-server-73293c98e8f2.herokuapp.com/crud/rules", {
					method: "POST",
					body: JSON.stringify(entry),
				})
			);

			return await Promise.all(rulePromises);
		} catch (error) {
			return error;
		}
	}
}

/* // Example of usage
(async () => {
	const user = new UserSettings(defaultUser);
	try {
		await user.authenticateDefaultUser();
		console.log(chalk.green("User authenticated successfully."));
		await user.createDefaultRules();
		const ruleData = await user.fetchRule("19cf5d07-2391-4410-b262-d0625dcaba54");
		console.log(chalk.green(ruleData));
	} catch (error) {
		console.error(chalk.red(("Error in user authentication process", error)));
	}
})();
 */
// Export the UserSettings class
export default UserSettings;
