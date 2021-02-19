"use strict";

ace.require("ace/ext/language_tools");
Vue.component('SGCodeEditor', {
    props: ['editorId', 'content', 'lang', 'theme'],
    data() {
        return {
            editor: Object,
            beforeContent: ''
        }
    },
    watch: {
        content(value) {
            if (this.beforeContent !== value) {
                this.editor.setValue(value, 1)
            }
        }
    },
    methods: {
        addAutoCompletion(editor, wordList)
        {
            const self = this;
            let staticWordCompleter = {
                getCompletions(editor1, session, pos, prefix, callback) {
                    if(self.editor === editor1) callback(null, wordList.map(function(word) {
                        let caption = word[0];
                        if(word[1] != null) caption += "(" + word[1].join(", ") + ")";
                        return {
                            caption: caption,
                            value: word[0] + ((word[1] != null)? "(": ""),
                            meta: word[1] == null? "parameter": "function"
                        };
                    }));
                }
            };
            self.editor.completers.unshift(staticWordCompleter);
            if(!self.editor.completer) {
                // make sure completer is initialized
                self.editor.execCommand("startAutocomplete")
                self.editor.completer.detach()
            }
            self.editor.completer.popup.container.style.width = "60%";
        }
    },
    mounted() {
        const lang = this.lang || 'text';
        const theme = this.theme || 'github';

        this.editor = window.ace.edit(this.editorId);
        this.editor.setValue(this.content, 1);

        document.getElementById(this.editorId).editor = this.editor;

        this.editor.getSession().setMode("ace/mode/" + lang);
        this.editor.setTheme("ace/theme/" + theme);

        this.editor.commands.bindKeys({"ctrl-l": null});
        this.editor.$blockScrolling = Infinity;
        this.editor.setFontSize(16);
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
        });

        this.editor.on('change', () => {
            this.beforeContent = this.editor.getValue()
            this.$emit('change-content', this.editor.getValue())
        });
    },
    template: `<div :id="editorId" style="position: relative; width: 100%; height: 100%;"></div>`,
})
