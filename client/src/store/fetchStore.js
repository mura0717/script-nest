import { API_BASE_URL_JS } from "../store/global.js";

// Function to make a GET request
async function getRequest(endpoint) {
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
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

// Function to make a POST request
async function postRequest(endpoint, data) {
  console.log("url:", API_BASE_URL_JS + endpoint)
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || `Failed to post data. Status: ${response.status}`);
    }
    return responseData;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

export { postRequest, getRequest };


