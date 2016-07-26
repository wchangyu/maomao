/**
 * Created by went on 2016/5/9.
 */
//建立命名空间
var Went = Went || {};
Went.utility = Went.utility || {};

//生成任意命名空间的方法
Went.utility.namespace = function(ns){
    var parts = ns.split('.');
    window[parts[0]] = window[parts[0]] || {};
    var current = window[parts[0]];
    for(var i=1;i<parts.length;i++){
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
    }
}


Went.utility.deepCopy = function(p,c){
    c = c || {};
    for(var i in p){
        if(p.hasOwnProperty(i)){
            if(typeof p[i] === "object"){
                c[i] = Array.isArray(p[i]) ? [] : {};
                Went.utility.deepCopy(p[i],c[i]);
            }else{
                c[i] = p[i];
            }
        }
    }
    return c;
}



/**
 *@WEncode(String,String) SrcString,Key
 *@WDecode(String,String) SrcString,Key
 */
Went.utility.wCoder = (function () {
    var _cypherOrg = [
        95, 225, 56, 72, 216, 115, 149, 164, 247, 2, 6, 10, 30, 34, 102, 170,
        229, 52, 92, 228, 55, 89, 235, 38, 106, 190, 217, 112, 144, 171, 230, 49,
        1, 3, 5, 15, 17, 51, 85, 255, 26, 46, 114, 150, 161, 248, 19, 53,
        83, 245, 4, 12, 20, 60, 68, 204, 79, 209, 104, 184, 211, 110, 178, 205,
        159, 186, 213, 100, 172, 239, 42, 126, 130, 157, 188, 223, 122, 142, 137, 128,
        181, 196, 87, 249, 16, 48, 80, 240, 11, 29, 39, 105, 187, 214, 97, 163,
        254, 25, 43, 125, 135, 146, 173, 236, 47, 113, 147, 174, 233, 32, 96, 160,
        251, 22, 58, 78, 210, 109, 183, 194, 93, 231, 50, 86, 250, 21, 63, 65,
        195, 94, 226, 61, 71, 201, 64, 192, 91, 237, 44, 116, 156, 191, 218, 117,
        18, 54, 90, 238, 41, 123, 141, 140, 143, 138, 133, 148, 167, 242, 13, 23,
        76, 212, 103, 169, 224, 59, 77, 215, 98, 166, 241, 8, 24, 40, 120, 136,
        155, 182, 193, 88, 232, 35, 101, 175, 234, 37, 111, 177, 200, 67, 197, 84,
        252, 31, 33, 99, 165, 244, 7, 9, 27, 45, 119, 153, 176, 203, 70, 202,
        131, 158, 185, 208, 107, 189, 220, 127, 129, 152, 179, 206, 73, 219, 118, 154,
        69, 207, 74, 222, 121, 139, 134, 145, 168, 227, 62, 66, 198, 81, 243, 14,
        57, 75, 221, 124, 132, 151, 162, 253, 28, 36, 108, 180, 199, 82, 246, 1
    ];

    var _setCypher = function (c) {
        if (c !== undefined) {
            _cypherOrg = new Array(256);
            var cs = c.split(",");
            if (cs.length > 0) {
                for (var i = 0; i < cs.length && i < 256; i++) {
                    _cypherOrg[i] = cs[i] * 1;
                }
            }
        }
    }

    var _getCypher = function () {
        return _cypherOrg.join(",");
    }

    //获取到加密的Org
    function getCypher(sKey) {
        var cypherClone = _cypherOrg.slice(0);       //克隆数组
        if (sKey === undefined) {
            sKey = "";
        }
        var i, j,switchIndex,tmp;
        for ( i = 0; i < sKey.length; i++) {
            for ( j = 0; j < cypherClone.length; j++) {
                switchIndex = ((sKey[i] + i) * cypherClone[j]) % 255;
                if (switchIndex != j) {
                    tmp = cypherClone[j];
                    cypherClone[j] = cypherClone[switchIndex];
                    cypherClone[switchIndex] = tmp;
                }
            }
        }
        return cypherClone;
    }

    function byteToHexString(src) {
        var sb = [];
        var iCur, i;
        var val;
        for (i = 0; i < src.length; i++) {
            //var val = src.charCodeAt(i).toString(16);
            iCur = src[i] & 0xFF;
            val = iCur.toString(16);
            if (val.length == 1)
                val = "0" + val;
            sb.push(val);
        }
        return sb.join("").toUpperCase();
    }

    function hexToByte(src) {
        src = src.toUpperCase();
        var length = src.length / 2;
        var hexA = [];
        var pos = 0;
        var i, v;
        var s;
        for (i = 0; i < length; i++) {
            s = src.substr(pos, 2);
            v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    }

    function charToByte(c) {
        return "01234567890ABCDEF".indexOf(c);
    }

    function getUTF8BytesArray(s) {
        var utf8 = unescape(encodeURIComponent(s));
        var arr = new Array(utf8.length);
        var i;
        for (i = 0; i < utf8.length; i++) {
            arr[i] = utf8.charCodeAt(i);
        }
        return arr;
    }

    function getStringFromUTF8BytesArray(arr) {
        var s = "";
        var i;
        for (i = 0; i < arr.length; i++) {
            s += String.fromCharCode(arr[i]);
        }
        s = decodeURIComponent(escape(s));
        return s;
    }

    wEncode = function (srcString, sKey, cypher) {
        if (srcString === undefined) return undefined;
        _setCypher(cypher);
        var cCypher = getCypher(sKey);
        var iIndex = 0;
        var Buff = getUTF8BytesArray(srcString);
        while (iIndex < Buff.length) {
            Buff[iIndex] ^= cCypher[iIndex % 255];
            iIndex++;
        }
        return byteToHexString(Buff);
    }

    wDecode = function (srcString, sKey, cypher) {
        if (srcString === undefined) return undefined;
        var strPwd = "";
        var iIndex = 0;
        var Buff;
        var cCypher;
        if (sKey === undefined) sKey = "";
        try{
            Buff = hexToByte(srcString);
            _setCypher(cypher);
            cCypher = getCypher(sKey);
            while (iIndex < Buff.length) {
                Buff[iIndex] ^= cCypher[iIndex % 255];
                iIndex++;
            }
            strPwd = getStringFromUTF8BytesArray(Buff);
        }
        catch(e){
        }
        return strPwd;
    }



    return {
        wEncode: wEncode,
        wDecode: wDecode
    };

})();

