///////////////////////////////////////
// GLSL < 1.3 Compatibility Library //
///////////////////////////////////////

#if(__VERSION__ < 130)
vec4 texture(sampler2D s, vec2 texcoord) {return texture2D(s, texcoord);}
vec4 texture(samplerCube s, vec3 texcoord) {return textureCube(s, texcoord);}

float sinh(float x) {return 0.5*(exp(x) - exp(-x));}
vec2 sinh(vec2 x) {return 0.5*(exp(x) - exp(-x));}
vec3 sinh(vec3 x) {return 0.5*(exp(x) - exp(-x));}
vec4 sinh(vec4 x) {return 0.5*(exp(x) - exp(-x));}

float cosh(float x) {return 0.5*(exp(x) + exp(-x));}
vec2 cosh(vec2 x) {return 0.5*(exp(x) + exp(-x));}
vec3 cosh(vec3 x) {return 0.5*(exp(x) + exp(-x));}
vec4 cosh(vec4 x) {return 0.5*(exp(x) + exp(-x));}

float tanh(float x) {return (exp(x) - exp(-x)) / (exp(x) + exp(-x));}
vec2 tanh(vec2 x) {return (exp(x) - exp(-x)) / (exp(x) + exp(-x));}
vec3 tanh(vec3 x) {return (exp(x) - exp(-x)) / (exp(x) + exp(-x));}
vec4 tanh(vec4 x) {return (exp(x) - exp(-x)) / (exp(x) + exp(-x));}
#endif

////////////////////////////////
// HLSL Compatibility Library //
////////////////////////////////

#define float2 vec2
#define float3 vec3
#define float4 vec4

float saturate(float x) {return clamp(x, 0.0, 1.0);}
vec2 saturate(vec2 x) {return clamp(x, 0.0, 1.0);}
vec3 saturate(vec3 x) {return clamp(x, 0.0, 1.0);}
vec4 saturate(vec4 x) {return clamp(x, 0.0, 1.0);}

float frac(float x) {return fract(x);}
vec2 frac(vec2 x) {return fract(x);}
vec3 frac(vec3 x) {return fract(x);}
vec4 frac(vec4 x) {return fract(x);}

vec4 tex2D(sampler2D s, vec2 texcoord) {return texture2D(s, texcoord);}
vec4 texCUBE(samplerCube s, vec3 texcoord) {return textureCube(s, texcoord);}

//////////////////
// Math Library //
//////////////////

const float PI = 3.141592653589793;
float TaylorInvSqrt(float x) {return 1.79284291400159 - 0.85373472095314*x;}
vec4 TaylorInvSqrt(vec4 x) {return 1.79284291400159 - 0.85373472095314*x;}
	
mat3 RotationEulerMatrix(vec3 rotRads)
{
	vec3 cos_r = cos(rotRads), sin_r = -sin(rotRads);
	return mat3(cos_r.y*cos_r.z, -sin_r.z*cos_r.x+cos_r.z*sin_r.y*sin_r.x, sin_r.x*sin_r.z+cos_r.z*sin_r.y*cos_r.x,
		        cos_r.y*sin_r.z, cos_r.z*cos_r.x+sin_r.y*sin_r.z*sin_r.x, -sin_r.x*cos_r.z+sin_r.x*sin_r.z*cos_r.x,
	           -sin_r.y,                  cos_r.y*sin_r.x,                         cos_r.y*cos_r.x);
}

	
float ExpSmoothMin(float a, float b, float k)
{
	float res = exp(-k*a)+exp(-k*b);
	return -log(res)/k;
}
	
float ExpSmoothMin(float a, float b)
{
	return ExpSmoothMin(a, b, 32.0);
}

float SmoothMin(float a, float b, float k)
{
	float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
	return mix(b, a, h)-k*h*(1.0-h);
}
	
float SmoothMin(float a, float b)
{
	return SmoothMin(a, b, 0.1);
}
	
float PowerSmoothMin(float a, float b, float k)
{
	a = pow(a, k);
	b = pow(b, k);
	return pow((a*b)/(a+b), 1.0/k);
}
	
float PowerSmoothMin(float a, float b)
{
	return PowerSmoothMin(a, b, 8.0);
}

float sigma(float x) {return x / (1.0 + abs(x));}
vec2 sigma(vec2 x) {return x / (1.0 + abs(x));}
vec3 sigma(vec3 x) {return x / (1.0 + abs(x));}
vec4 sigma(vec4 x) {return x / (1.0 + abs(x));}

float sqr(float x) {return x*x;}
vec2 sqr(vec2 x) {return x*x;}
vec3 sqr(vec3 x) {return x*x;}
vec4 sqr(vec4 x) {return x*x;}

float invsqr(float x) {return 1.0 / (1.0 + x*x);}
vec2 invsqr(vec2 x) {return 1.0 / (1.0 + x*x);}
vec3 invsqr(vec3 x) {return 1.0 / (1.0 + x*x);}
vec4 invsqr(vec4 x) {return 1.0 / (1.0 + x*x);}

float invsqr(float x, float add) {return 1.0 / (add + x*x);}
vec2 invsqr(vec2 x, float add) {return 1.0 / (add + x*x);}
vec2 invsqr(vec2 x, vec2 add) {return 1.0 / (add + x*x);}
vec3 invsqr(vec3 x, float add) {return 1.0 / (add + x*x);}
vec3 invsqr(vec3 x, vec3 add) {return 1.0 / (add + x*x);}
vec4 invsqr(vec4 x, float add) {return 1.0 / (add + x*x);}
vec4 invsqr(vec4 x, vec4 add) {return 1.0 / (add + x*x);}

float sinc(float x) {return x == 0.0? 1.0: sin(x) / x;}
vec2 sinc(vec2 x) {return mix(sin(x) / x, vec2(1.0), vec2(equal(x, vec2(0.0))));}
vec3 sinc(vec3 x) {return mix(sin(x) / x, vec3(1.0), vec3(equal(x, vec3(0.0))));}
vec4 sinc(vec4 x) {return mix(sin(x) / x, vec4(1.0), vec4(equal(x, vec4(0.0))));}

/////////////////////
// Packing Library //
/////////////////////

vec4 EncodeFloatAsRGBA8(float v)
{
	vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
	enc = fract(enc);
	enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
	return enc;
}

float DecodeFloatFromRGBA8(vec4 rgba8)
{
  return dot(rgba8, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/16581375.0));
}

vec2 EncodeFloatAsRG8(float v)
{
	vec2 enc = vec2(v, fract(v*255.0));
	enc.x -= enc.y / 255.0;
	return enc;
}

float DecodeFloatFromRG8(vec2 rg8)
{
  return dot(rg8, vec2(1.0, 1.0/255.0));
}

///////////////////////////////
// Geometry Distance Library //
///////////////////////////////

float SphereSignedDistance(vec3 point, float radius)
{
	return length(point) - radius;
}

float PlaneSignedDistance(vec3 point)
{
	return point.y;
}

float BoxSignedDistance(vec3 point, vec3 extents)
{
	vec3 d = abs(point)-extents;
	return clamp(max(d.y, d.z), d.x, 0.0)+length(max(d, 0.0));
}

float RoundBoxDistance(vec3 point, vec3 extents, float radius)
{
	return length(max(abs(point)-extents, 0.0))-radius;
}

float TorusSignedDistance(vec3 point, vec2 magMinRadius)
{
	return length(vec2(length(point.xz)-magMinRadius.x, point.y))-magMinRadius.y;
}

float HexPrismSignedDistance(vec3 point, vec2 h)
{
	vec3 q = abs(point);
	float d1 = q.z-h.y;
	float d2 = max((q.x*0.866025+q.y*0.5),q.y)-h.x;
	return length(max(vec2(d1, d2), 0.0))+clamp(d1, d2, 0.0);
}

float CapsuleSignedDistance(vec3 point, vec3 a, vec3 b, float radius)
{
	vec3 pa = point-a, ba = b-a;
	float h = saturate(dot(pa, ba)/dot(ba, ba));
	return length(pa-ba*h)-radius;
}

float TriPrismSignedDistance(vec3 point, vec2 h)
{
	vec3 q = abs(point);
	float d1 = q.z-h.y;
	float d2 = max(q.x*0.866025+point.y*0.5, -point.y) - h.x*0.5;
	return length(max(vec2(d1, d2), 0.0)) + clamp(d1, d2, 0.0);
}

float CylinderSignedDistance(vec3 point, vec2 h)
{
	vec2 d = abs(vec2(length(point.xz), point.y))-h;
	return clamp(d.x, d.y,0.0)+length(max(d, 0.0));
}


float ConeSignedDistance(vec3 point, vec3 c)
{
	vec2 q = vec2(length(point.xz), point.y);
	float d1 = -point.y - c.z;
	float d2 = max(dot(q, c.xy), point.y);
	return length(max(vec2(d1, d2), 0.0)) + clamp(d1, d2, 0.0);
}


///////////////////
// Noise Library //
///////////////////

float frand(vec2 seed)
{
	return fract(sin(dot(seed, vec2(12.9898, 78.233)))*43758.5453);
}

vec2 f2rand(vec2 seed)
{
	return vec2(frand(seed), frand(seed+vec2(1.2345, 0)));
}

vec3 f3rand(vec2 seed)
{
	return vec3(frand(seed), frand(seed+vec2(1.2345, 0)), frand(seed+vec2(0, 1.2345)));
}


