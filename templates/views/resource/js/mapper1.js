/**
 * Created by admin on 2018/8/29.
 */
// canvas的设备内容用来显示area的边框和形状
var hdcStroke,hdcFill;


function byId(e){return document.getElementById(e);}


//根据area的坐标绘制边框或者填充形状,drawStyle=fill时候填充
function drawPoly(coOrdStr,hdc,drawStyle)
{
    var mCoords = coOrdStr.split(',');
    var i, n;
    n = mCoords.length;

    hdc.beginPath();
    hdc.moveTo(mCoords[0], mCoords[1]);
    for (i=2; i<n; i+=2)
    {
        hdc.lineTo(mCoords[i], mCoords[i+1]);
    }
    hdc.lineTo(mCoords[0], mCoords[1]);
    if(drawStyle=='fill'){
        hdc.fill();
    }else{
        hdc.stroke();
    }

}


function mouseHover(event)
{
    var element = event.target;
//            var hoveredElement = element;
    var coordStr = element.getAttribute('coords');

    drawPoly(coordStr,hdcStroke);
}

function mouseClick(event){
    var element = event.target;
    var coordStr = element.getAttribute('coords');
    var areaType = element.getAttribute('shape');
    var canvas2 = byId('myCanvas');
    clearCanvas(canvas2,hdcFill);
    drawPoly(coordStr,hdcFill,'fill');
}

function mouseLeave()
{
    var canvas = byId('myCanvas');
    clearCanvas(canvas,hdcStroke);
}

function  clearCanvas(can,hdc){
    hdc.clearRect(0,0,can.width,can.height);
}

function myInit(id)
{
    // 获取到image元素
    var img = byId(id);
    var x,y, w,h;

    // 获取坐标和长宽
    x = img.offsetLeft;
    y = img.offsetTop;
    w = img.clientWidth;
    h = img.clientHeight;

    // 把canvas移动到image上
    var imgParent = img.parentNode;
    var can = byId('myCanvas');
    var can2 = byId('myCanvas2');
    imgParent.appendChild(can);
    imgParent.appendChild(can2);

    // canvas放到image上面
    can.style.zIndex = 1;
    can2.style.zIndex = 2;
    can.style.left = can2.style.left = x+'px';
    can.style.top = can2.style.top = y+'px';

    // canvas尺寸
    can.setAttribute('width', w+'px');
    can.setAttribute('height', h+'px');
    can2.setAttribute('width', w+'px');
    can2.setAttribute('height', h+'px');

    // canvas内容
    hdcStroke = can.getContext('2d');
    hdcFill = can2.getContext('2d');
    // 设置设备内容的style
    hdcStroke.fillStyle = 'red';
    hdcStroke.strokeStyle = 'red';
    hdcStroke.lineWidth = 2;
    hdcFill.fillStyle = 'rgba(0,0,225,0.5)';
}

window.onload = function(){

    myInit('provinceMap');
    for(var i=1;i<12;i++){
        var curMap = byId('map_' + i);
        curMap.onmouseover = mouseHover;
        curMap.onmouseout = mouseLeave;
        curMap.onclick = mouseClick;
    }

};