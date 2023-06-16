import { uploadImage } from "./bundlr/upload-img.js";
import { uploadMetadata } from "./bundlr/upload-meta.js";
import { SBT_FILE_TYPE, SBT_METADATA, SBT_PATH } from "./config.js";
import { updateUploadsFile } from "./update-config.js";
import { getFileByPath } from "./utils/files.js";

export const uploadSBT = async () => {
  const url = await uploadSBTImage();
  const metaUrl = await uploadMetadata({
    ...SBT_METADATA,
    image: url,
  });
  updateUploadsFile(SBT_METADATA.name, metaUrl);
};

const uploadSBTImage = async (): Promise<string | undefined> => {
  const file = getFileByPath(SBT_PATH);
  return uploadImage(file, SBT_FILE_TYPE);
};
