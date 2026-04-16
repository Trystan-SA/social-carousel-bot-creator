import { renderPost } from "../render.js";

export async function render(postDir, { format } = {}) {
  if (!postDir) throw new Error("Usage: postkit render <post-folder>");
  await renderPost(postDir, { formatOverride: format });
}