import * as fetchStore from "./fetchStore.js";
import * as collaboratorStore from "./collaboratorStore.js";
import { AppError } from "../utils/ErrorHandling/AppError.js";

export async function fetchIdea(ideaId) {
  try {
    const ideaResponse = await fetchStore.getRequest(
      `/api/auth/ideas/${ideaId}`
    );
    console.log("fetchIdea ideaResponse:", ideaResponse);
    if (!ideaResponse) {
      throw new AppError(`Failed to fetch idea with ID: ${ideaId}`);
    }
    const collaborators = await collaboratorStore.fetchCollaborators(ideaId) || [];
    console.log("ideaFetchStore/collaboratorsResponse:", collaborators);
    return { ...ideaResponse};
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

export async function fetchdAllSharedIdeas() {
  try {
    const response = await fetchStore.getRequest("/api/auth/shared-ideas");
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

export async function fetchAllCollaboratorIdeas() {
  try {
    const response = await fetchStore.getRequest(
      "/api/auth/collaborator-ideas"
    );
    if (response) {
      return await response;
    } else {
      throw new AppError("Error fetching collaborator ideas", 400);
    }
  } catch (error) {
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
      statusCode: error.statusCode || 500,
    });
  }
}

export async function fetchUpdate(ideaId, updatedIdeaData) {
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