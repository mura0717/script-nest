import { getRequest } from "../../store/fetchStore";
import { handleError } from "../ErrorHandling/GlobalErrorHandlerClient";

export async function fetchIdeaDetails(ideaId) {
  try {
    const response = await getRequest(`/àpi/auth/ideas/${ideadId}`);
    if (response && response.id) {
      return response.idea;
    } else {
      throw new AppError("Couldn't fetch idea", 400);
    }
  } catch (error) {
    handleError(error);
    throw new AppError(`An error occured: ${error.message}`, {
      initialError: error,
    });
  }
}
