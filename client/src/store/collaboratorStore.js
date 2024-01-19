import { writable } from "svelte/store";
import { getRequest, postRequest, deleteRequest } from "../store/fetchStore.js";
import { AppError } from "../utils/ErrorHandling/AppError.js";

export const collaboratorStore = writable([]);

export async function fetchCollaborators(ideaId) {
  try {
    const collaboratorResponse = await getRequest(
      `/api/auth/ideas/${ideaId}/collaborators`
    );
    if (collaboratorResponse) {
      const collaborators = collaboratorResponse;
      collaboratorStore.set(collaborators || []);
    } else {
      const errorMessage = `Failed to fetch collaborators . Server responded with status: ${response.status}`;
      throw new AppError(errorMessage, {
        statusCode: response.status,
      });
    }
  } catch (error) {
    throw new AppError(
      `An error occurred fetching collaborators: ${error.message}`,
      {
        initialError: error,
        statusCode: error.statusCode || 500,
      }
    );
  }
}

export async function addUserAsCollaborator(collabResponseData) {
  console.log(
    "collaboratorStore/collabResponseData in addUserAsCollaborator:",
    collabResponseData
  );
  try {
    if (collabResponseData !== null) { 
      const collabData = {
        notificationId: collabResponseData.notificationId,
        displayName: collabResponseData.respondingUserName || "",
        uid: collabResponseData.respondingUserId || "",
        ideaTitle: collabResponseData.ideaTitle || "",
        ideaId: collabResponseData.ideaId || "",
        targetUserId: collabResponseData.targetUserId,
        targetUserName: collabResponseData.targetUserName,
      };
      const response = await postRequest(
        `/api/auth/ideas/${collabData.ideaId}/add-collaborator`,
        collabData
      );
      if (response) {
        if (response) {
          collaboratorStore.update((currentCollaborators) => {
            return [...currentCollaborators, collabData];
          });
        } else {
          const errorMessage = `Failed to add collaborator. Server responded with status: ${response.status}`;
          throw new AppError(errorMessage, {
            statusCode: response.status,
          });
        }
      }
    }
  } catch (error) {
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
    });
  }
}

export const removeCollaborator = async (ideaId, collaboratorId) => {
  try {
    if (ideaId && collaboratorId) {
      const response = await deleteRequest(
        `/api/auth/ideas/${ideaId}/remove-collaborator/${collaboratorId}`
      );
      if (response.success) {
        collaboratorStore.update((collaborators) => {
          return collaborators.filter(
            (collaborator) => collaborator.id !== collaboratorId
          );
        });
      } else {
        const errorMessage = `Failed to remove collaborator. Server responded with status: ${response.status}`;
        throw new AppError(errorMessage, {
          statusCode: response.status,
        });
      }
    }
  } catch (error) {
    throw new AppError(`An error occurred: ${error.message}`, {
      initialError: error,
    });
  }
};
