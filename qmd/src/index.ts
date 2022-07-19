import fs from "fs";
import path from "path";
import process, { exit } from "process";

import {parse} from "./parse"
import {readdirRecursive} from "./readdirRecursive"

async function main():Promise<number> {
    const workPath = path.resolve(process.cwd(), "..", ".."); //todo : find a better way to find raiderdocs folder
    const qmds = await readdirRecursive(workPath, (directory:fs.Dirent) => directory.name.endsWith(".qmd"));
    const baseFolder = path.join(__dirname, "..", "..");
    if(!fs.existsSync(path.join(baseFolder, "dist"))) {
        fs.mkdirSync(path.join(baseFolder, "dist"));
    }
    for await(let qmd of qmds) {
        const base = path.basename(qmd)
        const content = fs.readFileSync(qmd);
        const newContent = await parse(content);
        if(base == "README.qmd") {
            fs.writeFileSync(path.join(__dirname, "..", "..", "README.md"), newContent);
        } else {
            fs.writeFileSync(path.join(__dirname, "..", "..", "dist", base.replace(".qmd", ".md")), newContent);
        }

    }

    return 0;
}

main().then((exitCode) => {
    console.log("Thanks for using my programs !");
    exit(exitCode);
});