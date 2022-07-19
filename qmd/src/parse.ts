import { base } from "./functions/base";
import { contributors } from "./functions/contributors";

export async function parse(file:Buffer):Promise<Buffer> {
    const content = file.toString("utf8");
    const lines = content.split("\n");

    if(content.indexOf("{") == -1) {
        return file;
    }

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if(!(line.indexOf("{") != -1 && line.indexOf("}") != -1)) continue;
        const expressionStart = line.indexOf("{");
        const expressionEnd = line.indexOf("}");
        const expression = line.substring(expressionStart+1, expressionEnd);
        if(!(expression.includes("(") && expression.includes(")"))) continue;
        const fct = expression.substring(0, expression.indexOf("("));
        const rawArgs = expression.substring(expression.indexOf("(")+1, expression.indexOf(")"));
        
        const args = rawArgs.split(",");
        let result:string|null;
        switch(fct) {
            case "contributors":
                if(args.length < 1 || args[0] == '') throw "Missing args";
                result = await contributors(args[0]);
                if(!result) continue;
                lines[i] = result;
                break;
            case "base":
                if(args.length < 1 || args[0] == '') throw "Missing args";
                result = await base(args[0]);
                if(!result) continue;
                lines[i] = result;
                break;
        }
    }

    return Buffer.from(lines.join("\n"));
}