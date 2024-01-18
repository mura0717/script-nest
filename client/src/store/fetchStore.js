import { API_BASE_URL_JS } from "./globalStore.js";
import { AppError } from "../utils/ErrorHandling/AppError.js";
import { handleError } from "../utils/ErrorHandling/GlobalErrorHandlerClient.js";

async function getRequest(endpoint) {
  const firebaseToken = localStorage.getItem("firebaseAuthToken");
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
    });
    if (!response.ok) {
      throw new AppError(`Failed to get data. Status: ${response.status}`, {
        status: response.status,
      });
    } else {
      return await response.json();
    }
  } catch (error) {
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
}

async function postRequest(endpoint, data) {
  const firebaseToken = localStorage.getItem("firebaseAuthToken");
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new AppError(
        `Failed to post data. Status: ${response.status}`,
        { status: responseData.status }
      );
      handleError(error);
      throw error;
    }
    console.log("new idea response:", response)
    return responseData;
  } catch (error) {
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
}

async function patchRequest(endpoint, data) {
  const firebaseToken = localStorage.getItem("firebaseAuthToken");
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new AppError(
        `Failed to patch data. Status: ${response.status}`,
        { status: responseData.status }
      );
      handleError(error);
      throw error;
    }
    return responseData;
  } catch (error) {
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
}

async function deleteRequest(endpoint) {
  const firebaseToken = localStorage.getItem("firebaseAuthToken");
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
    });
    if (!response.ok) {
      const error = new AppError(
        `Failed to delete data. Status: ${response.status}`,
        { status: response.status }
      );
      handleError(error);
      throw error;
    } else {
      return await response.json();
    }
  } catch (error) {
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
}

export { postRequest, getRequest, patchRequest, deleteRequest };
