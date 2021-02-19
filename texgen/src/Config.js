
const Config = {
    BaseUrl: "https://synthgen.github.io", //window.location.host,
    ServerUrl: "https://devoln.herokuapp.com",

    NewProjectTemplate: {
        Tags: "texture",
        JavaScript: `{
    CanvasSize: [512, 512],
    Textures: {
        Texture: {
            Width: 512,
            Height: 512,
            Format: "byte4",
            Expr: "GetPixelColor(NormFragCoord)"
        }
    }
}
`,
        Glsl: `vec3 GetPixelColor(vec2 xy)
{
    float factor = 0.5 + PerlinOctaves(xy*10.0, vec2(10.0), 10)*0.5;
    return HSV2RGB(vec3(factor*2.0*PI, 0.8, 0.7));
}
`
    },
};