//Вспомогательные функции
float permute(float x) {return mod((x*(17.0 + 39.0*x) + 1.0)*x, 289.0);}
vec3 permute(vec3 x) {return mod((x*(17.0 + 39.0*x) + 1.0)*x, 289.0);}
vec4 permute(vec4 x) {return mod((x*(17.0 + 39.0*x) + 1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0 - 15.0) + 10.0);}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0 - 15.0) + 10.0);}
vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0 - 15.0) + 10.0);}

// Classic Perlin noise in range [-1; 1]
float cnoise(vec2 P, vec2 rep)
{
	vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
	vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
	Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
	Pi = mod(Pi, 289.0);        // To avoid truncation effects in permutation
	vec4 ix = Pi.xzxz, iy = Pi.yyww, fx = Pf.xzxz, fy = Pf.yyww;
	vec4 i = permute(permute(ix)+iy);
	vec4 gx = 2.0*fract(i/41.0)-1.0, gy=abs(gx)-0.5;
	gx -= floor(gx+0.5);
		
	vec2 g00 = vec2(gx.x, gy.x), g10 = vec2(gx.y, gy.y), g01 = vec2(gx.z, gy.z), g11 = vec2(gx.w, gy.w);
	vec4 norm = 1.79284291400159 - 0.85373472095314*vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
	g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
		
	float n00 = dot(g00, vec2(fx.x, fy.x));
	float n10 = dot(g10, vec2(fx.y, fy.y));
	float n01 = dot(g01, vec2(fx.z, fy.z));
	float n11 = dot(g11, vec2(fx.w, fy.w));
	vec2 fade_xy = fade(Pf.xy);
	vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
	float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
	return 2.3*n_xy;
}

float cnoise(vec2 P) {return cnoise(P, vec2(289.0));}

float cnoise(vec3 P, vec3 rep)
{
	vec3 Pi0 = mod(floor(P), rep); // Integer part for indexing
	vec3 Pi1 = mod(Pi0+1.0, rep); // Integer part + 1
	Pi0 = mod(Pi0, 289.0);
	Pi1 = mod(Pi1, 289.0);
	vec3 Pf0 = fract(P); // Fractional part for interpolation
	vec3 Pf1 = Pf0-vec3(1.0); // Fractional part - 1.0
	vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
	vec4 iy = vec4(Pi0.yy, Pi1.yy);
	vec4 iz0 = Pi0.zzzz, iz1 = Pi1.zzzz;

	vec4 ixy = permute(permute(ix)+iy);
	vec4 ixy0 = permute(ixy+iz0);
	vec4 ixy1 = permute(ixy+iz1);

	vec4 gx0 = ixy0/7.0;
	vec4 gy0 = fract(floor(gx0)/7.0)-0.5;
	gx0 = fract(gx0);
	vec4 gz0 = vec4(0.5)-abs(gx0)-abs(gy0);
	vec4 sz0 = step(gz0, vec4(0.0));
	gx0 -= sz0*(step(0.0, gx0)-0.5); gy0-=sz0*(step(0.0, gy0)-0.5);

	vec4 gx1 = ixy1/7.0;
	vec4 gy1 = fract(floor(gx1)/7.0)-0.5;
	gx1 = fract(gx1);
	vec4 gz1 = vec4(0.5)-abs(gx1)-abs(gy1);
	vec4 sz1 = step(gz1, vec4(0.0));
	gx1 -= sz1*(step(0.0, gx1)-0.5);
	gy1 -= sz1*(step(0.0, gy1)-0.5);

	vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
	vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
	vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
	vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
	vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
	vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
	vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
	vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

	vec4 norm0 = TaylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
	g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
	vec4 norm1 = TaylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
	g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

	float n000 = dot(g000, Pf0);
	float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
	float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
	float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
	float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
	float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
	float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
	float n111=dot(g111, Pf1);

	vec3 fade_xyz = fade(Pf0);
	vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
	vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y); 
	return 2.2*mix(n_yz.x, n_yz.y, fade_xyz.x);
}

float cnoise(vec3 P) {return cnoise(P, vec3(289.0));}


float cnoise(vec4 P, vec4 rep)
{
	vec4 Pi0 = mod(floor(P), rep); // Integer part modulo rep
	vec4 Pi1 = mod(Pi0 + 1.0, rep); // Integer part + 1 mod rep
	Pi0 = mod(Pi0, 289.0);
	Pi1 = mod(Pi1, 289.0);
	vec4 Pf0 = fract(P); // Fractional part for interpolation
	vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
	vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
	vec4 iy = vec4(Pi0.yy, Pi1.yy);
	vec4 iz0 = vec4(Pi0.zzzz);
	vec4 iz1 = vec4(Pi1.zzzz);
	vec4 iw0 = vec4(Pi0.wwww);
	vec4 iw1 = vec4(Pi1.wwww);

	vec4 ixy = permute(permute(ix) + iy);
	vec4 ixy0 = permute(ixy + iz0);
	vec4 ixy1 = permute(ixy + iz1);
	vec4 ixy00 = permute(ixy0 + iw0);
	vec4 ixy01 = permute(ixy0 + iw1);
	vec4 ixy10 = permute(ixy1 + iw0);
	vec4 ixy11 = permute(ixy1 + iw1);

	vec4 gx00 = ixy00 * (1.0 / 7.0);
	vec4 gy00 = floor(gx00) * (1.0 / 7.0);
	vec4 gz00 = floor(gy00) * (1.0 / 6.0);
	gx00 = fract(gx00) - 0.5;
	gy00 = fract(gy00) - 0.5;
	gz00 = fract(gz00) - 0.5;
	vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
	vec4 sw00 = step(gw00, vec4(0.0));
	gx00 -= sw00 * (step(0.0, gx00) - 0.5);
	gy00 -= sw00 * (step(0.0, gy00) - 0.5);

	vec4 gx01 = ixy01 * (1.0 / 7.0);
	vec4 gy01 = floor(gx01) * (1.0 / 7.0);
	vec4 gz01 = floor(gy01) * (1.0 / 6.0);
	gx01 = fract(gx01) - 0.5;
	gy01 = fract(gy01) - 0.5;
	gz01 = fract(gz01) - 0.5;
	vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
	vec4 sw01 = step(gw01, vec4(0.0));
	gx01 -= sw01 * (step(0.0, gx01) - 0.5);
	gy01 -= sw01 * (step(0.0, gy01) - 0.5);

	vec4 gx10 = ixy10 * (1.0 / 7.0);
	vec4 gy10 = floor(gx10) * (1.0 / 7.0);
	vec4 gz10 = floor(gy10) * (1.0 / 6.0);
	gx10 = fract(gx10) - 0.5;
	gy10 = fract(gy10) - 0.5;
	gz10 = fract(gz10) - 0.5;
	vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
	vec4 sw10 = step(gw10, vec4(0.0));
	gx10 -= sw10 * (step(0.0, gx10) - 0.5);
	gy10 -= sw10 * (step(0.0, gy10) - 0.5);

	vec4 gx11 = ixy11 * (1.0 / 7.0);
	vec4 gy11 = floor(gx11) * (1.0 / 7.0);
	vec4 gz11 = floor(gy11) * (1.0 / 6.0);
	gx11 = fract(gx11) - 0.5;
	gy11 = fract(gy11) - 0.5;
	gz11 = fract(gz11) - 0.5;
	vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
	vec4 sw11 = step(gw11, vec4(0.0));
	gx11 -= sw11 * (step(0.0, gx11) - 0.5);
	gy11 -= sw11 * (step(0.0, gy11) - 0.5);

	vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
	vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
	vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
	vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
	vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
	vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
	vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
	vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
	vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
	vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
	vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
	vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
	vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
	vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
	vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
	vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

	vec4 norm00 = TaylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
	g0000 *= norm00.x;
	g0100 *= norm00.y;
	g1000 *= norm00.z;
	g1100 *= norm00.w;

	vec4 norm01 = TaylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
	g0001 *= norm01.x;
	g0101 *= norm01.y;
	g1001 *= norm01.z;
	g1101 *= norm01.w;

	vec4 norm10 = TaylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
	g0010 *= norm10.x;
	g0110 *= norm10.y;
	g1010 *= norm10.z;
	g1110 *= norm10.w;

	vec4 norm11 = TaylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
	g0011 *= norm11.x;
	g0111 *= norm11.y;
	g1011 *= norm11.z;
	g1111 *= norm11.w;

	float n0000 = dot(g0000, Pf0);
	float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
	float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
	float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
	float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
	float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
	float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
	float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
	float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
	float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
	float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
	float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
	float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
	float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
	float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
	float n1111 = dot(g1111, Pf1);

	vec4 fade_xyzw = fade(Pf0);
	vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
	vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
	vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
	vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
	float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
	return 2.2 * n_xyzw;
}

float cnoise(vec4 P) {return cnoise(P, vec4(289.0));}



