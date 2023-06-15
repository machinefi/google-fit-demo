import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

export const getParsedJSONFile = (filePath: string): any => {
  const file = fs.readFileSync(path.resolve(rootDir, filePath));
  return JSON.parse(file.toString());
};

export const setJSONFile = (filePath: string, data: any): void => {
  fs.writeFileSync(
    path.resolve(rootDir, filePath),
    JSON.stringify(data, null, 2)
  );
};

export const getFileByPath = (filePath: string): Buffer => {
  return fs.readFileSync(path.resolve(rootDir, filePath));
};

export const getDirectorySize = (dirPath: string): number => {
  const arrayOfFiles = getDirByPath(dirPath);
  let totalSize = 0;

  arrayOfFiles.forEach((file) => {
    const absolutePath = path.join(path.resolve(rootDir, dirPath), file);
    const fileStats = fs.statSync(absolutePath);
    totalSize += fileStats.size;
  });

  return totalSize;
};

const getDirByPath = (dirPath: string): string[] => {
  return fs.readdirSync(path.resolve(rootDir, dirPath));
};
