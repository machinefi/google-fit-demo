import { uploadFolder } from "./bundlr/upload-folder.js";
import {
  ARWEAVE_BASE_URL,
  PATH_TO_REWARDS_MANIFEST,
  PATH_TO_REWARDS_METADATA,
  PATH_TO_REWARD_TOKENS,
  REWARDS_METADATA,
} from "./config.js";
import { updateUploadsFile } from "./update-config.js";
import { getParsedJSONFile, setJSONFile } from "./utils/files.js";
import { getDirectorySize } from "./utils/files.js";

export const uploadRewards = async () => {
  const sleeprDirSize = getDirectorySize(PATH_TO_REWARD_TOKENS);
  await uploadFolder(PATH_TO_REWARD_TOKENS, sleeprDirSize);

  const sleeprManifest = getParsedJSONFile(PATH_TO_REWARDS_MANIFEST);
  processSleeprManifest(sleeprManifest);

  const metadataDirSize = getDirectorySize(PATH_TO_REWARDS_METADATA);
  const manifestId = await uploadFolder(
    PATH_TO_REWARDS_METADATA,
    metadataDirSize
  );

  updateUploadsFile("Rewards", ARWEAVE_BASE_URL + manifestId + "/{id}.json");
};

const processSleeprManifest = (sleeprManifest: any) => {
  const paths = sleeprManifest.paths as { [key: string]: { id: string } };
  const imgNames = Object.keys(paths).map((key) => key);
  imgNames.forEach((name) => {
    const path = paths[name];
    createTokenMetadata(name, path.id);
  });
};

const createTokenMetadata = (fileName: string, id: string) => {
  const { index, name, description } = REWARDS_METADATA[fileName];

  setJSONFile(PATH_TO_REWARDS_METADATA + "/" + index + ".json", {
    name,
    description,
    image: ARWEAVE_BASE_URL + id,
  });
};
