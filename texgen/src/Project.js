class ProjectContentVersion {
    constructor(desc) {
        this.Date = desc.Date? new Date(desc.Date): new Date();
        /** @member {String} */
        this.ChangesDesc = desc.ChangesDesc;
        this.Files = {...desc.Files};
    }

    get Markdown() {
        return [
            "## Declarations\n```javascript\n", this.Files["main.js"], "\n```\n\n",
            "## Shaders\n```glsl\n", this.Files["main.glsl"].replace(/\n```\n/g, "\n'''\n"), "\n``\x60\n\n"
        ].join("");
    }

    static FromMarkdown(str, date) {
        let result = {Date: date, Files: {}};

        const jsStartMarker = "```javascript\n";
        let jsOffset = str.indexOf(jsStartMarker);
        if(jsOffset !== -1) {
            jsOffset += jsStartMarker.length;
            const jsEndOffset = str.indexOf("\n```\n\n", jsOffset);
            result.Files["main.js"] = str.substring(jsOffset, jsEndOffset);
        }

        const glslStartMarker = "```glsl\n";
        let glslOffset = str.indexOf(glslStartMarker);
        if(glslOffset !== -1) {
            glslOffset += glslStartMarker;
            const glslEndOffset = str.indexOf("\n```\n\n", glslOffset);
            result.Files["main.glsl"] = str.substring(glslOffset, glslEndOffset);
        }
        return new ProjectContentVersion(result);
    }
}

class Project {
    constructor(desc) {
        // All the fields in this group are passed in Project-Meta HTTP header encoded as a JSON object.
        /** @member {String} */
        this.AuthorLogin = desc.AuthorLogin;
        /** @member {String} */
        this.Name = desc.Name;
        /** @member {String} Pattern `${origin.AuthorLogin}/${origin.Name}/${origin.Version}` or empty if original */
        this.ForkedFrom = desc.ForkedFrom || "";
        /** @member {String} */
        this.Desc = desc.Desc || "";
        /** @member {Set<String>} */
        this.Tags = new Set(Array.isArray(desc.Tags)? desc.Tags: desc.Tags.split(","));
        /** @member {Number} */
        this.LastVersionIndex = desc.LastVersionIndex != null? desc.LastVersionIndex: desc.Versions.length;
        /** @member {String} */
        this.GistID = desc.GistID || "";

        // Passed in Last-Modified HTTP header
        this.LastModified = new Date(desc.LastModified);

        // Passed as body
        /** @member {Array<ProjectContentVersion>} in chronological order */
        this.Versions = Array.isArray(desc.Versions)? desc.Versions.map(v => new ProjectContentVersion(v)):
            CreateEmptyObjectArray(this.LastVersionIndex);
    }

    get FullName() {
        return `${this.AuthorLogin}/${this.Name}`;
    }
    get CurrentVersionFullName() {
        return `${this.FullName}/${this.LastVersionIndex}`;
    }
    get Url() {
        return `${Config.ServerUrl}/${this.FullName}`;
    }
    get CurrentVersionUrl() {
        return `${this.Url}/${this.LastVersionIndex}`;
    }

    static async Load(authorLogin, name, loadContent) {
        const xhr = await Http({
            method: loadContent? "GET": "HEAD",
            path: `${Config.ServerUrl}/synthgen`,
            query: {
                author_login: authorLogin,
                name: name,
            },
        });
        return new Project({
            ...JSON.parse(xhr.getResponseHeader("Project-Meta")),
            LastModified: xhr.getResponseHeader("Last-Modified"),
            Versions: xhr.response? xhr.response.split("\n").map(x => JSON.parse(`{${x}}`)): null
        });
    }

    CommitMarkdown(index) {
        console.assert(this.Versions[index].Files != null);
        const ver = this.Versions[index];
        return [
            "---\n",
            "ChangesDesc: ", JSON.stringify(ver.CommitMessage), "\n",
            "Tags: ", this.Tags.join(", "), "\n",
            this.ForkedFrom? "ForkedFrom: " + this.ForkedFrom + "\n": "",
            "---\n\n",
            "## Description\n", this.Desc, "\n\n",
            ver.Markdown,
        ].join("");
    }
    get LastVersion() {
        return this.Versions[this.LastVersionIndex];
    }
}
