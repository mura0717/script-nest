import { API_BASE_URL_JS } from "./globalStore.js";
import { AppError } from "../utils/ErrorHandling/AppError.js";
import { handleError } from "../utils/ErrorHandling/GlobalErrorHandlerClient.js";

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
      const error = new AppError(`Failed to get data. Status: ${response.status}`, { status: response.status });
      handleError(error);
      throw error;
    } else {
      return await response.json();
    }
  } catch (error) {
    handleError(error);
    throw new AppError(`An error occurred: ${error.message}`, { initialError: error });
  
  }
}

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
      const error = new AppError(`Failed to post data. Status: ${response.status}`, { status: responseData.status });
      handleError(error);
      throw error;

    }
    return responseData;
  } catch (error) {
    handleError(error);
    throw new AppError(`An error occurred: ${error.message}`, { initialError: error});
  }
}

async function patchRequest(endpoint, data) {
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
    handleError(error);
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
}

async function deleteRequest(endpoint) {
  try {
    const response = await fetch(API_BASE_URL_JS + endpoint, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
    handleError(error);
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
}

export { postRequest, getRequest, patchRequest, deleteRequest };


