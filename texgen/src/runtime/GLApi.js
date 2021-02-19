
class Shader {
    constructor(desc, glApi)
    {
        /** @member {string} */
        this.Code = desc.Code;

        /** @member {string} */
        this.Type = desc.Type;

        this.CompilerLog = "";

        this.glApi = glApi;

        /** @member {WebGLShader} */
        this.glId = null;

        this.Init();
    }

    Init()
    {
        const gl = this.glApi.GL;

        this.glType = this.Type === "vertex"? gl.VERTEX_SHADER: gl.FRAGMENT_SHADER;

        this.glId = gl.createShader(this.glType);
        gl.shaderSource(this.glId, this.Code);
        gl.compileShader(this.glId);
        const success = gl.getShaderParameter(this.glId, gl.COMPILE_STATUS);

        this.CompilerLog = gl.getShaderInfoLog(this.glId) || "";
        if(success && !this.CompilerLog.toLowerCase().includes("warn")) this.CompilerLog = "";
        else if(!this.CompilerLog.endsWith('\n')) this.CompilerLog += "\n";

        if(!success) {
            gl.deleteShader(this.glId);
            this.glId = null;
        }
    }

    Free()
    {
        if(this.glId == null) return;
        this.glApi.GL.deleteShader(this.glId);
        this.glId = null;
        this.CompilerLog = "";
    }
}

class ShaderProgram {
    constructor(vertexShader, fragmentShader) {
        this.glApi = vertexShader.glApi;
        console.assert(fragmentShader.glApi === this.glApi);
        this.VertexShader = vertexShader;
        this.FragmentShader = fragmentShader;

        /** @member {WebGLProgram} */
        this.glId = null;
    }

    Init()
    {
        const gl = this.glApi.GL;
        this.glId = gl.createProgram();
        gl.attachShader(this.glId, this.VertexShader.glId);
        gl.attachShader(this.glId, this.FragmentShader.glId);
        gl.linkProgram(this.glId);
        gl.detachShader(this.glId, this.VertexShader.glId);
        gl.detachShader(this.glId, this.FragmentShader.glId);

        const success = gl.getProgramParameter(this.glId, gl.LINK_STATUS);
        this.LinkerLog = gl.getProgramInfoLog(this.glId) || "";
        if(success && !this.LinkerLog.toLowerCase().includes("warn")) this.LinkerLog = "";
        else if(!this.LinkerLog.endsWith('\n')) this.LinkerLog += "\n";

        if(!success)
        {
            gl.deleteProgram(this.glId);
            this.glId = null;
        }
    }

    Free()
    {
        if(this.glId == null) return;
        this.glApi.GL.deleteProgram(this.glId);
        this.glId = null;
    }

    Bind()
    {
        if(this.glId == null) {
            console.error("Can't bind null shader!");
            return;
        }
        if(this.glApi.state.currentProgram === this.glId) return;
        this.glApi.GL.useProgram(this.glId);
        this.glApi.state.currentProgram = this.glId;
    }
}

class Texture {
    constructor(desc, glApi)
    {
        /** @member {Number} */
        this.Width = desc.Width;

        /** @member {Number} */
        this.Height = desc.Height;

        /** @member {string} */
        this.Format = desc.Format;

        /** @member {Boolean} */
        this.Mipmapped = !!desc.Mipmapped;

        this.Index = glApi.state.numTexturesCreated++;

        this.glApi = glApi;

        /** @member {GLenum} */
        this.glTarget = this.glApi.GL.TEXTURE_2D;

        /** @member {ArrayBufferView} */
        this.PixelData = desc.PixelData || null;

        /** @member {WebGLTexture} */
        this.glId = null;

        this.freed = true;

        this.Init();
    }