// Perlin simplex noise in range [-1; 1]
float snoise(vec2 v)
{
	vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);

	vec2 i = floor(v+dot(v, C.yy));
	vec2 x0 = v-i+dot(i, C.xx);
	vec2 i1 = (x0.x>x0.y)? vec2(1.0, 0.0): vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy+C.xxzz; x12.xy-=i1;
		
	i = mod(i, 289.0);
	vec3 p = permute(permute(i.y+vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
	vec3 x = 2.0*fract(p*C.www)-1.0;
	vec3 a0 = x-floor(x+0.5);
	vec3 h = abs(x)-0.5;
	vec3 m = max(0.5-vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
	m *= m;
	m *= m*1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
	vec3 g = vec3(a0.x*x0.x + h.x*x0.y,   a0.yz*x12.xz + h.yz*x12.yw);
	return 130.0*dot(m, g);
}

float snoise(vec3 v)
{
	vec2 C = vec2(1.0/6.0, 1.0/3.0);
	vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

	vec3 i = floor(v+dot(v, C.yyy));
	vec3 x0 = v-i+dot(i, C.xxx);
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0-g;
	vec3 i1 = min(g.xyz, l.zxy);
	vec3 i2 = max(g.xyz, l.zxy);

	vec3 x1 = x0 -  i1 + 1.0*C.xxx;
	vec3 x2 = x0 -  i2 + 2.0*C.xxx;
	vec3 x3 = x0 - 1.0 + 3.0*C.xxx;
		
	i = mod(i, 289.0); 
	vec4 p = permute(permute(permute(i.z+vec4(0.0, i1.z, i2.z, 1.0))+i.y+vec4(0.0, i1.y, i2.y, 1.0))+i.x+vec4(0.0, i1.x, i2.x, 1.0));

	vec3 ns = D.wyz/7.0-D.xzx;

	vec4 j = p-49.0*floor(p*ns.z*ns.z);

	vec4 x_ = floor(j*ns.z), y_ = floor(j-7.0*x_);
		
	vec4 x = x_*ns.x+ns.y, y = y_*ns.x+ns.y;
	vec4 h = 1.0-abs(x)-abs(y);

	vec4 b0 = vec4(x.xy, y.xy), b1 = vec4(x.zw, y.zw);
	vec4 s0 = floor(b0)*2.0+1.0, s1 = floor(b1)*2.0+1.0, sh = -step(h, vec4(0.0));
	vec4 a0 = b0.xzyw+s0.xzyw*sh.xxyy;
	vec4 a1 = b1.xzyw+s1.xzyw*sh.zzww;
	vec3 p0 = vec3(a0.xy, h.x);
	vec3 p1 = vec3(a0.zw, h.y);
	vec3 p2 = vec3(a1.xy, h.z);
	vec3 p3 = vec3(a1.zw, h.w);

	vec4 norm = TaylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

	vec4 m = max(0.6-vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	m *= m;
	return 42.0*dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}


vec4 grad4(float j, vec4 ip)
{
	vec4 p;
	p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
	p.w = 1.5 - dot(abs(p.xyz), vec3(1.0));
	vec4 s = vec4(lessThan(p, vec4(0.0)));
	p.xyz += (s.xyz*2.0 - vec3(1.0)) * s.w; 
	return p;
}

float snoise(vec4 v)
{
	const vec4  C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);  // G4 = (5 - sqrt(5))/20, 2 * G4, 3 * G4, -1 + 4 * G4

	vec4 i  = floor(v + dot(v, vec4(0.309016994374947451)) );
	vec4 x0 = v -   i + dot(i, C.xxxx);

	vec4 i0;
	vec3 isX = step( x0.yzw, x0.xxx );
	vec3 isYZ = step( x0.zww, x0.yyz );
	
	i0.x = isX.x + isX.y + isX.z;
	i0.yzw = 1.0 - isX;
	
	i0.y += isYZ.x + isYZ.y;
	i0.zw += 1.0 - isYZ.xy;
	i0.z += isYZ.z;
	i0.w += 1.0 - isYZ.z;

	vec4 i3 = clamp( i0, 0.0, 1.0 );
	vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
	vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

	vec4 x1 = x0 - i1 + C.xxxx;
	vec4 x2 = x0 - i2 + C.yyyy;
	vec4 x3 = x0 - i3 + C.zzzz;
	vec4 x4 = x0 + C.wwww;

	i = mod(i, 289.0); 
	float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
	vec4 j1 = permute( permute( permute( permute (
				 i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
			 + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
			 + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
			 + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

	vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

	vec4 p0 = grad4(j0,   ip);
	vec4 p1 = grad4(j1.x, ip);
	vec4 p2 = grad4(j1.y, ip);
	vec4 p3 = grad4(j1.z, ip);
	vec4 p4 = grad4(j1.w, ip);

	vec4 norm = TaylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	p4 *= TaylorInvSqrt(dot(p4,p4));

	vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
	vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
	m0 = m0*m0;
	m1 = m1*m1;
	return 49.0 * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)))
				 + dot(m1*m1, vec2(dot(p3, x3), dot(p4, x4))));
}


vec2 cellular(vec2 P, vec2 rep, float jitter)
{
	vec2 Pi = mod(floor(P), 289.0), Pf = fract(P);
	vec3 oi = vec3(-1.0, 0.0, 1.0), of = vec3(-0.5, 0.5, 1.5);
	vec3 px = permute(mod(Pi.x+oi, rep.xxx));
		
	vec3 d[3];
	for(int i=0; i<3; i++)
	{
		vec3 p = permute(px[i]+mod(Pi.y+oi, rep.yyy));
		vec3 ox = fract(p/7.0)-3.0/7.0;
		vec3 oy = (mod(floor(p/7.0), 7.0)-3.0)/7.0;
		vec3 dx = Pf.x-of[i]+jitter*ox;
		vec3 dy = Pf.y-of+jitter*oy;
		d[i] = dx*dx + dy*dy;
	}
		
	// Sort out the two smallest distances (F1, F2)
	vec3 d1a = min(d[0], d[1]);
	d[1] = min(max(d[0], d[1]), d[2]); // Swap to keep candidates for F2. neither F1 nor F2 are now in d3
	d[0] = min(d1a, d[1]); // F1 is now in d1
	d[1] = max(d1a, d[1]); // Swap to keep candidates for F2
	d[0].xy = (d[0].x<d[0].y)? d[0].xy: d[0].yx; // Swap if smaller
	d[0].xz = (d[0].x<d[0].z)? d[0].xz: d[0].zx; // F1 is in d1.x
	d[0].yz = min(d[0].yz, d[1].yz); // F2 is now not in d2.yz
	d[0].y = min(min(d[0].y, d[0].z), d[1].x); // nor in  d1.z. F2 is in d1.y, we're done.
	return sqrt(d[0].xy);
}

vec2 cellular(vec2 P, vec2 rep) {return cellular(P, rep, 1.0);}

vec2 cellular(vec2 P) {return cellular(P, vec2(289.0));}

vec2 cellular(vec3 P, vec3 rep, float jitter)
{
	vec3 oi = vec3(-1.0, 0.0, 1.0);

	vec3 Pi = mod(floor(P), 289.0), Pf = fract(P)-0.5;
	vec3 Pfx = Pf.x-oi, Pfy = Pf.y-oi, Pfz = Pf.z-oi;
	vec3 p = permute(mod(Pi.x+oi, rep));
		
	vec3 ds[9];
	for(int i=0; i<3; i++)
	{
		vec3 p0 = permute(p+mod(Pi.y-1.0+float(i), rep.y))+Pi.z-1.0;
		for(int j=0; j<3; j++)
		{
			vec3 per = permute(p0+vec3(j));
			vec3 ox = fract(per/7.0)-3.0/7.0;
			vec3 oy = mod(floor(per/7.0), 7.0)/7.0-3.0/7.0;
			vec3 oz = floor(per/49.0)/6.0-5.0/12.0;
			vec3 dx = Pfx+jitter*ox;
			vec3 dy = Pfy[i]+jitter*oy;
			vec3 dz = Pfz[j]+jitter*oz;
			ds[i*3+j] = dx*dx + dy*dy+dz*dz;
		}
	}

	vec3 d1a = min(ds[0], ds[1]);
	ds[1] = max(ds[0], ds[1]);
	ds[0] = min(d1a, ds[2]);
	ds[2] = max(d1a, ds[2]);
	ds[1] = min(ds[1], ds[2]);
		
	vec3 d2a = min(ds[3], ds[4]);
	ds[4] = max(ds[3], ds[4]);
	ds[3] = min(d2a, ds[5]);
	ds[5] = max(d2a, ds[5]);
	ds[4] = min(ds[4], ds[5]);
		
	vec3 d3a = min(ds[6], ds[7]);
	ds[7] = max(ds[6], ds[7]);
	ds[6] = min(d3a, ds[8]);
	ds[8] = max(d3a, ds[8]);
	ds[7] = min(ds[7], ds[8]);
		
	vec3 da = min(ds[0], ds[3]);
	ds[3] = max(ds[0], ds[3]);
	ds[0] = min(da, ds[6]);
	ds[6] = max(da, ds[6]);
		
	ds[0].xy = (ds[0].x<ds[0].y)? ds[0].xy: ds[0].yx;
	ds[0].xz = (ds[0].x<ds[0].z)? ds[0].xz: ds[0].zx;
	for(int i=3; i<8; i++) ds[1] = min(ds[1], ds[i]);
	ds[0].yz = min(ds[0].yz, ds[1].xy);
	ds[0].y = min(min(ds[0].y, ds[1].z), ds[0].z);
	return sqrt(ds[0].xy);
}

vec2 cellular(vec3 P, vec3 rep) {return cellular(P, rep, 1.0);}
vec2 cellular(vec3 P) {return cellular(P, vec3(289.0));}

vec2 grad2(vec2 p, float rot)
{
	float u = fract(permute(permute(p.x)+p.y)/41.0+rot); // Rotate by shift
#if 1
	// Map from a line to a diamond such that a shift maps to a rotation.
	u = 4.0*u-2.0;
	return vec2(abs(u)-1.0, abs(abs(u + 1.0) - 2.0) - 1.0);
#else
	// For more isotropic gradients, sin/cos can be used instead.
	u *= 2.0*PI;
	return vec2(cos(u), sin(u));
#endif
}

float srdnoise(vec2 P, float rot, out vec2 grad)
{
	float F2 = 0.366025403, G2 = 0.211324865;
	vec2 Pi = floor(P+dot(P, vec2(F2)));  // Transform input point to the skewed simplex grid. Round down to simplex origin

	// Transform simplex origin back to (x,y) system
	vec2 P0 = Pi-dot(Pi, vec2(G2));

	// Find (x,y) offsets from simplex origin to first corner
	vec2 v0 = P-P0;
	vec2 i1 = step(v0.yx, v0);  // Pick (+x, +y) or (+y, +x) increment sequence
	vec2 v1 = v0-i1+G2, v2 = v0-1.0+2.0*G2;  // Determine the offsets for the other two corners

	// Wrap coordinates at 289 to avoid float precision problems
	Pi = mod(Pi, 289.0);

	// Calculate the circularly symmetric part of each noise wiggle
	vec3 t = max(0.5-vec3(dot(v0,v0), dot(v1,v1), dot(v2,v2)), 0.0);
	vec3 t2 = t*t, t4 = t2*t2;

	// Calculate the gradients for the three corners
	vec2 g0 = grad2(Pi, rot), g1 = grad2(Pi+i1, rot), g2 = grad2(Pi+1.0, rot);

	  
	vec3 gv = vec3(dot(g0,v0), dot(g1,v1), dot(g2,v2)); // Compute noise contributions from each corner// ramp: g dot v

	// Compute partial derivatives in x and y
	vec3 gradx = t2*t*gv, grady = gradx;
	gradx *= vec3(v0.x, v1.x, v2.x);
	grady *= vec3(v0.y, v1.y, v2.y);
	grad = -8.0*vec2(dot(gradx, vec3(1.0)), dot(grady, vec3(1.0)));
	grad += vec2(dot(t4, vec3(g0.x, g1.x, g2.x)), dot(t4, vec3(g0.y, g1.y, g2.y)));
	grad *= 40.0;

	return 40.0*dot(t4*gv, vec3(1.0));  // Add contributions from the three corners and return
}

	
	
float FloatHash(float n) {return fract(sin(n)*43758.5453123);}
	
float FloatHash(vec2 v)
{
	float h = dot(v, vec2(127.1, 311.7));
	return 2.0*fract(sin(h)*43758.5453123)-1.0;
}
	
vec2 Vec2Hash(vec2 v)
{
	vec2 h = vec2(dot(v, vec2(127.1, 311.7)), dot(v, vec2(269.5, 183.3)));
	return 2.0*fract(sin(h)*43758.5453123)-vec2(1.0);
}
	
vec3 Vec3Hash(vec2 v)
{
	vec3 h = vec3(dot(v, vec2(127.1, 311.7)), dot(v, vec2(269.5,183.3)), dot(v, vec2(419.2, 371.9)));
	return fract(sin(h)*43758.5453);
}

float ValueNoise2D(vec2 v)
{
	vec2 i=floor(v), f=fract(v), u=f*f*(3.0-2.0*f);
	const vec3 offset=vec3(-1.0, 0.0, 1.0);
	return mix(mix(FloatHash(i), FloatHash(i+offset.zy), u.x),
		   mix(FloatHash(i+offset.yz), FloatHash(i+offset.zz), u.x),  u.y);
}
	
float ValueNoise3D(vec3 v)
{
	vec3 i = floor(v), f = fract(v), u = f*f*(3.0-2.0*f);
	float c = i.x + i.y*157.0 + i.z*113.0;
	return mix(mix(mix(FloatHash(c), FloatHash(c+1.0), u.x), mix(FloatHash(c+157.0), FloatHash(c+158.0), u.x), u.y),
		   mix(mix(FloatHash(c+113.0), FloatHash(c+114.0), u.x), mix(FloatHash(c+270.0), FloatHash(c+271.0), u.x), u.y), u.z);
}

float ValueNoise3D(vec3 v, sampler2D noiseTex, vec2 noiseTex_PixelSize)
{
	vec3 i = floor(v), f = fract(v), u = f*f*(3.0-2.0*f);
	vec2 uv = (i.xy+vec2(37.0, 17.0)*i.z) + u.xy;
	vec2 rg = texture(noiseTex, (uv+vec2(0.5))*noiseTex_PixelSize).gr;
	return mix(rg.x, rg.y, u.z);
}
	
float GradientNoise(vec2 v)
{
	vec2 i = floor(v), f = fract(v), u = f*f*(3.0-2.0*f);
	const vec3 offset = vec3(-1.0, 0.0, 1.0);
	return mix(mix(dot(Vec2Hash(i), f), dot(Vec2Hash(i+offset.zy), f-offset.zy), u.x),
	       mix(dot(Vec2Hash(i+offset.yz), f-offset.yz), dot(Vec2Hash(i+offset.zz), f-offset.zz), u.x), u.y);
}
	

vec2 SmoothVoronoi(vec2 v, float smoothness)
{
	vec2 i = floor(v), f = fract(v);
	vec2 result  =vec2(8.0, 0.0);
	for(int j=-2; j<=2; j++)
		for(int k=-2; k<=2; k++)
		{
			vec2 g = vec2(float(k), float(j));	
			float d = length(g-f+Vec2Hash(i+g));
			float y = 0.5 + 0.5*sin( FloatHash(dot(i+g, vec2(75.583, 1513.54))) );
			float h = smoothstep(-1.0, 1.0, (result.x-d)/smoothness);
			result = mix(result, vec2(d, y), h) - vec2(h*(1.0-h)*smoothness/(1.0+3.0*smoothness));
		}
	return result;
}
	
	
//cell noise   gridControl=0, metricControl=0
//voronoi      gridControl=1, metricControl=0
//perlin noise gridControl=0, metricControl=1
//voronoise    gridControl=1, metricControl=1
float Voronoise(vec2 x, float gridControl, float metricControl)
{
	vec2 p = floor(x), f = fract(x);
	float k = 1.0+63.0*pow(1.0-metricControl, 4.0);
	float va = 0.0, wt = 0.0;
	for(int j=-2; j<=1; j++)
	for(int i=-2; i<=1; i++)
	{
		vec2 g = vec2(float(i), float(j));
		vec3 o = Vec3Hash(p+g)*vec3(gridControl, gridControl, 1.0);
		vec2 r = g-f+o.xy+0.5;
		float d = dot(r, r);
		float ww = pow(1.0-smoothstep(0.0, 1.414, sqrt(d)), k);
		va += o.z*ww;
		wt += ww;
	}
		
	return va/wt;
}
	

//Несколько октав шума Перлина с указанным уровнем низких (coeffLow) и высоких (gainHigh) частот.
//Соответствует PerlinOctaves при coeffLow = 1 и gainHigh = gain
float PerlinOctavesSpectrum(vec2 coord, vec2 period, int octaves, float coeffLow, float gainHigh, float lacunarity, vec2 offset)
{
	float sum = 0.0, g = 1.0, l = 1.0, normalizer = 0.0, kL = max(0.001, coeffLow);
	for(int i=0; i<15; i++)
	{
		if(i == octaves) break;
		vec2 rm = period*l;
		float k = g*kL;
		sum += k*cnoise(coord*l + offset, rm);
		normalizer += k;
		l *= lacunarity;
		g *= gainHigh;
		kL = pow(kL, 0.6);
	}
	return sum / normalizer;
}

float PerlinOctavesSpectrum(vec2 coord, vec2 period, int octaves, float coeffLow, float gainHigh, float lacunarity)
{return PerlinOctavesSpectrum(coord, period, octaves, coeffLow, gainHigh, lacunarity, vec2(0.0));}

float PerlinOctavesSpectrum(vec2 coord, vec2 period, int octaves, float coeffLow, float gainHigh)
{return PerlinOctavesSpectrum(coord, period, octaves, coeffLow, gainHigh, 2.0);}

//Несколько октав шума Перлина.
float PerlinOctaves(vec2 coord, vec2 period, int octaves, float gain, float lacunarity, vec2 offset)
{
	float sum = 0.0, g = 1.0, l = 1.0, normalizer = 0.0;
	for(int i=0; i<15; i++)
	{
		if(i == octaves) break;
		vec2 rm = period*l;
		sum += cnoise(coord*l + offset, rm)*g;
		normalizer += g;
		l *= lacunarity;
		g *= gain;
	}
	return sum / normalizer;
}

float PerlinOctaves(vec2 coord, vec2 period, int octaves, float gain, float lacunarity)
{return PerlinOctaves(coord, period, octaves, gain, lacunarity, vec2(0.0));}

float PerlinOctaves(vec2 coord, vec2 period, int octaves, float gain)
{return PerlinOctaves(coord, period, octaves, gain, 2.0);}

float PerlinOctaves(vec2 coord, vec2 period, int octaves)
{return PerlinOctaves(coord, period, octaves, 0.5);}

float PerlinOctaves(vec2 coord, vec2 period, int octaves, float gain, vec2 offset)
{return PerlinOctaves(coord, period, octaves, gain, 2.0, offset);}

float PerlinOctaves(vec2 coord, vec2 period, int octaves, vec2 offset)
{return PerlinOctaves(coord, period, octaves, 0.5, 2.0, offset);}

float PerlinOctaves(vec3 coord, vec3 period, int octaves, float gain, float lacunarity, vec3 offset)
{
	float sum = 0.0, g = 1.0, l = 1.0, normalizer = 0.0;
	for(int i=0; i<15; i++)
	{
		if(i == octaves) break;
		vec3 rm = period*l;
		sum += cnoise(coord*l + offset, rm)*g;
		normalizer += g;
		l *= lacunarity;
		g *= gain;
	}
	return sum / normalizer;
}

float PerlinOctaves(vec3 coord, vec3 period, int octaves, float gain, float lacunarity)
{return PerlinOctaves(coord, period, octaves, gain, lacunarity, vec3(0.0));}

float PerlinOctaves(vec3 coord, vec3 period, int octaves, float gain)
{return PerlinOctaves(coord, period, octaves, gain, 2.0);}

float PerlinOctaves(vec3 coord, vec3 period, int octaves)
{return PerlinOctaves(coord, period, octaves, 0.5);}

float PerlinOctaves(vec4 coord, vec4 period, int octaves, float gain, float lacunarity, vec4 offset)
{
	float sum = 0.0, g = 1.0, l = 1.0, normalizer = 0.0;
	for(int i=0; i<15; i++)
	{
		if(i == octaves) break;
		vec4 rm = period*l;
		sum += cnoise(coord*l + offset, rm)*g;
		normalizer += g;
		l *= lacunarity;
		g *= gain;
	}
	return sum / normalizer;
}

float PerlinOctaves(vec4 coord, vec4 period, int octaves, float gain, float lacunarity)
{return PerlinOctaves(coord, period, octaves, gain, lacunarity, vec4(0.0));}

float PerlinOctaves(vec4 coord, vec4 period, int octaves, float gain)
{return PerlinOctaves(coord, period, octaves, gain, 2.0);}

float PerlinOctaves(vec4 coord, vec4 period, int octaves)
{return PerlinOctaves(coord, period, octaves, 0.5);}


//Несколько октав шума Перлина, две выборки:
//X - для координат coord и периода period,
//Y - для координат coord*2 и периода period*2.
vec2 PerlinOctavesX2(vec2 coord, vec2 period, int octaves, float gain, float lacunarity, vec2 offset)
{
	vec2 tc = coord;
    vec2 per = period;
    vec2 sum = vec2(cnoise(tc + offset, per), 0.0);
    float g = 1.0;
	float normalizer = 1.0;
    for(int i=1; i<15; i++)
    {
		if(i == octaves) break;
        tc *= lacunarity;
        per *= lacunarity;
        float n = cnoise(tc + offset, per);
        sum.y += n*g;
        g *= gain;
        sum.x += n*g;
		normalizer += g;
    }
	return sum / normalizer;
}

vec2 PerlinOctavesX2(vec2 coord, vec2 period, int octaves, float gain, float lacunarity)
{return PerlinOctavesX2(coord, period, octaves, gain, lacunarity, vec2(0.0));}

vec2 PerlinOctavesX2(vec2 coord, vec2 period, int octaves, float gain)
{return PerlinOctavesX2(coord, period, octaves, gain, 2.0);}

vec2 PerlinOctavesX2(vec2 coord, vec2 period, int octaves)
{return PerlinOctavesX2(coord, period, octaves, 0.5);}

////////////////////////
// Colorspace Library //
////////////////////////

vec3 RGB2HSV(vec3 c)
{
	vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x-min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z+(q.w - q.y) / (6.0*d + e)), d/(q.x + e), q.x);
}

