import { useParams } from "svelte-navigator";

export function getPageId() {
  const params = useParams();
  return params.ideaId;
}
