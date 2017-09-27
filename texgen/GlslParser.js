function IsLatinCharCode(c) {return c >= 65 && c <= 90 || c >= 97 && c <= 122;}
function IsDigitCharCode(c) {return c >= 48 && c <= 57;}
function IsSpaceCharCode(c) {return c == 9 || c == 10 || c == 13 || c == 32;}
function IsSeparatorCharCode(c) {return !IsLatinCharCode(c) && !IsDigitCharCode(c) && c != 95;}

function Tokenizer(code)
{
	var curTokenStart = 0, curTokenEnd = 0;
	
	this.Code = function() {return code;};
	
	this.Position = function() {return curTokenEnd;}
	
	//Перейти к первому непробельному символу. На выходе токен будет содержать все пропущенные символы.
	this.ConsumeSpaces = function()
	{
		curTokenStart = curTokenEnd;
		while(curTokenEnd < code.length && IsSpaceCode(code.charCodeAt(curTokenEnd))) ++curTokenEnd;
	};
	
	//Пропустить однострочный комментарий, перейдя к началу следующей строки.
	//На выходе токен будет содержать содержимое строки комментария без дополнительных / и с переносом строки
	this.ConsumeSingleLineComment = function()
	{
		while(code.charCodeAt(curTokenEnd++) == '/');
		curTokenStart = curTokenEnd;
		while(curTokenEnd != code.length)
		{
			var c = code.charCodeAt(curTokenEnd++);
			if(c == 10) return;
			if(c != 13) continue;
			if(code.charCodeAt(curTokenEnd) == 10) ++curTokenEnd;
			break;
		}
	};
	
	//Пропустить многострочный комментарий, перейдя к началу следующей строки. Предполагает, что комментарий уже начат, то есть "/*" уже прочитано.
	//На выходе токен будет содержать все пропущенные символы, то есть содержимое всего комментария вместе с закрывающим "*/"
	this.ConsumeMultiLineComment = function()
	{
		curTokenStart = curTokenEnd;
		var index = code.indexOf("*/", curTokenEnd);
		if(index === -1)
		{
			console.log("Неожиданный конец файла");
			curTokenEnd = code.length;
			return;
		}
		curTokenEnd = index + 2;
	};
	
	this.ConsumeWord = function()
	{
		curTokenStart = curTokenEnd;
		while(!IsSeparatorCharCode(code.charCodeAt(curTokenEnd))) ++curTokenEnd;
	};
	
	this.ConsumeToken = function()
	{
		this.ConsumeSpaces();
		if(curTokenEnd == code.length) return;
		var c = code.charCodeAt(curTokenEnd);
		if(c == 47)
		{
			var c2 = code.charCodeAt(++curTokenEnd);
			if(c2 == 47)
			{
				this.ConsumeSingleLineComment();
				return this.ConsumeSingleLineComment;
			}
			if(c2 == 42)
			{
				this.ConsumeMultiLineComment();
				return this.ConsumeMultiLineComment;
			}
			return;
		}
		this.ConsumeWord();
		return this.ConsumeWord;
	};
	
	this.LastTokenString = function()
	{
		return this.Code.substring(this.CurTokenStart, this.CurTokenEnd);
	},
	
	this.FindClosingBracket = function(closing, opening, counter)
	{
		if(counter === undefined) counter = 1;
		while(counter)
		{
			var tokType = this.ConsumeToken();
			if(tokType === this.ConsumeSingleLineComment || tokType === this.ConsumeMultiLineComment) continue;
			var curTok = this.LastTokenString();
			if(curTok === opening)
			{
				counter++;
				continue;
			}
			if(curTok === closing)
			{
				counter--;
				continue;
			}
		}
	}
};

//Возвращает структуру вида
//{"<name>" : [{"type": "vec3", "args": ["type" : "arg1", ...], "body": "function implementation code", "doc": "Comments before declaration"}, ...], ...}
function ParseCDeclarations(code)
{
	var decls = {};
	var parser = new Tokenizer(code);
	var curDoc = "";
	for(;;)
	{
		
	}
}