vec3 HSV2RGB(vec3 c)
{
	vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
	vec3 p = abs(fract(c.x + K.xyz)*6.0 - K.w);
	return c.z*mix(K.xxx, clamp(p - K.x, 0.0, 1.0), c.y);
}

vec3 RGB2YUV(vec3 rgb)
{
	return vec3(
		dot(rgb, vec3(0.25, 0.5, 0.25)),
		dot(rgb, vec3(0.0, -0.5, 0.5)),
		dot(rgb, vec3(0.5, -0.5, 0.0))
	);
}

vec3 YUV2RGB(vec3 yuv)
{
	return vec3(
		dot(yuv, vec3(1.0, -0.5, 1.5)),
		dot(yuv, vec3(1.0, -0.5, -0.5)),
		dot(yuv, vec3(1.0, 1.5,-0.5))
	);
}
	
	
//it is best to convert the colors from linear to gamma space before encoding.
//If you plan to use them again in linear a simple additional sqrt and square will work fine for encoding and decoding respectively.
//The constant 6 gives a range in linear space of 51.5.
vec4 RGB2RGBM(vec3 color)
{
	vec4 rgbm;
	rgbm.rgb = color*0.166667;
	rgbm.a = saturate(max(max(rgbm.r, rgbm.g), rgbm.b));
	rgbm.a = ceil(rgbm.a*255.0)/255.0;
	rgbm.rgb /= rgbm.a;
	return rgbm;
}

