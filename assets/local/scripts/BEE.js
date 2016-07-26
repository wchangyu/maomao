/**
 * Created by went on 2016/5/5.
 */

var BEE = (function(){

    var _assetsPath = '../../assets/';
    var _localImgPath = 'local/img/';
    var _localCssPath = 'local/css/';
    var _localConfigsPath = 'local/configs/';

    //从json配置中获取menu,并且配置menu
    var getMenu = function(srcUri){
        //var src = "../../assets/local/configs/menu.json";
        if(sessionStorage.menuStr){
            var str = sessionStorage.menuStr;
            var $sidebar = $(".page-sidebar-menu");
            JSON.parse(str);
            getHTMLFromMenu(JSON.parse(str), $sidebar);
        }else{
            var src = _assetsPath + _localConfigsPath + "menu.json";
            src = srcUri || src;
            $.ajax({
                    url:src,
                    type:"get",
                    success:function(str){
                        var $sidebar = $(".page-sidebar-menu");
                        if($sidebar) {
                            $(".page-sidebar-menu li").remove('li[class!="sidebar-toggler-wrapper"]');
                            sessionStorage.menuStr = JSON.stringify(str);
                            getHTMLFromMenu(str, $sidebar);
                        }
                    },
                    error:function(xhr,text,err){
                    }
                }
            );
        }

    }

    //将文本解析为菜单，和插入菜单的父级元素
    var getHTMLFromMenu = function(menu,$src){
        var li,$li,ul,$ul;
        for(var p in menu){
            var curType = menu[p]["type"];
            if(curType){
                if(curType=="0"){
                    //具体菜单操作
                    li = '<li><a href="' + menu[p]["uri"] +'">';
                    if(menu[p]["iconclass"]){
                        li += '<i class="' + menu[p]["iconclass"] +  '"></i>';
                    }
                    li += menu[p]["content"] + '</a></li>';
                    $li = $(li);
                    $src.append($li);
                }else if(curType=="1"){
                    //子菜单操作
                    if(menu[p]["uri"]){
                        li = '<li><a href="' + menu[p]["uri"] + '">';
                    }else{
                        li = '<li><a href="javascript:;">';
                    }

                    if(menu[p]["iconclass"]){
                        li += '<i class="' + menu[p]["iconclass"] +'"></i>';
                    }else {
                        li += '<i></i>';
                    }
                    li += '<span class="title">' + menu[p]["content"] + '</span>';

                    if(!menu[p]["uri"]){
                        li += '<span class="arrow "></span>';
                    }
                    li += '</a></li>';
                    $li = $(li);
                    ul = '<ul class="sub-menu"></ul>';
                    $ul = $(ul);
                    $li.append($ul);
                    $src.append($li);
                    //下级菜单
                    if(menu[p]["submenu"]){
                        getHTMLFromMenu(menu[p]["submenu"],$ul);
                    }
                }
            }
        }
    };

    //设置header中信息
    var setHeaderInfo = function(){
        var username = sessionStorage.username || "未登录";
        $('.username').html(username);
    }





    return {
        //getMenu: getMenu
        init:function(){
            if(!sessionStorage.username)
            {
                window.location.href = "login_3.html";
            }else{
                getMenu();
                setHeaderInfo();
            }

        }
    }
})();