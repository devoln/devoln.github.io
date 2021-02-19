
class AppState {
    constructor(desc) {
        this.UserLogin = GetCookie("userLogin") || null;
        this.UserSessionToken = GetCookie("userToken") || null;

        /** @member {Project} Currently edited project */
        this.SourceProject = null;

        this.SourceProjectVersionIndex = 0;

        this.EditorData = {
            ...Config.NewProjectTemplate,
            Name: "",
            Desc: "",
            CommitMessage: "",
        };

        this.Strings = navigator.language.startsWith("ru")? gStrings.ru: gStrings.en;
        this.Ui = {
            ActiveTabIndex: 0, //js, glsl, publish, history and forks, results
            ShowResults: true,
        };

        this.RendererWindow = desc.RendererWindow? desc.RendererWindow.contentWindow || desc.RendererWindow: null;
    }

    get SourceContent() {
        return this.SourceProject.Versions[this.SourceProjectVersionIndex];
    }

    EditProject(project, version = null) {
        this.SourceProject = project;
        if(version == null) version = project.LastVersionIndex;
        this.SourceProjectVersionIndex = version;
        const versionToEdit = this.SourceProject.Versions[version];
        this.EditorData = {
            Name: this.SourceProject.Name,
            Desc: this.SourceProject.Desc,
            Tags: this.SourceProject.Tags,
            JavaScript: versionToEdit.Files["main.js"],
            Glsl: versionToEdit.Files["main.glsl"],
            ChangesDesc: "",
        };
    }

    GenerateCommit() {
        return new ProjectContentVersion({
            ChangesDesc: this.EditorData.ChangesDesc,
            Files: {
                "main.js": this.EditorData.JavaScript,
                "main.glsl": this.EditorData.Glsl
            }
        })
    }

    async OpenProject(fullName, version = null) {
        this.SourceProject = await Project.Load(fullName);
        this.EditProject(this.SourceProject, version);
    }

    StartNewProject() {
        this.SourceProject = null;
        this.SourceProjectVersionIndex = 0;
        this.EditorData = {
            ...Config.NewProjectTemplate,
            Name: "",
            Desc: "",
        };
    }

    async ImportMarkdown(mdStr, name) {
        const forkedFrom = ""; //TODO: parse front matter
        const content = ProjectContentVersion.FromMarkdown(mdStr);
        if(forkedFrom) {
            const forkedFromNameParts = forkedFrom.split('/');
            this.SourceProject = await Project.Load(forkedFromNameParts[0], forkedFromNameParts[1]);
            this.SourceProjectVersionIndex = parseInt(forkedFromNameParts[2]);
        } else {
            this.SourceProject = null;
            this.SourceProjectVersionIndex = 0;
        }
        this.EditorData.Name = name;
        this.EditorData.Tags = []; //TODO: parse front matter
        this.EditorData.ChangesDesc = ""; //TODO: parse front matter
        this.EditorData.Desc = ""; //TODO: parse ## Description
        this.EditorData.JavaScript = content.Files["main.js"];
        this.EditorData.Glsl = content.Files["main.glsl"];
    }



    async SaveProjectChanges() {
        if(this.UserSessionToken == null)
        {
            if(await Github.Login())
                return this.SaveProjectChanges();
        }
        await Http({
            method: "POST",
            path: `${Config.ServerUrl}/synthgen`,
            query: {
                token: this.UserSessionToken,
                parent: this.SourceProject != null? `${this.SourceProject.FullName}/${this.SourceProjectVersionIndex}`: null,
                name: this.EditorData.Name,
            },
            body: this.GenerateCommit(),
        });
        window.location.hash = `#${this.UserLogin}/${this.EditorData.Name}`;
        return true;
    }

    ExportToFile() {
        const tempCommit = this.GenerateCommit();
        const markdown = [
            "## Description\n", this.EditorData.Desc, "\n\n",
            tempCommit.Markdown,
        ].join("");
        SaveBlob(new Blob(
            [markdown],
            {type: "text/plain"}), `${this.EditorData.Name}.synthgen.md`);
    }

    get HasUnsharedChanges() {
        if(!this.SourceProject) return true;
        return this.SourceContent.Files["main.js"] !== this.EditorData.JavaScript ||
            this.SourceContent.Files["main.glsl"] !== this.EditorData.Glsl;
    }
    get PublishedAt() {
        return this.SourceProject && this.SourceProject.Versions[0].Date;
    }
    get PubliclyUpdatedAt() {
        return this.SourceProject && this.SourceProject.Versions[this.SourceProjectVersionIndex].Date;
    }
    get PubliclyUpdatedAtLocalStr() {
        const publiclyUpdatedAt = this.PubliclyUpdatedAt;
        if(!publiclyUpdatedAt) return this.Strings.never;
        else publiclyUpdatedAt.toLocaleString();
    }

    UpdateRendererState() {
        this.RendererWindow.postMessage({
            EditorData: this.EditorData
        }, "*");
    }
}