vec3 RGBM2RGB(vec4 rgbm)
{
	return 6.0*rgbm.rgb*rgbm.a;
}

float Linear2SRGB(float x) {return min(12.92*x, 1.055*pow(x, 1.0/2.4) - 0.055);}
vec2 Linear2SRGB(vec2 x) {return min(12.92*x, 1.055*pow(x, vec2(1.0/2.4)) - vec2(0.055));}
vec3 Linear2SRGB(vec3 x) {return min(12.92*x, 1.055*pow(x, vec3(1.0/2.4)) - vec3(0.055));}
vec4 Linear2SRGB(vec4 x) {return min(12.92*x, 1.055*pow(x, vec4(1.0/2.4)) - vec4(0.055));}

float SRGB2Linear(float x) {return max(x/12.92, pow((x + 0.055)/1.055, 2.4));}
vec2 SRGB2Linear(vec2 x) {return max(x/12.92, pow((x + vec2(0.055))/1.055, vec2(2.4)));}
vec3 SRGB2Linear(vec3 x) {return max(x/12.92, pow((x + vec3(0.055))/1.055, vec3(2.4)));}
vec4 SRGB2Linear(vec4 x) {return max(x/12.92, pow((x + vec4(0.055))/1.055, vec4(2.4)));}

///////////////////////////
// Normal Height Library //
///////////////////////////

vec3 NormalFromHeights(float center, float right, float bottom, float scale)
{
	return normalize(vec3(center-right, center-bottom, 1.0/scale));
}

#if(__VERSION__ > 100)
vec3 NormalFromHeightMap(sampler2D hmap, int component, vec2 pos, float scale, vec2 pixelSize)
{
	float center = texture(hmap, pos)[component];
#if(__VERSION__ >= 130)
	float right = textureOffset(hmap, pos, ivec2(1,0))[component];
	float bottom = textureOffset(hmap, pos, ivec2(0,1))[component];
#else
	float right = texture(hmap, pos+vec2(pixelSize.x, 0.0))[component];
	float bottom = texture(hmap, pos+vec2(0.0, pixelSize.y))[component];
#endif
	return NormalFromHeights(center, right, bottom, scale);
}
#endif

vec3 NormalFromHeightMapR(sampler2D hmap, vec2 pos, float scale, vec2 pixelSize)
{
	float center = texture(hmap, pos).r;
#if(__VERSION__ >= 130)
	float right = textureOffset(hmap, pos, ivec2(1,0)).r;
	float bottom = textureOffset(hmap, pos, ivec2(0,1)).r;
#else
	float right = texture(hmap, pos+vec2(pixelSize.x, 0.0)).r;
	float bottom = texture(hmap, pos+vec2(0.0, pixelSize.y)).r;
#endif
	return NormalFromHeights(center, right, bottom, scale);
}

vec3 NormalFromHeightMapG(sampler2D hmap, vec2 pos, float scale, vec2 pixelSize)
{
	float center = texture(hmap, pos).g;
#if(__VERSION__ >= 130)
	float right = textureOffset(hmap, pos, ivec2(1,0)).g;
	float bottom = textureOffset(hmap, pos, ivec2(0,1)).g;
#else
	float right = texture(hmap, pos+vec2(pixelSize.x, 0.0)).g;
	float bottom = texture(hmap, pos+vec2(0.0, pixelSize.y)).g;
#endif
	return NormalFromHeights(center, right, bottom, scale);
}

vec3 NormalFromHeightMapB(sampler2D hmap, vec2 pos, float scale, vec2 pixelSize)
{
	float center = texture(hmap, pos).b;
#if(__VERSION__ >= 130)
	float right = textureOffset(hmap, pos, ivec2(1,0)).b;
	float bottom = textureOffset(hmap, pos, ivec2(0,1)).b;
#else
	float right = texture(hmap, pos+vec2(pixelSize.x, 0.0)).b;
	float bottom = texture(hmap, pos+vec2(0.0, pixelSize.y)).b;
#endif
	return NormalFromHeights(center, right, bottom, scale);
}

vec3 NormalFromHeightMapA(sampler2D hmap, vec2 pos, float scale, vec2 pixelSize)
{
	float center = texture(hmap, pos).a;
#if(__VERSION__ >= 130)
	float right = textureOffset(hmap, pos, ivec2(1,0)).a;
	float bottom = textureOffset(hmap, pos, ivec2(0,1)).a;
#else
	float right = texture(hmap, pos+vec2(pixelSize.x, 0.0)).a;
	float bottom = texture(hmap, pos+vec2(0.0, pixelSize.y)).a;
#endif
	return NormalFromHeights(center, right, bottom, scale);
}

