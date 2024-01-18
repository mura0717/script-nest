import { writable } from "svelte/store";
import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../store/fetchStore.js";
import { AppError } from "../utils/ErrorHandling/AppError.js";

export const collaboratorStore = writable([]);

export async function addUserAsCollaborator(collabResponseData) {
  try {
    if (collabResponseData !== null) {
      const collabData = {
        displayName: collabResponseData.respondingUserName,
        photoURL: collabResponseData.respondingUserPhotoUrl,
        uid: collabResponseData.respondingUserId,
        ideaTitle: collabResponseData.ideaTitle,
        ideaId: collabResponseData.ideaId,
        inviterId: collabResponseData.inviterId,
      };
      const response = await postRequest(
        `/api/auth/ideas/${collabData.ideaId}/add-collaborator`,
        collabData
      );
      if (response) {
        console.log("addUserResponse:", response);
        if (response) {
          collaboratorStore.update((currentCollaborators) => {
            return [...currentCollaborators, collabData];
          });
        } else {
          throw new AppError(`An error occured: ${error.message}`, {
            initialError: error,
          });
        }
      }
    }
  } catch (error) {
    console.log(
      `Failed to add "${collabResponseData.respondingUserName}" as collaborator to "${collabResponseData.ideaTitle}".`
    );
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
    });
  }
}

export const removeCollaborator = async (ideaId, collaboratorId) => {
  try {
    if (ideaId && collaboratorId) {
      const response = await deleteRequest(
        `/api/auth/ideas/${ideaId}/remove-collaborator`,
        collaboratorId
      );
      if (response) {
        collaboratorStore.update((collaborators) => {
          return collaborators.filter((collab) => collab.id !== collaboratorId);
        });
      } else {
        throw new AppError(`An error occured: ${error.message}`, {
          initialError: error,
        });
      }
    }
  } catch (error) {
    console.log(
      `Failed to remove "${collabResponseData.respondingUserName}" as collaborator from "${collabResponseData.ideaTitle}".`
    );
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
    });
  }
};
