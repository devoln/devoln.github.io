
class Engine {
    constructor(canvas, webglVersion = 10)
    {
        this.ShaderLibraryCode = "";
        this.UserState = {
            Textures: {},
            Meshes: {}
        }
        
        this.GAPI = new GLApi(canvas, webglVersion);
        this.Common = {};

        if(this.GAPI.GL) this.initResources();
        else console.error("WebGL is not supported!");
    }

    initResources()
    {
        const gl = this.GAPI.GL;

        this.Common.VertexShader = new Shader({
            Code: `#version 100
attribute vec2 aTexCoord;
varying vec2 TexCoord;
void main()
{
	TexCoord = aTexCoord;
	gl_Position = vec4(TexCoord*2.0 - 1.0, 0.0, 1.0);
}`, Type: "vertex"}, this.GAPI);
        this.Common.ExportFragmentShader = new Shader({
        Code: `#version 100
precision mediump float;
varying vec2 TexCoord;
uniform sampler2D Texture;
void main()
{
	gl_FragColor = texture2D(Texture, TexCoord);
}`,
    Type: "fragment"
    },
            gl.FRAGMENT_SHADER);
        this.Common.ExportShaderProgram = new ShaderProgram(
            this.Common.VertexShader, this.Common.ExportFragmentShader);
        this.Common.ExportShaderProgram.samplers = [{uniformLocation: 0, sizeUniformLocation: null, name: "Texture"}];

        this.Common.QuadBufferId = function()
        {
            let buffer = new ArrayBuffer(32);
            new Float32Array(buffer).set([0,0, 1,0, 0,1, 1,1]);
            let bufId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, bufId);
            gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
            return bufId;
        }();

        this.Common.Framebuffer = gl.createFramebuffer();


        this.Common.FragmentShaderCodeStart =
        `#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
#if GL_FRAGMENT_PRECISION_HIGH == 1
precision highp float;
#else
precision mediump float;
#endif
#else
precision mediump float;
#endif
`;

        this.Common.ShaderLibraryCode =
`vec4 rgbaExtend(float x) {return vec4(x, x, x, 1.0);}
vec4 rgbaExtend(vec2 x) {return vec4(x.xy, 0.0, 1.0);}
vec4 rgbaExtend(vec3 x) {return vec4(x, 1.0);}
vec4 rgbaExtend(vec4 x) {return x;}
`;

