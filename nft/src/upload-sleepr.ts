import { uploadFolder } from "./bundlr/upload-folder.js";
import { updateUploadsFile } from "./update-config.js";
import { getParsedJSONFile, setJSONFile } from "./utils/files.js";
import { getDirectorySize } from "./utils/files.js";

const PATH_TO_SLEEPR = "./assets/sleepr";
const PATH_TO_MANIFEST = "./assets/sleepr-manifest.json";
const PATH_TO_METADATA = "./assets/sleepr_metadata";

interface Metadata {
  index: string;
  name: string;
  description: string;
}

// Make sure img names match the names of the files in the /assets/sleepr folder
const metadata: {
  [key: string]: Metadata;
} = {
  "silver.png": {
    index: "0000000000000000000000000000000000000000000000000000000000000001",
    name: "Silver Sleepr",
    description: "Tier 1 of Sleepr NFTs",
  },
  "gold.png": {
    index: "0000000000000000000000000000000000000000000000000000000000000002",
    name: "Golden Sleepr",
    description: "Tier 2 of Sleepr NFTs",
  },
  "platinum.png": {
    index: "0000000000000000000000000000000000000000000000000000000000000003",
    name: "Platinum Sleepr",
    description: "Tier 3 of Sleepr NFTs",
  },
};

export const uploadSleepr = async () => {
  const sleeprDirSize = getDirectorySize(PATH_TO_SLEEPR);
  await uploadFolder(PATH_TO_SLEEPR, sleeprDirSize);

  const sleeprManifest = getParsedJSONFile(PATH_TO_MANIFEST);
  processSleeprManifest(sleeprManifest);

  const metadataDirSize = getDirectorySize(PATH_TO_METADATA);
  const manifestId = await uploadFolder(PATH_TO_METADATA, metadataDirSize);

  updateUploadsFile(
    "sleepr",
    "https://arweave.net/" + manifestId + "/{id}.json"
  );
};

const processSleeprManifest = (sleeprManifest: any) => {
  const paths = sleeprManifest.paths as { [key: string]: { id: string } };
  const imgNames = Object.keys(paths).map((key) => key);
  imgNames.forEach((name) => {
    const path = paths[name];
    createTokenMetadata(name, path.id);
  });
};

const createTokenMetadata = (name: string, id: string) => {
  setJSONFile(PATH_TO_METADATA + "/" + metadata[name].index + ".json", {
    name: metadata[name].name,
    description: metadata[name].description,
    image: "https://arweave.net/" + id,
  });
};
