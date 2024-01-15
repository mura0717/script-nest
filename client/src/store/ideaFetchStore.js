import * as fetchStore from "./fetchStore";
import { handleError } from "../utils/ErrorHandling/GlobalErrorHandlerClient";
import { AppError } from "../utils/ErrorHandling/AppError.js";

export async function fetchIdea(ideaId) {
  try {
    const response = await fetchStore.getRequest(`/api/auth/ideas/${ideaId}`);
    console.log("fetchidea response:", response);
    console.log("fetchidea response id:", response.id);
    if (response && response.id) {
      return response;
    } else {
      throw new AppError("Error fetching idea", 400);
    }
  } catch (error) {
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
      statusCode: error.statusCode || 500,
    });
  }
}

export async function fetchAllIdeas() {
  try {
    const response = await fetchStore.getRequest("/api/auth/ideas");
    if (response) {
      return await response;
    } else {
      throw new AppError("Error fetching ideas", 400);
    }
  } catch (error) {
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
      statusCode: error.statusCode || 500,
    });
  }
}

export async function deleteIdea(ideaId) {
  try {
    const response = await fetchStore.deleteRequest(
      `/api/auth/ideas/${ideaId}`
    );
    if (response) {
      return await response;
    }
  } catch (error) {
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
      statusCode: error.statusCode || 500,
    });
  }
}

export async function editIdea(ideaId, updatedIdeaData) {
  try {
    const response = await fetchStore.patchRequest(
      `/api/auth/ideas/${ideaId}`,
      updatedIdeaData
    );
    if (response) {
      return await response;
    }
  } catch (error) {
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
      statusCode: error.statusCode || 500,
    });
  }
}
