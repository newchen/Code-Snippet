/** 
通过 Object.prototype.toString.call() 进行类型判断

    首先看一段ECMA中对Object.prototype.toString的解释：
    Object.prototype.toString( )
    When the toString method is called, the following steps are taken://当toString方法被调用，将执行下面步骤
        1. Get the [[Class]] property of this object.//获取对象的类名（对象类型）
        2. Compute a string value by concatenating the three strings “[object “, Result (1), and “]”.//将[object、获取的类名]组合
        3. Return Result (2)//将第2步的结果返回

    我们知道，Javascript中，一切皆为对象。所以如下代码，应当会输出对应字符：
        var tostring = Object.prototype.toString;  
        console.log(tostring.call([123]));//[object Array] 
        console.log(tostring.call('123'));//[object String] 
        console.log(tostring.call({a: '123'}));//[object Object] 
        console.log(tostring.call(/123/));//[object RegExp] 
        console.log(tostring.call(123));//[object Number] 
        console.log(tostring.call(undefined));//[object Undefined] 
        console.log(tostring.call(null));//[object Null] 

    标准浏览器中完美的作到，但是（为什么要说但是呢）IE中，却会出现以下问题：
        IE6 通过Object.prototype.toString.call获取的 字符串,undefined,null均为Object
        IE7 8通过Object.prototype.toString.call获取的 undefined,null均为Object

    所以，我们又要悲剧的先对以上类型进行判断，完整代码：
*/
;(function() {
    //判断数据的类型
    this.typeOf = function(value) {
        var typeBasic = typeof value,//判断basic中的类型
            basic = {
                "undefined" : "undefined",
                "string" : "string",
                "number": "number",
                "boolean": "boolean"
            },
            typeReference = Object.prototype.toString.call(value),//判断reference中的类型
            reference = {
                "[object Boolean]": "boolean",
                "[object Number]": "number",
                "[object Array]": "array",
                "[object Date]": "date",
                "[object Function]": "function",
                "[object RegExp]": "regexp",
                "[object HTMLBodyElement]": "element",//IE9及标准浏览器
                "[object Object]": {
                    "element": "element",//IE7 8
                    "object": "object"
                },
                //IE7 8下无法判断[object Undefined]和[object Null]，据说IE6还不支持[object String]
                "[object String]": "string",
                "[object Undefined]": "undefined",
                "[object Null]": "null"
            },
            other = ["null","unknow"];//其它类型

        if (null === value) {
            return other[0];
        }

        if (basic.hasOwnProperty(typeBasic)) {//这种判断方式比：if(typeBasic in basic) 好一些       
            return typeBasic;
        }

        if(reference.hasOwnProperty(typeReference)) {//这种判断方式比：if(typeReference in reference) 好一些 
            if(typeReference === "[object Object]") {
                if(value.nodeType) 
                    return reference[typeReference]["element"];
                else
                    return reference[typeReference]["object"];
            }
            return reference[typeReference];
        }
        
        return other[1];
    }

})();
