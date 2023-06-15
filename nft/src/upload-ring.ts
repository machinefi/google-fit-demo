import { uploadImage } from "./bundlr/upload-img.js";
import { uploadMetadata } from "./bundlr/upload-meta.js";
import { updateUploadsFile } from "./update-config.js";
import { getFileByPath } from "./utils/files.js";

const PATH_TO_RING = "./assets/ring/ring.png";

const metadata = {
  name: "Oura Ring",
  description: "A digital twin of your Oura Ring",
};

export const uploadRingNFT = async () => {
  const url = await uploadRingImage();
  const metaUrl = await uploadMetadata({
    ...metadata,
    image: url,
  });
  updateUploadsFile("ring", metaUrl);
};

const uploadRingImage = async (): Promise<string | undefined> => {
  const file = getFileByPath(PATH_TO_RING);
  return uploadImage(file, "image/png");
};