        this.Common.VertexShaderCodeStart =
            `#version 100
varying vec2 TexCoord;
`;
    }

    generateUniformDeclarations(expr, availableTextures, uniforms)
    {
        let code = "uniform vec2 ViewportSize;\n";
        for(const [name, imageDesc] of Object.entries(availableTextures || {}))
        {
            if(expr.includes(name)) code += "uniform sampler2D " + name + ";\n";
            if(expr.includes(name + "Size")) code += "uniform vec2 " + name + "Size" + ";\n";
        }
        for(const [name, uniformDesc] of Object.entries(uniforms || {}))
        {
            if(expr.includes(name)) code += "uniform " + uniformDesc.Type + " " + name + ";\n";
        }
    }

    fragmentShaderFromExpression(expr, libCode, availableTextures, uniforms)
    {
        //TODO: move libCode generation to the caller
        libCode = this.Common.FragmentShaderCodeStart;
        if(this.ShaderLibraryCode)
            libCode += "#line 1 1\n" + this.ShaderLibraryCode;
        libCode += "\n#line 1 2\n" + gShaderInputCode;

        const uniformDeclarations = this.generateUniformDeclarations(expr, availableTextures, uniforms);
        const code = `${libCode}
#line 1 3
${uniformDeclarations}
varying vec2 NormFragCoord;
void main() {
  gl_FragColor = rgbaExtend(
#line 1 4
    ${expr}
);}
`;
        let shader = new Shader({Code: code, Type: "fragment"}, this.GAPI);
        shader.Expr = expr;
        return shader;
    }

    ShaderProgramFromExpression(expr, libCode, availableTextures, uniforms)
    {
        const gl = this.GAPI.GL;

        let fragmentShader = this.fragmentShaderFromExpression(expr, libCode, availableTextures, uniforms);
        let shaderProgram = new ShaderProgram(this.Common.VertexShader, fragmentShader);
        shaderProgram.Expr = expr;
        if(shaderProgram.glId == null)
        {
            console.error("Couldn't compile expression \"" + expr + "\"!\n" + fragmentShader.CompilerLog);
            return null;
        }
        fragmentShader.Free();

        shaderProgram.viewportSizeLoc = gl.getUniformLocation(shaderProgram.glId, "ViewportSize");
        shaderProgram.samplers = [];
        shaderProgram.Bind();
        let i = 0;
        for(const [name, imageDesc] of Object.entries(availableTextures || {}))
        {
            if(!expr.includes(name)) continue;
            const loc = gl.getUniformLocation(shaderProgram.glId, name);
            const sizeLoc = gl.getUniformLocation(shaderProgram.glId, name + "Size");
            if(loc == null && sizeLoc == null) continue;
            shaderProgram.samplers.push({
                samplerName: name,
                uniformLocation: loc,
                sizeUniformLocation: sizeLoc,
            });
            if(loc != null) gl.uniform1i(loc, i);
            i++;
        }
        return shaderProgram;
    }

    DrawFullViewportQuad()
    {
        const gl = this.GAPI.GL;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.Common.QuadBufferId);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
        gl.enableVertexAttribArray(0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(0);
    }

    FillViewportWithShader(shaderProgram, width, height, availableTextures)
    {
        const gl = this.GAPI.GL;
        shaderProgram.Bind();
        if(shaderProgram.viewportSizeLoc != null) gl.uniform2f(shaderProgram.viewportSizeLoc, width, height);

        const numTex = shaderProgram.samplers.length;

        this.GAPI.BindTextures(shaderProgram, availableTextures);

        for(let i = 0; i < numTex; i++)
        {
            const sampler = shaderProgram.samplers[i];
            if(!sampler.sizeUniformLocation) continue;
            const texture = availableTextures[sampler.name];
            gl.uniform2f(sampler.sizeUniformLocation, texture.Width, texture.Height);
        }

        gl.viewport(0, 0, width, height);
        this.DrawFullViewportQuad();
        return true;
    }

    TextureFromShader(textureDesc, shaderProgram, availableTextures)
    {
        const gl = this.GAPI.GL;
        let texture = new Texture(textureDesc, this.GAPI);
        if(texture.glId == null) return texture;

        this.GAPI.FramebufferBind(this.Common.Framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture.glTarget, texture.glId, 0);
        let success = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        if(!success) {
            console.error("Error: framebuffer incomplete status 0x" + gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16));
            texture.Free();
            return texture;
        }
        else {
            success = this.FillViewportWithShader(shaderProgram, texture.Width, texture.Height, availableTextures);
            if(!success) texture.Free();
            else if(texture.Mipmapped) gl.generateMipmap(texture.glTarget);
        }
        return texture;
    }

    BindTextures(shaderProgram, availableTextures)
    {
        const gl = this.GAPI.GL;
        const count = shaderProgram.samplers.length;
        for(let i = 0; i < count; i++)
        {
            const sampler = shaderProgram.samplers[i];
            if(this.GAPI.state.activeTextureSlot !== i)
            {
                gl.activeTexture(gl.TEXTURE0 + i);
                this.GAPI.state.activeTextureSlot = i;
            }
            const tex = availableTextures[sampler.name];
            if(!tex || tex.glId == null)
            {
                gl.bindTexture(gl.TEXTURE_2D, null);
                console.warn("BindTextures: " + sampler.name + " is not available!");
                continue;
            }
            gl.bindTexture(tex.glTarget, tex.glId);
            this.GAPI.state.activeTextures[i] = tex.glId;
        }
    }

    // Warning: resizes the current canvas and fills it with texture as a side effect
    TextureToCanvas(texture, dstCanvas)
    {
        let canvas = this.GAPI.Canvas;
        if(!dstCanvas) dstCanvas = canvas;
        if(dstCanvas !== canvas &&
            (canvas.width !== dstCanvas.width ||
                canvas.height !== dstCanvas.height))
        {
            canvas.width = dstCanvas.width;
            canvas.height = dstCanvas.height;
        }
        this.GAPI.FramebufferBind(null);
        this.FillViewportWithShader(this.Common.ExportShaderProgram,
            canvas.width, canvas.height, {Texture: texture});
        if(dstCanvas !== this.GAPI.Canvas)
        {
            if(!dstCanvas.context) dstCanvas.context = dstCanvas.getContext("2d");
            dstCanvas.context.drawImage(canvas, 0, 0);
        }
    }

    // Warning: resizes the current canvas and fills it with texture as a side effect
    // returns this canvas
    TextureToThisCanvas(texture)
    {
        let canvas = this.GAPI.Canvas;
        if(canvas.width !== texture.Width ||
            canvas.height !== texture.Height)
        {
            canvas.width = texture.Width;
            canvas.height = texture.Height;
        }
        this.GAPI.FramebufferBind(null);
        this.FillViewportWithShader(this.Common.ExportShaderProgram,
            canvas.width, canvas.height, {Texture: texture});
        return canvas;
    }

    TexturePixels(texture)
    {
        const gl = this.GAPI.GL;
        if(texture.type !== gl.BYTE || texture.numComponents !== 4)
        {
            const tex2 = this.TextureFromShader(
                {Width: texture.Width, Height: texture.Height, Format: "byte4"},
                this.Common.ExportShaderProgram, {Texture: texture});
            const result = CreateImageFromTexture(tex2);
            tex2.Free();
            return result;
        }
        let prevFBO = this.GAPI.state.currentFBO;
        this.GAPI.FramebufferBind(this.Common.Framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture.glTarget, texture.glId, 0);
        let pixels = new Uint8Array(texture.Width * texture.Height * texture.NumComponents);
        gl.readPixels(0, 0, texture.Width, texture.Height, texture.glFormat, texture.glType, pixels);
        this.GAPI.FramebufferBind(prevFBO);
    }
}

