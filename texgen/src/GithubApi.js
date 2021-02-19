const Github = new class {
    constructor() {
        this.UserToken = GetCookie("userGithubToken") || null;
    }

    async Login() {
        let oauthPopup = new OauthPopup({
            url: "https://github.com/login/oauth/authorize?client_id=5dcdf2c8569d8f86c9a5&scope=gist,read:user,user:email"
        });
        return await oauthPopup.Show();
    }

    async ListGists(username, since) {
        const entryPoint = username?
            `/users/${username}/gists`:
            `/gists/public`;
        const xhr = await Http({
            path: `https://api.github.com${entryPoint}`,
            query: {
                access_token: this.UserToken,
                since: since,
                per_page: 100
            },
        });
        return xhr.response;
    }

    async UploadGist(options, idToUpdate, fork) {
        if(!fork || !idToUpdate) return this.uploadGist(options, idToUpdate);

        const forkXhr = await Http({
            method: "POST",
            path: `https://api.github.com/gists/${idToUpdate}/forks`,
            query: {
                access_token: this.UserToken
            },
            json: true,
        });
        const forkedLoc = forkXhr.getResponseHeader("Location");
        const forkedId = forkedLoc.substr("https://api.github.com/gists/".length);
        return this.uploadGist(options, forkedId);
    }

    async uploadGist(options, idToUpdate) {
        return Http({
            method: idToUpdate? "PATCH": "POST",
            path: "https://api.github.com/gists" + idToUpdate? `/${idToUpdate}`: ``,
            query: {
                access_token: this.UserToken
            },
            body: options,
            json: true,
        });
    }
}

/**
* Opens a popup with given url and this popup will be polled by parent window for 'value' property on its window object.
* Once the 'value' property is set to true, the parent window will close the popup and trigger the given callback function.
*/
class OauthPopup {
    /**
     * @param {string} desc.url - url for popup
     * @param {number} [desc.pollInterval] - Interval in which to poll the popup window. (Default: 1000ms)
     * */
    constructor(desc) {
        this.url = desc.url;
        this.pollInterval = desc.pollInterval || 1000;

        /** @member {Window} */
        this.popup = null;
    }

    async Show() {
        return new Promise(function(resolve, reject) {
            const st = 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0,';
            const left = screen.width / 2 - 300, top = screen.height / 2 - 350;

            if(this.popup) this.popup.close();

            this.popup = window.open(this.url, '', st+'top=' + top + ',left=' + left + ',width=600,height=700');

            if(this.popupInterval) clearInterval(this.popupInterval);

            this.popupInterval = setInterval(() => {
                try {
                    if (this.popup && (this.popup.closed || this.popup.value)) {
                        clearInterval(this.popupInterval);
                        if(!this.popup.closed) this.popup.close();
                        resolve(this.popup.value);
                    }
                } catch (e) {
                  reject(e);
                }
            }, this.pollInterval);
        });
    }
}
