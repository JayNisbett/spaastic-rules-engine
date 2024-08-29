import useAsync from "@src/utils/useAsync.js";

const DEFAULT_OPTIONS = {
	headers: {
		"Content-Type": "application/json",
	},
};
const Authorization =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzMzc5MTgzLCJleHAiOjE3MTM0NjU1ODN9.D7qqUA6Cy_SOPesHXlTZxgQyrhGHPKTgN2BPW-U_uKY";
export function useFetch(url, options = {}, dependencies = []) {
	return useAsync(() => {
		return fetch(url, { ...DEFAULT_OPTIONS, ...options }).then(res => {
			if (res.ok) return res.json();
			return res.json().then(json => Promise.reject(json));
		});
	}, dependencies);
}
/**
 * useSpaastic is a custom hook that fetches data from the spaastic API
 * @param {*} resource
 * @param {*} options
 * @param {*} dependencies
 * @returns {Object} { loading, error, value }
 */
export function useSpaastic(resource, options = {}, dependencies = []) {
	const url = `https://spaastic-server-73293c98e8f2.herokuapp.com/crud/${resource}`;
	const spaasticHeaders = { Authorization };
	return useAsync(() => {
		return fetch(url, { ...DEFAULT_OPTIONS, ...options, ...spaasticHeaders }).then(res => {
			if (res.ok) return res.json();
			return res.json().then(json => Promise.reject(json));
		});
	}, dependencies);
}