class GraphicsCache {
    constructor(engine) {
        /** @member {Engine} */
        this.Engine = engine;

        /**
         * @member {Object<string, Texture>}
         * Textures are named by user
         */
        this.Textures = {};

        /**
         * @member {Object<string, Object>}
         * Meshes are named by user
         */
        this.Meshes = {};

        /**
         * @member {Object<string, ShaderProgram>}
         * Shader programs are named as `${textureOrMesh.Name}.Expr`
         */
        this.ShaderPrograms = {};
    }

    Texture(name, desc) {
        let tex = this.Textures[name];
        if(!tex) tex = this.Engine.TextureFromShader();
    }

    /** @summary Deletes all the resources that haven't been used since the last call of this method. */
    GarbageCollect() {
        for (const [name, texture] of Object.entries(this.Textures)) {
            if(texture.usageCount)
            {
                texture.usageCount = 0;
                continue;
            }
            texture.Free();
            delete this.Textures[name];
        }
        for (const [name, mesh] of Object.entries(this.Meshes)) {
            if(mesh.usageCount)
            {
                mesh.usageCount = 0;
                continue;
            }
            mesh.Free();
            delete this.Meshes[name];
        }
        for (const [name, shaderProgram] of Object.entries(this.ShaderPrograms)) {
            if(shaderProgram.usageCount)
            {
                shaderProgram.usageCount = 0;
                continue;
            }
            shaderProgram.Free();
            delete this.ShaderPrograms[name];
        }
    }
}
