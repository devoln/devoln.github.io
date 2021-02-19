"use strict";

Vue.component('SGApp', {
    data: {
        state: new AppState(),
        name: "",
    },
    computed: {
    },
    watch: {
        name(val) {
            this.state.EditorData.Name = Slugify(val);
        }
    },
    methods: {
        onChangeJS(val) {
            this.state.EditorData.JavaScript = val;
            this.state.UpdateRendererState();
        },
        onChangeGLSL(val) {
            this.state.EditorData.Glsl = val;
            this.state.UpdateRendererState();
        },
        onShareClick() {
            this.state.SaveProjectChanges().then(() => {
                alert(this.state.Strings.PublishedSuccessfully);
            });
        },
        onFileExportClick() {
            this.state.ExportToFile();
        }
    },
    mounted() {
        this.$refs.jsCode.addAutoCompletion([
            //["Texture.FromShader", ["exprOrShader", "width=CanvasSize[0]", "height=CanvasSize[1]", "format='byte4'", "inputTexturesArr=[]", "params=[]"]],
            //["new ShaderExpression", ["expr", "numComponents"]],
            //["Export", ["name"]]
        ]);
        this.$refs.shaderCode.addAutoCompletion([
            ["TexCoord", null]
        ]);

        window.onbeforeunload = function(e) {
            if(!this.state.HasUnsharedChanges) return;
            const dialogText = this.Strings.UnsavedCloseDialogText;
            e.returnValue = dialogText;
            return dialogText;
        };

        /*document.onkeydown = function(e)
        {
            if(e.keyCode === 117 || e.ctrlKey && e.keyCode === 76) //F6, Ctrl+L
            {
                this.state.SaveProjectChanges();
                return true;
            }
        }*/
    },
    template: `
<div class="app">
    <sg-header state="state"></sg-header>
    <div class="main-layout">
        <div class="area editors">
            <sg-code-editor v-show="state.ActiveTabIndex === 0"
                ref="jsCode" theme="twilight" :content="state.EditorData.JavaScript" lang="javascript" @change-content="onChangeJS"></sg-code-editor>
            <sg-code-editor v-show="state.ActiveTabIndex === 1"
                ref="shaderCode" theme="twilight" :content="state.EditorData.Glsl" lang="glsl" @change-content="onChangeGLSL"></sg-code-editor>
        </div>
        
        <sg-splitter></sg-splitter>
        
        <div class="result">
            <div class="area">
                <div style="height:100%;overflow:hidden">
                    <iframe id="eResultFrame" sandbox="allow-scripts allow-modals allow-downloads" src="/render-frame.html"></iframe>
                </div>
            </div>
        </div>
    </div>
    <footer class="status">

    </footer>
</div>
    `
});
