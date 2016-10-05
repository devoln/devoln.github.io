
function CompileShader(gl, code, type)
{
	var sh = gl.createShader(type);
	gl.shaderSource(sh, code);
	gl.compileShader(sh);
	console.log(gl.getShaderInfoLog(sh));
	return sh;
}

function LinkShaderProgram(gl, vertexShaderId, fragmentShaderId)
{
	var prog = gl.createProgram();
	gl.attachShader(prog, vertexShaderId);
	gl.attachShader(prog, fragmentShaderId);
	gl.linkProgram(prog);
	gl.useProgram(prog);
	console.log(gl.getProgramInfoLog(prog));
	return prog;
}

function CompileShaderProgram(gl, vertexCode, fragmentCode)
{
	return LinkShaderProgram(gl, CompileShader(gl, vertexCode, gl.VERTEX_SHADER), CompileShader(gl, fragmentCode, gl.FRAGMENT_SHADER));
}

function RotationMatrixDeg(angle, axis) 
{
	var arad = angle*Math.PI/180.0;
	return Matrix.Rotation(arad, $V([axis[0], axis[1], axis[2]])).ensure4x4();
}

function TranslationMatrix(vec)
{
	return Matrix.Translation($V([vec[0], vec[1], vec[2]])).ensure4x4();
}

function SetMatrixUniform(gl, programId, name, mat)
{
    var loc = gl.getUniformLocation(programId, name);
    gl.uniformMatrix4fv(loc, false, new Float32Array(mat.flatten())); 
}