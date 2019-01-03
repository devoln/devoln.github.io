var serverAddress = "https://devoln.herokuapp.com"

function SaveSynthGenGist(data, token, onSuccess)
{
	Http({
        method: "POST",
        path: serverAddress + "/synthgen?token=" + token,
        body: data,
        then: onSuccess
    });
}


/**
* Opens a popup with given url and this popup will be polled by parent window for 'value' property on its window object.
* Once the 'value' property is set to true, the parent window will close the popup and trigger the given callback function.
* @param {string} url - url for popup
* @param {number} [pollInterval] - Interval in which to poll the popup window. (Default: 1000ms) 
*/
function OauthPopup(url, pollInterval) {
  this.url = url;
  this.pollInterval = pollInterval || 1000;
}

/**
* @param {function} [callbackFn] - function to be triggered once the 'value' property of popup is set to true.
*/
OauthPopup.prototype.showPopup = function(callbackFn) {
	var st='toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0,';
  var left = screen.width / 2 - 300, top = screen.height / 2 - 350;
  
  if(this.popup) {
  	this.popup.close();
  }
      
  this.popup = window.open(this.url, '', st+'top=' + top + ',left=' + left + ',width=600,height=700');
  
  if(this.popupInterval) {
  	clearInterval(this.popupInterval);
  }
  
  this.popupInterval = setInterval(function() {
    try {
      if (this.popup && (this.popup.closed || this.popup.value)) {
        clearInterval(this.popupInterval);
        if(!this.popup.closed) {
        	this.popup.close();
        }
        if(this.popup.value && callbackFn) {
        	callbackFn();
        }   
      }
    } catch (e) {
      console.error(e);
    }
  }, this.pollInterval);
}


function GistApiCall(options)
{
    options.path = "https://api.github.com" + options.entryPoint;
    Http(options);
}

function ListGists(onSuccess, username, since, accessToken)
{
    var entryPoint;
    if(username) entryPoint = "/users/" + username + "/gists";
    else entryPoint = "/gists/public"
    GistApiCall({
        entryPoint: entryPoint,
        query: {
            access_token: accessToken,
            since: since,
            per_page: 100
        },
        then: onSuccess
    });
}

function UploadGist(accessToken, options, onSuccess, idToUpdate, fork)
{
    function uploadGist(idToUpdate) {
        GistApiCall({
            method: idToUpdate? "PATCH": "POST",
            entryPoint: "/gists" + idToUpdate? "/" + idToUpdate: "",
            query: {
                access_token: accessToken
            },
            body: options,
            json: true,
            then: onSuccess
        });
    }
    if(!fork || !idToUpdate)
    {
        uploadGist(idToUpdate);
        return;
    }
    GistApiCall({
        method: "POST",
        entryPoint: "/gists/" + idToUpdate + "/forks",
        query: {
            access_token: accessToken
        },
        json: true,
        then: function(xhr) {
            var forkedLoc = xhr.getResponseHeader("Location");
            var forkedId = forkedLoc.substr("https://api.github.com/gists/".length);
            uploadGist(forkedId);
        }
    });
}

function SendHeartbeat(token, gistid, updatedAt, deltaTimeS)
{
    Http({
        path: serverAddress + "/heartbeat",
        query: {
            token: token,
            gistid: gistid,
            updatedAt: updatedAt,
            deltaTimeS: deltaTimeS
        }
    });
}