    Init()
    {
        if(this.glId) return;
        this.freed = false;

        const gl = this.glApi.GL;
        this.glMagFilter = gl.LINEAR;
        this.glMinFilter = this.Mipmapped? gl.LINEAR_MIPMAP_LINEAR: gl.LINEAR;

        const glTexFormat = this.parseTextureFormat(this.Format);
        if(!glTexFormat)
        {
            console.error("Invalid texture format " + this.Format + "!");
            return;
        }
        this.NumComponents = glTexFormat.numComponents;
        this.glComponentType = glTexFormat.type;
        this.glFormat = glTexFormat.format;
        this.glInternalFormat = glTexFormat.internalFormat;

        const isLinearFilteringUnsupported = this.glApi.GLVersion < 20 && (
            this.glComponentType === gl.HALF_FLOAT && !gl.extTextureHalfFloatLinear ||
            this.glComponentType === gl.FLOAT && !gl.extTextureFloatLinear);
        if(isLinearFilteringUnsupported)
        {
            console.warn("Texture filtering for pixel type " + this.glComponentType + " is not supported!\n");
            this.Mipmapped = false;
            this.glMagFilter = gl.NEAREST;
            this.glMinFilter = gl.NEAREST;
        }

        this.glId = gl.createTexture();
        gl.bindTexture(this.glTarget, this.glId);
        gl.texImage2D(this.glTarget, 0, this.glInternalFormat,
            this.Width, this.Height, 0, this.glFormat, this.glComponentType, this.PixelData);
        gl.texParameteri(this.glTarget, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
        gl.texParameteri(this.glTarget, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
        gl.bindTexture(this.glTarget, this.glApi.state.activeTextures[this.glApi.state.activeTextureSlot]);
    }

    Free()
    {
        if(this.glId == null) return;
        this.glApi.GL.deleteTexture(this.glId);
        this.glId = null;
        this.glApi.state.numTexturesDeleted++;
        this.freed = true;
    }

    parseTextureFormat(str)
    {
        const gl = this.glApi.GL;
        const numComponents = str.charCodeAt(str.length - 1) - 48;
        if(numComponents < 1 || numComponents > 4)
        {
            console.error("Invalid texture format " + str + "!");
            return null;
        }
        const typeStr = str.slice(0, -1);
        const type = this.glApi.Map.stringToGLType[typeStr];
        const format = [
            this.glApi.GLVersion >= 20? gl.RED: null,
            this.glApi.GLVersion >= 20? gl.RG: null,
            gl.RGB,
            gl.RGBA
        ][numComponents-1];
        let internalFormat = format;
        if(this.glApi.GLVersion >= 20)
        {
            internalFormat = this.glApi.Map.stringToWebGL2InternalFormat[str];
            if(!internalFormat)
            {
                console.error("Invalid texture format " + str + "!");
                return null;
            }
        }
        return {
            numComponents,
            type,
            format,
            internalFormat
        };
    }
}

class GLApi {
    constructor(canvas, webglVersion = 10) {
        this.state = {
            currentFBO: null,
            activeTextures: Array(32).fill(null),
            activeTextureSlot: 0,
            currentProgram: null,
            numTexturesCreated: 0,
            numTexturesDeleted: 0,
        };

        /** @member {HTMLCanvasElement} */
        this.Canvas = canvas;

        this.Map = {};

        /** @member {WebGLRenderingContext} */
        this.GL = webglVersion < 20? null: this.Canvas.getContext("webgl2", {antialias: false});
        if(!this.GL)
        {
            this.GL = this.Canvas.getContext("webgl", {antialias: false}) ||
                this.Canvas.getContext("experimental-webgl", {antialias: false});
            if(this.GL) this.GLVersion = 10;
        }
        else this.GLVersion = 20;

        const gl = this.GL;
        if(gl) {
            gl.extTextureFloat = gl.getExtension("OES_texture_float");
            gl.extTextureFloatLinear = gl.getExtension("OES_texture_float_linear");
            gl.extTextureHalfFloat = gl.getExtension("OES_texture_half_float");
            gl.extTextureHalfFloatLinear = gl.getExtension("OES_texture_half_float_linear");
            if (this.GLVersion >= 20) gl.getExtension("EXT_color_buffer_float");
            else gl.getExtension("WEBGL_color_buffer_float");

            gl.floatTextureRenderSupported =
                this.GLVersion >= 20 ||
                gl.extTextureFloat && gl.extTextureFloatLinear;

            gl.halfFloatTextureRenderSupported =
                this.GLVersion >= 20 ||
                gl.extTextureHalfFloat && gl.extTextureHalfFloatLinear;

            if (this.GLVersion < 20 && gl.halfFloatTextureRenderSupported)
                gl.HALF_FLOAT = gl.extTextureHalfFloat.HALF_FLOAT_OES;


            this.Map.stringToGLType = {
                "byte": gl.UNSIGNED_BYTE,
                "sbyte": gl.BYTE,
                "ushort": gl.UNSIGNED_SHORT,
                "short": gl.SHORT,
                "float": gl.FLOAT,
                "int": gl.INT,
                "uint": gl.UNSIGNED_INT,
                "half": gl.HALF_FLOAT
            };

            this.Map.stringToWebGL2InternalFormat = {
                "byte1": gl.R8,
                "half1": gl.R16F,
                "float1": gl.R32F,

                "byte2": gl.RG8,
                "half2": gl.RG16F,
                "float2": gl.RG32F,

                "byte3": gl.RGB8,
                "half3": gl.RGB16F,
                "float3": gl.RGB32F,

                "byte4": gl.RGBA8,
                "half4": gl.RGBA16F,
                "float4": gl.RGBA32F
            };
        }
    }

    FramebufferBind(fbo)
    {
        const gl = this.GL;
        if(this.state.currentFBO === fbo) return;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        this.state.currentFBO = fbo;
    }
}
