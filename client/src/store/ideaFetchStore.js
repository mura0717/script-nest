import * as fetchStore from "./fetchStore";
import { AppError } from "../utils/ErrorHandling/AppError.js";

export async function fetchIdea(ideaId) {
  try {
    const ideaResponse = await fetchStore.getRequest(
      `/api/auth/ideas/${ideaId}`
    );
    if (!ideaResponse.ok) {
      new Error(`HTTP error! status: ${ideaResponse.status}`);
    }
      console.log("fetchidea response:", ideaResponse);
      const idea = await ideaResponse;
      console.log("idea:", idea);
      const collaborators = await fetchCollaborators(ideaId);
      console.log("collaborators:", collaborators);
    if (idea && collaborators) {
      return { ...idea, collaborators };
    } else {
      throw new AppError("Error fetching idea & collaborators", 400);
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

export async function fetchCollaborators(ideaId) {
  try {
    const collaboratorResponse = await fetch(
      `/api/auth/ideas/${ideaId}/collaborators`
    );
    if (collaboratorResponse) {
      const collaborators = await collaboratorResponse.json();
      return collaborators;
    } else {
      throw new AppError("Error fetching collaborators", 400);
    }
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    throw new AppError(
      `An error occurred fetching collaborators: ${error.message}`,
      {
        initialError: error,
        statusCode: error.statusCode || 500,
      }
    );
  }
}
