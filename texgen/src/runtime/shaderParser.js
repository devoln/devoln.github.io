class ShaderFunction {
    constructor(desc) {
        /** @member {string} */
        this.Name = desc.Name;

        /** @member {Array<Object>} */
        this.Args = desc.Args;

        /** @member {string} */
        this.ReturnType = desc.ReturnType;

        /** @member {string} equals { ... code ...} or for constants = expr; */
        this.BodyCode = desc.BodyCode;

        this.Comment = desc.Comment;

        /** @member {Object} Any extra info to store in this object (e.g. dependencies) */
        this.Extra = {}


        //TODO: parse BodyCode to find references to previouslyDeclaredFunctions
    }
}

function* TokenizeGLSL(code) {
    let pos = 0;
    const codeLen = code.length;
    let tokStart = -1;
    let num = false;
    let numExp = 0;
    let numPoint = 0;

    function skipTo(str) {
        pos = code.indexOf(str, pos);
        if(pos === -1) pos = codeLen;
    }
    function* endToken() {
        if(tokStart === -1) return;
        yield {pos: tokStart, str: code.substring(tokStart, pos)};
        tokStart = -1;
    }

    for(; pos < codeLen; pos++) {
        const ch = code.charAt(pos);

        // Ignore spaces
        if(ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            yield* endToken();
            continue;
        }

        // Ignore all comments
        if(ch === '/') {
            yield* endToken();
            const chNext = code.charAt(pos + 1);
            if(chNext === '/') {
                const commentStartPos = pos;
                pos += 2;
                skipTo('\n');
                yield {pos: commentStartPos, str: code.substring(commentStartPos, pos + 1)};
            } else if(chNext === '*') {
                const commentStartPos = pos;
                pos += 2;
                skipTo('*/');
                yield {pos: commentStartPos, str: code.substring(commentStartPos, pos + 2)};
                pos++;
            } else yield {pos: pos, str: '/'};
            continue;
        }

        const isAlpha = 'A' <= ch && ch <= 'Z' ||
            'a' <= ch && ch <= 'z';
        const isNumeric = '0' <= ch && ch <= '9';

        if(isAlpha || isNumeric || ch === '_' || ch === '.' && num && !numPoint) {
            if(tokStart === -1) {
                tokStart = pos;
                num = isNumeric;
                numExp = 0;
                numPoint = 0;
            }
            if(num) {
                numExp += ch === 'e';
                numPoint += ch === '.';
                num = isNumeric && numExp <= 1 && numPoint <= 1;
            }
            continue;
        }

        yield* endToken();
        yield {pos: pos, str: ch};
    }
}

//This parser is not strict and expects valid input
function ParseGLSLFunctions(code) {
    function parseFunctionArguments(tokens) {
        let args = [];
        for(let tokenIt = tokens.next(), token = tokenIt.value; !tokenIt.done; tokenIt = tokens.next(), token = tokenIt.value) {
            if(token.str.startsWith("/")) continue;
            if(token.str === ')') return args;
            if(token.str === ',') continue;
            const next = tokens.next();
            if(next.done) return {error: "eof"};
            args.push({Type: token.str, Name: next.value.str});
        }
        return {error: "eof"};
    }

    function parseFunctionBody(tokens) {
        let braceNesting = 1;
        let bodyStartPos = null;
        for(let tokenIt = tokens.next(), token = tokenIt.value; !tokenIt.done; tokenIt = tokens.next(), token = tokenIt.value) {
            if(bodyStartPos == null) bodyStartPos = token.pos;
            if(token.str === '{') {
                braceNesting++;
                continue;
            }
            if(token.str === '}') {
                braceNesting--;
                if(braceNesting === 0) {
                    return code.substring(bodyStartPos, token.pos);
                }
            }
        }
        return {error: "eof"};
    }

    function parseInitExpression(tokens) {
        let bodyStartPos = null;
        for(let tokenIt = tokens.next(), token = tokenIt.value; !tokenIt.done; tokenIt = tokens.next(), token = tokenIt.value) {
            if(bodyStartPos == null) bodyStartPos = token.pos;
            if(token.str === ';') {
                return code.substring(bodyStartPos, token.pos);
            }
        }
    }

    function consume(tokens, expected) {
        const tok = tokens.next().value;
        if(tok.str !== expected)
            return tok.pos + ": Unexpected token " + tok.str + ", expected: " + expected;
    }

    function parseDeclaration(tokens) {
        let declDesc = {
            Name: null,
            Args: null,
            ReturnType: null,
            BodyCode: null,
            Comment: "",
        };
        let tokenIt = tokens.next(), token = tokenIt.value;
        if(tokenIt.done) return null;
        for(; !tokenIt.done; tokenIt = tokens.next(), token = tokenIt.value) {
            if(token.str.startsWith("//") || token.str.startsWith("/*")) {
                if(!token.str.startsWith('///') || token.str.startsWith('////')) continue;
                if(declDesc.Comment !== "") declDesc.Comment += '\n';
                declDesc.Comment += token.str.substring(3, token.str.length - 1);
                continue;
            }
            if(token.str === "const" || token.str === "in" ||
                token.str === "highp" || token.str === "lowp" || token.str === "mediump") continue;
            declDesc.ReturnType = token.str;
            if(declDesc.ReturnType == null) return {error: "eof"};
            declDesc.Name = tokens.next().value.str;
            const nextTok = tokens.next().value.str;
            if(nextTok === '(') {
                declDesc.Args = parseFunctionArguments(tokens);
                if(declDesc.Args.error) return {error: declDesc.Args.error};
                const err = consume(tokens, '{');
                if(err) return {error: err};
                declDesc.BodyCode = parseFunctionBody(tokens);
                if(declDesc.BodyCode.error) return {error: declDesc.BodyCode.error};
            }
            else if(nextTok === '=') {
                declDesc.BodyCode = parseInitExpression(tokens);
                if(declDesc.BodyCode.error) return {error: declDesc.BodyCode.error};
            }
            else return {error: "Unexpected token " + nextTok};
            break;
        }
        return new ShaderFunction(declDesc);
    }

    const tokens = TokenizeGLSL(code);
    let functions = [];
    for(;;) {
        let f = parseDeclaration(tokens);
        if(f == null) break;
        if(f.error) {
            console.error(f.error);
            break;
        }
        functions.push(f);
    }
    return functions;
}
