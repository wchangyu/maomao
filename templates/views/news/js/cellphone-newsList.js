/**
 * Created by admin on 2018/7/30.
 */
$(function(){

    //获取登陆信息
    getLoginMessage ();

    _url = sessionStorage.getItem('apiUrlPrefix');

    //获取新闻列表
    conditionSelect();

    //新闻跳转
    $('.news-list-container').on('click','li',function(){

        //获取当前跳转地址
        var jumpUrl = $(this).find('.left-title a').attr('href');

        window.location.href = jumpUrl;
    });

});

var thisUrl = window.location.search;

var _url = "";

//游泳馆id
var eprName = '';

//获取用户权限
var userRole = thisUrl.split('Type=')[1].split('&')[0];

//后台搜素接口名称
var searchUrl = "";

//新闻类型
var type = 9;

//用户名
var _userIdName = '';

//游泳馆id
var fkid = '';

var html = '<img class="title-img" style="width: 100%"/>';

$('.head-title').html(html);

$('.head-title').css('cssText','padding:0 !important;');

//管理员
if(userRole == '1' || userRole == '2'|| userRole == '3'){

    searchUrl = 'HBYYG/GetNewsContentByType';

    type = getParam('Type');

    var imgSrc = 'img/logo' + type + '.jpg';

    $('.title-img').attr('src',imgSrc);

    if(type == 1){

        //$('.head-title').html('政策法规');

        document.title = '政策法规';

    }else if(type == 2){

        //$('.head-title').html('卫监动态及科普');

        document.title = '卫监动态及科普';

    }else if(type == 3){

        //$('.head-title').html('热线新闻');

        document.title = '热线新闻';
    }

}else{

    searchUrl = 'HBYYG/GetH5UserNewsContentByType';

    fkid =  getParam('Eprid');

    var imgSrc = 'img/logo' + type + '.jpg';

    $('.title-img').attr('src',imgSrc);

    document.title = '新闻列表';

}



//获取登录信息
function getLoginMessage (){

    //首先获取url根目录
    var _Lurls = window.document.location.href.split('templates')[0];

    //获取存放配置文件的地址
    var configSrc =  _Lurls + "assets/local/configs/config.json?"+ Math.random();

    $.ajax({
        url: configSrc,
        type: 'get',
        async:false,
        success: function (data) {

            apiUrlPrefix = data["apiUriPrefix"] || '';
            sessionStorage.apiUrlPrefix = apiUrlPrefix;

            //console.log(sessionStorage.loginPath)
        },
        error: function (xhr, res, err) {
            //showAlertInfo(err);
        }

    });
};


//获取新闻标题列表
function conditionSelect(){

    //游泳馆名称
    var eprName = '';

    //审批状态
    var isApl = -1;

    //console.log(sessionStorage.apiUrlPrefix);

    //传递给后台的参数
    var prm = {

        "isApl": isApl,
        "eprName": eprName,
        "type": type,
        "fkid": fkid,
        "userID": _userIdName
    };

    $.ajax({
        type:'post',
        url:_url + searchUrl,
        data:prm,
        success:function(result){

            //console.log(result);

            //for(var i=0;i<result.length;i++){
            //    var tableBlock = $('.table').eq(i);
            //    datasTable(tableBlock,result[i].newsContents);
            //}

            var html = "";

            $(result).each(function(i,o){

                if(o.imgUrl != ""){

                    html += "<li class=''>" +
                        "<span class='left-title'><a href='news-cellphone.html?id="+ o.id+"'>"+ o.title+"</a><br /><font class='left-date'>"+ o.date.split(' ')[0]+"</font></span>";

                    html += '<span class="right-img"><img src="'+ o.imgUrl+'"></span>';

                }else{

                    html += "<li class=''>" +
                        "<span class='left-title left-title1'><a href='news-cellphone.html?id="+ o.id+"'>"+ o.title+"</a><br /><font class='left-date'>"+ o.date.split(' ')[0]+"</font></span>";

                    html += '';
                }

                html += "<div class='clear'></div>";

                html += "</li>"
            });

            $('.news-list-container').html(html);

        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
}

function getParam(paramName) {

    paramValue = "", isFound = !1;

    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++


    }

    return paramValue == "" && (paramValue = null), paramValue

}

