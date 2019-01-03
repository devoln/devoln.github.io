/*function Save(showMsg)
{
	DBInsert("texgens", {
			"code": GetCodeInput(),
			"shader": GetShaderInput(),
			"name": "<unnamed>"
		}, function(result) {
            app.hasUnsharedChanges = false;
			app.hasUnsavedChanges = false;
			var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?id=" + result._id;
			window.history.replaceState({}, document.title, newUrl);
			if(showMsg) alert("Сохранено. Скопируйте ссылку из адресной строки.");
    }
  );
}*/

function GithubLogin(onSuccess)
{
  var oauthPopup = new OauthPopup('https://github.com/login/oauth/authorize?client_id=5dcdf2c8569d8f86c9a5&scope=gist,read:user,user:email');
  oauthPopup.showPopup(function() {
    if(onSuccess) onSuccess();
    alert('Popup closed');
    console.log("Popup closed");
    app.userLogin = GetCookie("userLogin") || null
    app.userToken = GetCookie("userToken") || null
  });
}

function FindSynthgen(username, name, onResult)
{
  ListGists(function(xhr) {
    var userGists = xhr.response;
    var foundGist = null;
    for(var i = 0; i < userGists.length; i++)
    {
      var descCommaPos = userGists[i].description.indexOf(",");
      if(descCommaPos < 0 || userGists[i].description.indexOf("#SynthGen") === -1) continue;
      var sgName = userGists[i].description.substr(descCommaPos);
      if(sgName != name) continue;
      foundGist = userGists[i];
      var result = {
        GistID: foundGist.id,
        CreatedAt: foundGist.createdAt,
        UpdatedAt: foundGist.updatedAt
      }
      onResult(result);
    }
  }, username, null, app.userToken)
}

function Save(showMsg)
{
  if(app.userToken == null)
  {
    GithubLogin(function(){Save(showMsg);});
    return;
  }
  var name = GetName();
  var glsl = GetShaderInput();
  var js = GetCodeInput();
  var file = CreateMD(glsl, js, username, name, app.createdAt);
  var files = {};
  files[name + ".synthgen.md"] = {content: file};
  UploadGist(app.userToken, {
    files: files,
    description: name + ", created by #SynthGen",
    public: true,
    token: app.userToken
  }, function(result) {
      app.onShare();
      window.location.hash = "#" + username + "/" + name;
      SendHeartbeat(app.userToken, result.id, result.updated_at, 0);
	    if(showMsg) alert("Сохранено. Скопируйте ссылку из адресной строки.");
    }, app.gistId, app.userLogin != app.loadedSynthgenUserLogin || name != app.loadedSynthgenName
  );
}

function GetName()
{
  return app.name = Slugify(app.name);
}

function SaveToFile()
{
  var name = GetName();
  SaveBlob(new Blob(
    [CreateMD(app.glsl, app.js, app.userLogin, GetName(), app.createdAt || new Date())],
    {type: "text/javascript"}), name + ".synthgen.md");
  app.onSave();
}

function Load()
{
    if(!location.hash) return; 
    var id = location.hash.substr(0, 2) == "#_"? location.hash.substr(2): null;
  
    function OnLoad(result)
    {
        if(result != "<unnamed>") app.name = result.name;
        else app.name = "_" + result._id;
        app.createdAt = result.createdAt;
        app.updatedAt = result.updatedAt;
        app.js = result.code;
        app.glsl = result.shader;
        app.onShare();
    }

	if(id)
	{
		DBReadById("texgens", id, ["code", "shader", "_id", "name", "createdAt", "updatedAt"], OnLoad);
		return;
	}
	var name = location.hash.substr(1);
	if(name)
	{
		DBQuery("texgens",
			{"name": {"$eq": name}},
			function(results) {
				if(results[0] === undefined) return;
				OnLoad(results[0]);
			},
			{fields: ["code", "shader", "_id", "name", "createdAt", "updatedAt"], limit: 1});
		return;
	}
}

function ExecuteInIFrame(controlCode, glsl)
{
  (eResultFrame.contentWindow || eResultFrame).postMessage({
    controlCode: controlCode,
    glsl: glsl
  }, "*");
}

function Generate()
{
    app.onGenerate();
    ExecuteInIFrame(app.js, app.glsl);
}

var mdLinkStart = "[![Open in SynthGen](https://synthgen.github.io/images/openlink.png)](https://synthgen.github.io#";
var mdLinkEnd = ")\n";

function CreateMD(glsl, js, username, name, createdAt)
{
  return [
    "---\n",
    createdAt? "CreatedAt: " + createdAt.toISOString() + "\n": "",
    "---\n\n",
    mdLinkStart, username || "", "/", name || "", mdLinkEnd,
    "## Control code\n```javascript\n", js, "\n```\n\n",
    "## Shader code\n```glsl\n", glsl.replace(/\n```\n/g, "\n'''\n"), "\n``\x60\n\n"
  ].join("");
}

function DeserializeState(str)
{
  if(str.substr(0, 1) === "{")
  {
    var result = JSON.parse(str);
    if(result.GLSL === undefined) result.GLSL = result.shader;
    if(result.JS === undefined) result.JS = result.code
    return result
  }
  var result = {}
  var pos = 0;
  var endMetaEnd = 0;
  if(str.substr(pos, 3) == "---")
  {
    str = str.replace(/\r\n/g, "\n");
    var endMeta = "\n---\n\n";
    var endMetaOffset = str.indexOf(endMeta, pos + 3);
    endMetaEnd = endMetaOffset + endMeta.length;
    var meta = str.substring(3, endMetaOffset).trim().split("\n");
    for(var i = 0; i < meta.length; i++)
    {
      var offset = meta[i].indexOf(":");
      if(offset == -1) continue;
      var key = meta[i].substr(0, offset).trim();
      var value = meta[i].substr(offset).trim();
      result[key] = value;
    }

    var linkOffset = str.indexOf(mdLinkStart, endMetaEnd);
    if(linkOffset != -1)
    {
      linkOffset += mdLinkStart.length;
      var linkEndOffset = str.indexOf(mdLinkEnd, linkOffset);
      var fullName = str.substring(linkOffset, linkEndOffset).split("/");
      result.UserName = fullName[0];
      result.Name = fullName[1];
    }

    var jsStartMarker = "```javascript\n";
    var jsOffset = str.indexOf(jsStartMarker, endMetaEnd);
    if(jsOffset != -1)
    {
      jsOffset += jsStartMarker.length;
      var jsEndOffset = str.indexOf("\n```\n\n", jsOffset);
      result.JS = str.substring(jsOffset, jsEndOffset);
    }

    var glslStartMarker = "```glsl\n";
    var glslOffset = str.indexOf(glslStartMarker, endMetaEnd);
    if(glslOffset != -1)
    {
      glslOffset += glslStartMarker;
      var glslEndOffset = str.indexOf("\n```\n\n", glslOffset);
      result.GLSL = str.substring(glslOffset, glslEndOffset);
    }
  }
  return result;
}
