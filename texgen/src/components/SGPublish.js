"use strict";

Vue.component('SGPublish', {
    data() {
        return {
            activeTabIndex: 0, //js, glsl, publish, history, results
        }
    },
    props: {state: AppState},
    computed: {
        isPublishingFork() {
            return !this.state.CurrentSynthgen.IsVersionOf(this.state.SourceSynthgen);
        }
    },
    watch: {

    },
    methods: {

    },
    template: `
    <div class="menu-bar">
        <label>{{ state.UserLogin }}/</label><input type="text" v-model="name"/>
        <a class="action"
           :class="{ highlight: false }"
           :title="loc.saveLinkHotKey"
           onclick="state.SaveCurrentSynthgen()">
            <i class="fas fa-upload"></i>
            {{ isPublishingFork? state.Strings.Publish: state.Strings.PublishChanges }}
        </a>
        <a class="action"
           :class="{ highlight: false }"
           :title="loc.saveToFileHotKey"
           onclick="state.SaveToFile()">
           <i class="fas fa-save"></i>
        </a>
    </div>
    `
});
