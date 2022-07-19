import fs from "fs";
import path from "path";

export async function readdirRecursive(directoryPath:string, filter:(directory:fs.Dirent) => boolean):Promise<string[]> {
    const finalDirectories:string[] = [];
    
    let files:string[] = [];
    files = fs.readdirSync(directoryPath, {withFileTypes: true})
    .filter((dirent:fs.Dirent) => filter(dirent))
    .map((dirent:fs.Dirent) => path.join(directoryPath, dirent.name));
    
    let directories = fs.readdirSync(directoryPath, {withFileTypes: true})
    .filter((dirent:fs.Dirent) => dirent.isDirectory())
    .map((dirent:fs.Dirent) => dirent.name);


    for(let directory of directories) {
        const dPath = path.join(directoryPath, directory);
        if(!fs.existsSync(dPath)) continue;
        const maybeDirectories = fs.readdirSync(dPath, {withFileTypes: true})
        .filter((dirent:fs.Dirent) => dirent.isDirectory())
        .map((dirent:fs.Dirent) => dirent.name);

        for(let maybDirec of maybeDirectories) {
            const dPath2 = path.join(directoryPath, directory, maybDirec);
            finalDirectories.push(dPath2);
        }
        finalDirectories.push(dPath);
    }
    

    for(let directory of finalDirectories) {
        if(!fs.existsSync(directory)) continue;
        const results = fs.readdirSync(directory, {withFileTypes: true})
        .filter((dirent:fs.Dirent) => filter(dirent));

        for(let result of results) {
            files.push(path.join(directory,result.name));
        }
    }

    

    return files;
}