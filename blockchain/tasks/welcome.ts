import { task } from "hardhat/config";

task("hello-world", "Prints hello world").setAction(async (taskArgs, hre) => {
  console.log("Hello World!");
});