#if(__VERSION__ > 100)
void Gather8AdjacentTexels(sampler2D tex, int component, vec2 pos, vec2 texelSize, out vec4 top, out vec4 bottom)
{
#if(__VERSION__ >= 130)
	const ivec2 topOffsets[4] = ivec2[4](ivec2(-1,0), ivec2(-1,-1), ivec2(0,-1), ivec2(1,-1)); //{left, topLeft, top, topRight}
	const ivec2 bottomOffsets[4] = ivec2[4](ivec2(-1,1), ivec2(0,1), ivec2(1,1), ivec2(1,0)); //{bottomLeft, bottom, bottomRight, right}
#endif
#if(__VERSION__ >= 400)
	//Будет тормозить, если component не константа времени компиляции
	if(component == 0)
	{
		top = textureGatherOffsets(tex, pos, topOffsets, 0);
		bottom = textureGatherOffsets(tex, pos, bottomOffsets, 0);
	}
	if(component == 1)
	{
		top = textureGatherOffsets(tex, pos, topOffsets, 1);
		bottom = textureGatherOffsets(tex, pos, bottomOffsets, 1);
	}
	if(component == 2)
	{
		top = textureGatherOffsets(tex, pos, topOffsets, 2);
		bottom = textureGatherOffsets(tex, pos, bottomOffsets, 2);
	}
	if(component == 3)
	{
		top = textureGatherOffsets(tex, pos, topOffsets, 3);
		bottom = textureGatherOffsets(tex, pos, bottomOffsets, 3);
	}
#elif(__VERSION__ >= 130)
	top.x = textureOffset(tex, pos, topOffsets[0])[component];
	top.y = textureOffset(tex, pos, topOffsets[1])[component];
	top.z = textureOffset(tex, pos, topOffsets[2])[component];
	top.w = textureOffset(tex, pos, topOffsets[3])[component];
		
	bottom.x = textureOffset(tex, pos, bottomOffsets[0])[component];
	bottom.y = textureOffset(tex, pos, bottomOffsets[1])[component];
	bottom.z = textureOffset(tex, pos, bottomOffsets[2])[component];
	bottom.w = textureOffset(tex, pos, bottomOffsets[3])[component];
#else
	top.x = texture(tex, pos-vec2(texelSize.x, 0.0))[component];
	top.y = texture(tex, pos-texelSize)[component];
	top.z = texture(tex, pos-vec2(0.0, texelSize.y))[component];
	top.w = texture(tex, pos+vec2(texelSize.x, -texelSize.y))[component];

	bottom.x = texture(tex, pos+vec2(-texelSize.x, texelSize.y))[component];
	bottom.y = texture(tex, pos+vec2(0.0, texelSize.y))[component];
	bottom.z = texture(tex, pos+texelSize)[component];
	bottom.w = texture(tex, pos+vec2(texelSize.x, 0.0))[component];
#endif
}
#endif

void Gather8AdjacentTexelsR(sampler2D tex, vec2 pos, vec2 texelSize, out vec4 top, out vec4 bottom)
{
#if(__VERSION__ >= 130)
	const ivec2 topOffsets[4] = ivec2[4](ivec2(-1,0), ivec2(-1,-1), ivec2(0,-1), ivec2(1,-1)); //{left, topLeft, top, topRight}
	const ivec2 bottomOffsets[4] = ivec2[4](ivec2(-1,1), ivec2(0,1), ivec2(1,1), ivec2(1,0)); //{bottomLeft, bottom, bottomRight, right}
#endif
#if(__VERSION__ >= 400)
	top = textureGatherOffsets(tex, pos, topOffsets, 0);
	bottom = textureGatherOffsets(tex, pos, bottomOffsets, 0);
#elif(__VERSION__ >= 130)
	top.x = textureOffset(tex, pos, topOffsets[0]).r;
	top.y = textureOffset(tex, pos, topOffsets[1]).r;
	top.z = textureOffset(tex, pos, topOffsets[2]).r;
	top.w = textureOffset(tex, pos, topOffsets[3]).r;
		
	bottom.x = textureOffset(tex, pos, bottomOffsets[0]).r;
	bottom.y = textureOffset(tex, pos, bottomOffsets[1]).r;
	bottom.z = textureOffset(tex, pos, bottomOffsets[2]).r;
	bottom.w = textureOffset(tex, pos, bottomOffsets[3]).r;
#else
	top.x = texture(tex, pos-vec2(texelSize.x, 0.0)).r;
	top.y = texture(tex, pos-texelSize).r;
	top.z = texture(tex, pos-vec2(0.0, texelSize.y)).r;
	top.w = texture(tex, pos+vec2(texelSize.x, -texelSize.y)).r;

	bottom.x = texture(tex, pos+vec2(-texelSize.x, texelSize.y)).r;
	bottom.y = texture(tex, pos+vec2(0.0, texelSize.y)).r;
	bottom.z = texture(tex, pos+texelSize).r;
	bottom.w = texture(tex, pos+vec2(texelSize.x, 0.0)).r;
#endif
}

void Gather8AdjacentTexelsG(sampler2D tex, vec2 pos, vec2 texelSize, out vec4 top, out vec4 bottom)
{
#if(__VERSION__ >= 130)
	const ivec2 topOffsets[4] = ivec2[4](ivec2(-1,0), ivec2(-1,-1), ivec2(0,-1), ivec2(1,-1)); //{left, topLeft, top, topRight}
	const ivec2 bottomOffsets[4] = ivec2[4](ivec2(-1,1), ivec2(0,1), ivec2(1,1), ivec2(1,0)); //{bottomLeft, bottom, bottomRight, right}
#endif
#if(__VERSION__ >= 400)
	top = textureGatherOffsets(tex, pos, topOffsets, 1);
	bottom = textureGatherOffsets(tex, pos, bottomOffsets, 1);
#elif(__VERSION__ >= 130)
	top.x = textureOffset(tex, pos, topOffsets[0]).g;
	top.y = textureOffset(tex, pos, topOffsets[1]).g;
	top.z = textureOffset(tex, pos, topOffsets[2]).g;
	top.w = textureOffset(tex, pos, topOffsets[3]).g;
	
	bottom.x = textureOffset(tex, pos, bottomOffsets[0]).g;
	bottom.y = textureOffset(tex, pos, bottomOffsets[1]).g;
	bottom.z = textureOffset(tex, pos, bottomOffsets[2]).g;
	bottom.w = textureOffset(tex, pos, bottomOffsets[3]).g;
#else
	top.x = texture(tex, pos-vec2(texelSize.x, 0.0)).g;
	top.y = texture(tex, pos-texelSize).g;
	top.z = texture(tex, pos-vec2(0.0, texelSize.y)).g;
	top.w = texture(tex, pos+vec2(texelSize.x, -texelSize.y)).g;

	bottom.x = texture(tex, pos+vec2(-texelSize.x, texelSize.y)).g;
	bottom.y = texture(tex, pos+vec2(0.0, texelSize.y)).g;
	bottom.z = texture(tex, pos+texelSize).g;
	bottom.w = texture(tex, pos+vec2(texelSize.x, 0.0)).g;
#endif
}

void Gather8AdjacentTexelsB(sampler2D tex, vec2 pos, vec2 texelSize, out vec4 top, out vec4 bottom)
{
#if(__VERSION__ >= 130)
	const ivec2 topOffsets[4] = ivec2[4](ivec2(-1,0), ivec2(-1,-1), ivec2(0,-1), ivec2(1,-1)); //{left, topLeft, top, topRight}
	const ivec2 bottomOffsets[4] = ivec2[4](ivec2(-1,1), ivec2(0,1), ivec2(1,1), ivec2(1,0)); //{bottomLeft, bottom, bottomRight, right}
#endif
#if(__VERSION__ >= 400)
	top = textureGatherOffsets(tex, pos, topOffsets, 2);
	bottom = textureGatherOffsets(tex, pos, bottomOffsets, 2);
#elif(__VERSION__ >= 130)
	top.x = textureOffset(tex, pos, topOffsets[0]).b;
	top.y = textureOffset(tex, pos, topOffsets[1]).b;
	top.z = textureOffset(tex, pos, topOffsets[2]).b;
	top.w = textureOffset(tex, pos, topOffsets[3]).b;
	
	bottom.x = textureOffset(tex, pos, bottomOffsets[0]).b;
	bottom.y = textureOffset(tex, pos, bottomOffsets[1]).b;
	bottom.z = textureOffset(tex, pos, bottomOffsets[2]).b;
	bottom.w = textureOffset(tex, pos, bottomOffsets[3]).b;
#else
	top.x = texture(tex, pos-vec2(texelSize.x, 0.0)).b;
	top.y = texture(tex, pos-texelSize).b;
	top.z = texture(tex, pos-vec2(0.0, texelSize.y)).b;
	top.w = texture(tex, pos+vec2(texelSize.x, -texelSize.y)).b;

	bottom.x = texture(tex, pos+vec2(-texelSize.x, texelSize.y)).b;
	bottom.y = texture(tex, pos+vec2(0.0, texelSize.y)).b;
	bottom.z = texture(tex, pos+texelSize).b;
	bottom.w = texture(tex, pos+vec2(texelSize.x, 0.0)).b;
#endif
}

