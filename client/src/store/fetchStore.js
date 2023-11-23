import { BASE_URL_JS } from "../store/global.js";

// Function to make a POST request
async function postRequest(endpoint, data) {
  try {
    const response = await fetch(BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to post data. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// Function to make a GET request
async function getRequest(endpoint) {
  try {
    const response = await fetch(BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to get data. Status: ${response.status}`);
    } else {
      return await response.json();
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

export { postRequest, getRequest };


