"use strict";

Vue.component('SGHeader', {
    data() {
        return {
        }
    },
    props: {state: AppState},
    computed: {

    },
    watch: {

    },
    methods: {
        onTabClick(index) {
            this.state.ActiveTabIndex = this.state.ActiveTabIndex === index? -1: index;
        },
    },
    template: `
    <div class="main menu-bar">
        <a class="action"
            :click="onTabClick(0)"
            :class="{ highlight: state.ActiveTabIndex === 0 }"
            :title="state.Strings.MainCodeBtn"
        >
            <i class="fas fa-code"></i>
        </a>
        <a class="action"
            :click="onTabClick(1)"
            :class="{ highlight: state.ActiveTabIndex === 1 }"
            :title="state.Strings.ShaderCodeBtn"
        >
            <i class="fas fa-file-alt"></i>
        </a>
        <a class="action"
            :click="onTabClick(2)"
            :class="{ highlight: state.ActiveTabIndex === 2 }"
            :title="state.Strings.PublishSettingsBtn"
            onclick="">
            <i class="fas fa-envelope-open-text"></i>
        </a>
        <a class="action"
            :click="onTabClick(3)"
            :class="{ highlight: state.ActiveTabIndex === 3 }"
            :title="state.Strings.ShowHistoryBtn"
        >
            <i class="fas fa-code-branch"></i>
        </a>
        <a class="action"
            :click="onTabClick(4)"
            :class="{ highlight: state.ActiveTabIndex === 4 }"
            :title="state.Strings.ShowCommentsBtn"
        >
            <i class="fas fa-comment-dots"></i>
        </a>
        <a class="action"
            :click="onTabClick(5)"
            :class="{ highlight: state.ActiveTabIndex === 5 }"
            :title="state.Strings.ShowSlidersBtn"
        >
            <i class="fas fa-sliders-h"></i>
        </a>
        <a class="action"
            :click="state.ShowResults = !state.ShowResults"
            :class="{ highlight: state.ShowResults }"
            :title="state.Strings.ShowResultsBtn"
        >
            <i class="fas fa-eye"></i>
        </a>
    </div>
    `
});