void Gather8AdjacentTexelsA(sampler2D tex, vec2 pos, vec2 texelSize, out vec4 top, out vec4 bottom)
{
#if(__VERSION__ >= 130)
	const ivec2 topOffsets[4] = ivec2[4](ivec2(-1,0), ivec2(-1,-1), ivec2(0,-1), ivec2(1,-1)); //{left, topLeft, top, topRight}
	const ivec2 bottomOffsets[4] = ivec2[4](ivec2(-1,1), ivec2(0,1), ivec2(1,1), ivec2(1,0)); //{bottomLeft, bottom, bottomRight, right}
#endif
#if(__VERSION__ >= 400)
	top = textureGatherOffsets(tex, pos, topOffsets, 3);
	bottom = textureGatherOffsets(tex, pos, bottomOffsets, 3);
#elif(__VERSION__ >= 130)
	top.x = textureOffset(tex, pos, topOffsets[0]).a;
	top.y = textureOffset(tex, pos, topOffsets[1]).a;
	top.z = textureOffset(tex, pos, topOffsets[2]).a;
	top.w = textureOffset(tex, pos, topOffsets[3]).a;
	
	bottom.x = textureOffset(tex, pos, bottomOffsets[0]).a;
	bottom.y = textureOffset(tex, pos, bottomOffsets[1]).a;
	bottom.z = textureOffset(tex, pos, bottomOffsets[2]).a;
	bottom.w = textureOffset(tex, pos, bottomOffsets[3]).a;
#else
	top.x = texture(tex, pos-vec2(texelSize.x, 0.0)).a;
	top.y = texture(tex, pos-texelSize).a;
	top.z = texture(tex, pos-vec2(0.0, texelSize.y)).a;
	top.w = texture(tex, pos+vec2(texelSize.x, -texelSize.y)).a;

	bottom.x = texture(tex, pos+vec2(-texelSize.x, texelSize.y)).a;
	bottom.y = texture(tex, pos+vec2(0.0, texelSize.y)).a;
	bottom.z = texture(tex, pos+texelSize).a;
	bottom.w = texture(tex, pos+vec2(texelSize.x, 0.0)).a;
#endif
}

#if(__VERSION__ > 100)
vec3 NormalFromHeightMapSobel3(sampler2D hmap, int component, vec2 pos, float scale, vec2 texelSize)
{
	vec4 top, bottom;
	Gather8AdjacentTexels(hmap, component, pos, texelSize, top, bottom);
	
	float dX = dot(bottom.xzw, vec3(1.0, -1.0, -2.0)) + dot(top.xyw, vec3(2.0, 1.0, -1.0));
	float dY = dot(bottom.xyz, vec3(-1.0, -2.0, -1.0)) + dot(top.yzw, vec3(1.0, 2.0, 1.0));
	
	return normalize(vec3(dX, dY, 8.0/scale));
}
#endif

vec3 NormalFromHeightMapSobel3R(sampler2D hmap, vec2 pos, float scale, vec2 texelSize)
{
	vec4 top, bottom;
	Gather8AdjacentTexelsR(hmap, pos, texelSize, top, bottom);
	
	float dX = dot(bottom.xzw, vec3(1.0, -1.0, -2.0)) + dot(top.xyw, vec3(2.0, 1.0, -1.0));
	float dY = dot(bottom.xyz, vec3(-1.0, -2.0, -1.0)) + dot(top.yzw, vec3(1.0, 2.0, 1.0));
	
	return normalize(vec3(dX, dY, 8.0/scale));
}

vec3 NormalFromHeightMapSobel3G(sampler2D hmap, vec2 pos, float scale, vec2 texelSize)
{
	vec4 top, bottom;
	Gather8AdjacentTexelsG(hmap, pos, texelSize, top, bottom);
	
	float dX = dot(bottom.xzw, vec3(1.0, -1.0, -2.0)) + dot(top.xyw, vec3(2.0, 1.0, -1.0));
	float dY = dot(bottom.xyz, vec3(-1.0, -2.0, -1.0)) + dot(top.yzw, vec3(1.0, 2.0, 1.0));
	
	return normalize(vec3(dX, dY, 8.0/scale));
}

vec3 NormalFromHeightMapSobel3B(sampler2D hmap, vec2 pos, float scale, vec2 texelSize)
{
	vec4 top, bottom;
	Gather8AdjacentTexelsB(hmap, pos, texelSize, top, bottom);
	
	float dX = dot(bottom.xzw, vec3(1.0, -1.0, -2.0)) + dot(top.xyw, vec3(2.0, 1.0, -1.0));
	float dY = dot(bottom.xyz, vec3(-1.0, -2.0, -1.0)) + dot(top.yzw, vec3(1.0, 2.0, 1.0));
	
	return normalize(vec3(dX, dY, 8.0/scale));
}

vec3 NormalFromHeightMapSobel3A(sampler2D hmap, vec2 pos, float scale, vec2 texelSize)
{
	vec4 top, bottom;
	Gather8AdjacentTexelsA(hmap, pos, texelSize, top, bottom);
	
	float dX = dot(bottom.xzw, vec3(1.0, -1.0, -2.0)) + dot(top.xyw, vec3(2.0, 1.0, -1.0));
	float dY = dot(bottom.xyz, vec3(-1.0, -2.0, -1.0)) + dot(top.yzw, vec3(1.0, 2.0, 1.0));
	
	return normalize(vec3(dX, dY, 8.0/scale));
}


//////////////////////////
// Image Filter Library //
//////////////////////////

vec4 ConvolutionFilter3(sampler2D s, vec2 pos, vec2 st, float kernel[9])
{
	vec4 sum = vec4(0.0);
	for(int i=0; i<3; i++)
		for(int j=0; j<3; j++)
			sum += texture(s, pos-st*(vec2(i, j)-vec2(1.5)))*kernel[j*3+i];
	return sum;
}

vec4 ConvolutionFilter5(sampler2D s, vec2 pos, vec2 st, float kernel[25])
{
	vec4 sum = vec4(0.0);
	for(int i=0; i<5; i++)
		for(int j=0; j<5; j++)
			sum += texture(s, pos-st*(vec2(i, j)-vec2(2.5)))*kernel[j*5+i];
	return sum;
}

vec4 ConvolutionFilter7(sampler2D s, vec2 pos, vec2 st, float kernel[49])
{
	vec4 sum = vec4(0.0);
	for(int i=0; i<7; i++)
		for(int j=0; j<7; j++)
			sum += texture(s, pos-st*(vec2(i, j)-vec2(3.5)))*kernel[j*7+i];
	return sum;
}

vec4 EdgeDetect(sampler2D s, vec2 pos, vec2 texelSize)
{
	//Можно реализовать через 2 вызова ConvolutionFilter3, но так должно быть быстрее
#if(__VERSION__ >= 130)
	vec4 lt = textureOffset(s, pos, ivec2(-1)),   t = textureOffset(s, pos, ivec2(0,-1)), rt = textureOffset(s, pos, ivec2(1,-1));
	vec4 l  = textureOffset(s, pos, ivec2(-1,0)),                                         r  = textureOffset(s, pos, ivec2(1,0));
	vec4 lb = textureOffset(s, pos, ivec2(-1,1)), b = textureOffset(s, pos, ivec2(0,1)),  rb = textureOffset(s, pos, ivec2(1));
#else
	vec2 dx = vec2(texelSize.x, 0.0), dy = vec2(0.0, texelSize.y);
	vec4 lt = texture(s, pos-texelSize),   t = texture(s, pos-dy), rt = texture(s, pos+dx-dy);
	vec4 l = texture(s, pos-dx),                                    r = texture(s, pos+dx);
	vec4 lb = texture(s, pos-dx+dy),       b = texture(s, pos+dy), rb = texture(s, pos+texelSize);
#endif
	vec4 c1 = rt - lt - 2.0*l + 2.0*r - lb + rb;
	vec4 c2 = lt + 2.0*t + rt - lb - 2.0*b - rb;
	return sqrt(c1*c1 + c2*c2);
}

#if(__VERSION__ > 100)
//Одномерное box-размытие с указанным радиусом r
//dir - задаёт направление размытия, а длина этого вектора должна соответствовать одному пикселю текстуры
//r задаётся относительно размеров текстуры, где 1 - размер текстуры
vec4 BoxBlur(sampler2D s, vec2 center, float r, vec2 dir)
{
	vec4 sum = vec4(0.0);
	float rn = r/length(dir);
	for(float i=-rn; i<=rn; i++)
		sum += texture(s, center+i*dir);
	return sum/rn*0.5;
}

//Одномерное размытие с указанным радиусом r и квадратичным затуханием веса.
//dir - задаёт направление размытия, а длина этого вектора должна соответствовать одному пикселю текстуры
//r задаётся относительно размеров текстуры, где 1 - размер текстуры
vec4 Blur(sampler2D s, vec2 center, float r, vec2 dir)
{
	vec4 sum = vec4(0.0);
	float rn = r/length(dir), rn2=rn*rn;
	for(float i=-rn; i<=rn; i++)
		sum += texture(s, center+i*dir)*(rn2-i*i);
	return sum*0.75/(rn2*rn);
}
#endif

//Быстрое одномерное размытие по Гауссу с радиусом в 4 пикселя.
//s - семплер размываемой текстуры, должна быть включена линейная фильтрация.
//dir - задаёт направление размытия, а длина этого вектора должна соответствовать одному пикселю текстуры
vec4 GaussianBlur9(sampler2D s, vec2 center, vec2 dir)
{
	vec3 offsets = vec3(0.0, 1.3846153846, 3.2307692308);
	vec3 weights = vec3(0.2270270270, 0.3162162162, 0.0702702703);
		
	vec4 result = texture(s, center)*weights[0];
	result += (texture(s, center + dir*offsets[1]) + texture(s, center - dir*offsets[1]))*weights[1];
	result += (texture(s, center + dir*offsets[2]) + texture(s, center - dir*offsets[2]))*weights[2];

	return result;
}
	
