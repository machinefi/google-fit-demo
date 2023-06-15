import { getParsedJSONFile, setJSONFile } from "./utils/files.js";

const PATH_TO_UPLOADS_FILE = "./uploads.json";

export const updateUploadsFile = (field: string, url: string) => {
  const uploads = getParsedJSONFile(PATH_TO_UPLOADS_FILE);
  uploads[field] = url;
  setJSONFile(PATH_TO_UPLOADS_FILE, uploads);
};