//Быстрое одномерное размытие по Гауссу с радиусом в 8 пикселей.
//s - семплер размываемой текстуры, должна быть включена линейная фильтрация.
//dir - задаёт направление размытия, а длина этого вектора должна соответствовать одному пикселю текстуры
vec4 GaussianBlur17(sampler2D s, vec2 center, vec2 dir)
{
	const float delta12 = 1.47175000005626555738802;
	const float delta34 = 3.434393508192996678578332;
	const float delta56 = 5.397767704947418234690868;
	const float delta78 = 7.362252175267215830091963;

	const float weight12 = 0.20362918680120718530192;
	const float weight34 = 0.14065598692095833201701;
	const float weight56 = 0.07225946090479444807592;
	const float weight78 = 0.02760507923140416158563;
	const float weight0  = 0.1117005722832717460391;
		
	vec4 sum = texture(s, center)*weight0;
	sum += (texture(s, center - dir*delta12 ) + texture(s, center + dir*delta12 ))*weight12;
	sum += (texture(s, center - dir*delta34 ) + texture(s, center + dir*delta34 ))*weight34;
	sum += (texture(s, center - dir*delta56 ) + texture(s, center + dir*delta56 ))*weight56;
	sum += (texture(s, center - dir*delta78 ) + texture(s, center + dir*delta78 ))*weight78;

	return sum;
}

vec4 NoiseBlur(sampler2D s, vec2 center, float blurAmount)
{
	const float tolerance = 0.2, vignetteSize = 0.5;
	vec2 powers = abs(center - vec2(0.5));
	powers *= powers;
	float radiusSqrd = vignetteSize*vignetteSize;
	float gradient = smoothstep(radiusSqrd-tolerance, radiusSqrd+tolerance, powers.x+powers.y);

	// [OPT] Early exit
	if(gradient < 0.07) return texture(s, center);
	
	vec2 noise = f2rand(center);
	float bg = blurAmount*gradient*0.004;
	vec4 XY1_XY2 = vec4(center + bg*noise, center - bg*noise);
	vec4 inv_XY1_XY2 = vec4(center + (vec2(1.0)-noise)*bg*0.5, center - (vec2(1.0)-noise)*bg*0.5);

	vec4 col = texture(s, XY1_XY2.xy);
	col += texture(s, XY1_XY2.zw);
	col += texture(s, XY1_XY2.xw);
	col += texture(s, XY1_XY2.zy);
	col *= 0.1;

	col += texture(s, inv_XY1_XY2.xy)*0.15;
	col += texture(s, inv_XY1_XY2.zw)*0.15;
	col += texture(s, inv_XY1_XY2.xw)*0.15;
	col += texture(s, inv_XY1_XY2.zy)*0.15;

	return col;
}
	

//Модуль градиента текстуры в точке pos
vec4 DiffFree(sampler2D s, vec2 pos, vec2 pixSize)
{
#if(__VERSION__ >= 130)
	vec4 dUdX = (textureOffset(s, pos, ivec2(1,0)) - textureOffset(s, pos, ivec2(-1,0)))/pixSize.x;
	vec4 dUdY = (textureOffset(s, pos, ivec2(0,1)) - textureOffset(s, pos, ivec2(0,-1)))/pixSize.y;
#else
	vec4 dUdX = (texture(s, pos+vec2(pixSize.x, 0.0)) - texture(s, pos-vec2(pixSize.x, 0.0)))/pixSize.x;
	vec4 dUdY = (texture(s, pos+vec2(0.0, pixSize.y)) - texture(s, pos-vec2(0.0, pixSize.y)))/pixSize.y;
#endif
	return sqrt(dUdX*dUdX + dUdY*dUdY)*0.5;
}

//Модуль градиента текстуры в точке pos.
//Предполагается, что текстура в формате RGBA8 и в неё упакованы 2 числа в диапазоне [0; 1] с точностью 16 бит.
vec2 DiffFreePacked2(sampler2D s, vec2 pos, vec2 pixSize)
{
#if(__VERSION__ >= 130)
	vec4 dUdX = (textureOffset(s, pos, ivec2(1,0)) - textureOffset(s, pos, ivec2(-1,0)))/pixSize.x;
	vec4 dUdY = (textureOffset(s, pos, ivec2(0,1)) - textureOffset(s, pos, ivec2(0,-1)))/pixSize.y;
#else
	vec4 dUdX = (texture(s, pos+vec2(pixSize.x, 0.0)) - texture(s, pos-vec2(pixSize.x, 0.0)))/pixSize.x;
	vec4 dUdY = (texture(s, pos+vec2(0.0, pixSize.y)) - texture(s, pos-vec2(0.0, pixSize.y)))/pixSize.y;
#endif
	dUdX.x = DecodeFloatFromRG8(dUdX.xy);
	dUdX.y = DecodeFloatFromRG8(dUdX.zw);
	dUdY.x = DecodeFloatFromRG8(dUdY.xy);
	dUdY.y = DecodeFloatFromRG8(dUdY.zw);
	return sqrt(dUdX.xy*dUdX.xy + dUdY.xy*dUdY.xy)*0.5;
}

//Модуль градиента модуля градиента текстуры в точке pos.
vec4 Diff2Free(sampler2D s, vec2 pos, vec2 pixSize)
{
	vec4 diff = DiffFree(TexA, pos, pixSize);
    vec4 diffX = DiffFree(TexA, pos+vec2(pixSize.x, 0.0), pixSize);
    vec4 diffY = DiffFree(TexA, pos+vec2(0.0, pixSize.y), pixSize);
    return sqrt(sqr(diffX - diff) + sqr(diffY - diff));
}

//Модуль градиента модуля градиента текстуры в точке pos.
//Предполагается, что текстура в формате RGBA8 и в неё упакованы 2 числа в диапазоне [0; 1] с точностью 16 бит.
vec2 Diff2FreePacked2(sampler2D s, vec2 pos, vec2 pixSize)
{
	vec2 diff = DiffFreePacked2(TexA, pos, pixSize);
    vec2 diffX = DiffFreePacked2(TexA, pos+vec2(pixSize.x, 0.0), pixSize);
    vec2 diffY = DiffFreePacked2(TexA, pos+vec2(0.0, pixSize.y), pixSize);
    return sqrt(sqr(diffX - diff) + sqr(diffY - diff));
}

////////////////////////////
// Texture Sample Library //
////////////////////////////

vec4 textureBicubic(sampler2D tex, vec2 texcoord, vec2 texelSize)
{
	vec2 tc = texcoord/texelSize;
	vec2 f = fract(tc);
	tc = floor(tc);

	vec2 f2 = f*f, f3 = f2*f;
	vec4 cubic[2];
	for(int i=0; i<2; i++)
	{
		cubic[i].x = -f3[i] + 3.0*f2[i] - 3.0*f[i] + 1.0;
		cubic[i].y = 3.0*f3[i] - 6.0*f2[i] + 4.0;
		cubic[i].z = -3.0*f3[i] + 3.0*f2[i] + 3.0*f[i] + 1.0;
		cubic[i].w = f3[i];
		cubic[i] *= 1.0/6.0;
	}

	vec4 c = vec4(tc.x-0.5, tc.x+1.5, tc.y-0.5, tc.y+1.5);
	vec4 s = vec4(cubic[0].xz + cubic[0].yw, cubic[1].xz + cubic[1].yw);
	vec4 offset = c+vec4(cubic[0].yw, cubic[1].yw)/s;

	vec4 sample0 = texture(tex, offset.xz*texelSize);
	vec4 sample1 = texture(tex, offset.yz*texelSize);
	vec4 sample2 = texture(tex, offset.xw*texelSize);
	vec4 sample3 = texture(tex, offset.yw*texelSize);

	vec2 ss = s.xz/(s.xz + s.yw);
	return mix(mix(sample3, sample2, ss.x), mix(sample1, sample0, ss.x), ss.y);
}

vec4 textureSmooth(sampler2D tex, vec2 texcoord, vec2 texelSize)
{
	vec2 uv = texcoord/texelSize + vec2(0.5);
	vec2 iuv = floor(uv), fuv = fract(uv);
	uv = iuv + fuv*fuv*(3.0 - 2.0*fuv); // fuv*fuv*fuv*(fuv*(fuv*6.0-15.0)+10.0);
	uv = (uv - 0.5)*texelSize;
	return texture2D(tex, uv);
}


/////////////////////////
// Pattern Gen Library //
/////////////////////////

float GenBricks(vec2 pos, ivec2 count, vec2 dist, float scrollX)
{
	vec2 brickSize = 1.0/vec2(count);
	vec2 newPos = pos-vec2(brickSize.x*scrollX*floor(pos.y/brickSize.y), 0.0);
	vec2 inBrick = step(dist*vec2(count), fract(newPos*vec2(count)));
	return inBrick.x*inBrick.y*(1.0+frand(floor(newPos*vec2(count))));
}

void HexGrid(out vec4 o, vec2 TexCoord)
{
	vec2 q = vec2(TexCoord.x*2.0*0.5773503, TexCoord.y + TexCoord.x*0.5773503);
	vec2 i = floor(q), f = fract(q);

	float v = mod(i.x+i.y, 3.0);
	float ca = step(1.0, v), cb = step(2.0, v);
	vec2 ma = step(f, f.yx);
		
	vec4 o1 = vec4(i+ca-cb*ma, 0.0, 0.0);
	o = 0.5+0.5*sin(o1);
}
