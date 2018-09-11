/**
 * Created by admin on 2018/9/6.
 */
$(function(){

    //获取菜单信息 并赋值到页面中
     getMenuToHtml();

    //给iframe添加点击事件
    addClickForIframe();

    //点击左侧主菜单
    $('.left-bottom-menu-container').on('click','.main-menu',function(){

        //console.log(_newSimpleMenuArr)

        //获取之前选中的dom元素
        var lastDom = $(this).parent().find('.onChoose');

        //之前选中的图片替换为未选中的图片
        changeMainMenuImg(lastDom,2);

        //改变样式
        $('.left-bottom-menu-container .main-menu').removeClass('onChoose');

        $(this).addClass('onChoose');

        //之前未选中的图片替换为选中的图片
        changeMainMenuImg($(this),1);

        //获取当前存储的主菜单id
        var thisMenuId = $(this).attr('data-id');

        //console.log(_newSimpleMenuArr);

        $(_newSimpleMenuArr).each(function(i,o){

            if(o.id == thisMenuId){

                //给当前展示的二级菜单列表重新赋值
                _theSecondMenuArr = o.newChildMenu;

                return false;
            }
       });

        //绘制右侧上方菜单
        drawTopMenu(_theSecondMenuArr,true);

    });

    //点击二级菜单两边的按钮
    $('.right-menu-container .carousel-control').on('click',function(){

        //获取当前元素偏移量
        var marginNum = parseInt($(".right-menu-inner-container").css('marginLeft'));


        //判断当前是左偏还是右偏
        var flag = $(this).attr('data-id');

        //偏移量前面的系数
        var coefficient = -1;

        //左偏
        if(flag == 1){

            coefficient = 1;

        }

        //偏移量
        var excursionNum = marginNum +  (coefficient *160);

        //如果偏移量大于0
        if(excursionNum > 0){

            return false
        }

        //如果偏移量大于本身长度
        if(excursionNum + _secondMenuLength < 160){

            return false
        }



        $(".right-menu-inner-container").css('marginLeft',excursionNum+'px');

    });

    //点击二级菜单
    $('.right-menu-inner-container').on('click','.secondary-menu',function( event){

        if($(this).hasClass('onChoose1')){

          if($(this).find('.thirdary-menu').is(':hidden')){

              $(this).removeClass('hide-menu');

          }else{

              $(this).addClass('hide-menu');

          }

            event.stopPropagation();

            return false;
        }

        $('.right-menu-inner-container .secondary-menu').removeClass('hide-menu');

        $('.right-menu-inner-container .secondary-menu').removeClass('onChoose');

        $('.right-menu-inner-container .secondary-menu').removeClass('onChoose1');


        //判断当前是否存在三级菜单
        if($(this).attr('data-id')){

            $(this).addClass('onChoose');

        }else{

            $(this).addClass('onChoose1');
        }

        event.stopPropagation();

        //如果无三级菜单 直接跳转
        if($(this).attr('data-id')){

            //获取当前跳转地址
            var jumpUrl = $(this).attr('data-id');

            //改变iframe路径
            $('#embed-page').attr('src',jumpUrl);

        }

    });

    $('body').on('click',function(){

        $('.right-menu-inner-container .secondary-menu').addClass('hide-menu');


    });

    $('.embed-page').on('click',function(){

        $('.right-menu-inner-container .secondary-menu').addClass('hide-menu');
    });

    //点击三级菜单
    $('.right-menu-inner-container').on('click','.third-menu-message',function(){

        //获取当前跳转地址
        var jumpUrl = $(this).attr('data-id');

        //改变iframe路径
        $('#embed-page').attr('src',jumpUrl);

    });


});

//存放用户配置的首页路径
var mainIndexUrl = '';

//存放当前二级菜单的长度
var _secondMenuLength = 0;

//存放当前菜单容器宽度
var _secondMenuContainerLength = 0;

//存放调整后的菜单列表
var _newSimpleMenuArr = [];

//存放当前展示的二级菜单列表
var _theSecondMenuArr = [];

//获取菜单信息 并赋值到页面中
function getMenuToHtml(){

    //从session中读取菜单信息
    var menuData = JSON.parse(sessionStorage.curMenuStr);

    //将对象转化为数组，方便处理
    var _menuArr = transform(menuData);

    //删除对象中第一个元素
    _menuArr.shift();

    //定义是否设置登录后首页的标识
    var ifSetIndexUrl = false;

    //存放首页地址
    var indexUrl = '';

    if(sessionStorage.indexUrl){

        ifSetIndexUrl = true;

        //删除配置项中../ 方便下面进行遍历
        indexUrl = myFunc(sessionStorage.indexUrl,'../');

        mainIndexUrl = '../'+ indexUrl;

        //页面初始化
        //改变iframe路径
        $('#embed-page').attr('src',mainIndexUrl);
    }

    //改变menuArr的结构
    _menuArr = changeOriginalMenu(_menuArr,indexUrl);

    _newSimpleMenuArr = _menuArr;

    //绘制页面左侧主菜单
    drawLeftMenu(_menuArr);

    //绘制右侧上方菜单
    drawTopMenu(_theSecondMenuArr);

};

//把从后台获取到的菜单变成方便页面使用的菜单
function changeOriginalMenu(menuArr,indexUrl){

    //给数组中每个主菜单加索引
    $(menuArr).each(function(i,o){

        o.id = 'main-menu' + i;

        //获取当前子菜单
        var childMenuArr = transform(o.submenu);

        //判断用户是否设置了登录后的首页
        if(indexUrl != ''){

            childMenuArr = checkedChildMenuArr(childMenuArr,indexUrl)[0];

            if(checkedChildMenuArr(childMenuArr,indexUrl)[1]){

                o.indexUrl = 1;
            }

        }

        //把当前子菜单根据type=0 或者type=2 分成上下级模式
        var newChildMenu = changeChildMenuByType(childMenuArr);


        o.newChildMenu = newChildMenu;

    });

    return menuArr;
};

//判断当前子菜单是否是用户配置的首页菜单
function checkedChildMenuArr(childMenuArr,indexUrl){

    //主菜单是否是包含首页菜单标识
    var  ifMainIndex = false;

    //判断登录后首页是否在当前子菜单
    $(childMenuArr).each(function(i,o){

        if(o.type == 0){

            //对每个子菜单进行判断
            var ifIndex = checkedIndexUrl(o,indexUrl);

            //如果首页在当前子菜单中
            if(ifIndex == true){

                o.indexUrl = 1;

                ifMainIndex = true;

            }

        }

    });

    return [childMenuArr,ifMainIndex];
};

//把当前子菜单分成上下级结构
function changeChildMenuByType(childMenuArr){

    var newChildMenuArr = [];

    //是否存在二级菜单的标识
    var ifSecondMenu = false;

    //先判断是否有type=2的二级菜单
    $(childMenuArr).each(function(i,o){

        if(o.type == 2){

            ifSecondMenu = true;

            return false;
        }
    });

    //如果存在二级菜单
    if(ifSecondMenu == true){

        $(childMenuArr).each(function(i,o){

            if(i == 0 && o.type == 0){

                newChildMenuArr.push(o);

            }else{

                if(o.type == 2){

                    var thirdMenuArr = [];

                    $(childMenuArr).each(function(k,j){

                        if(k > i){

                            if(j.type == 2){

                                return false;
                            }

                            if(j.type == 0){

                                thirdMenuArr.push(j);
                            }

                            if(j.indexUrl == 1){

                                o.indexUrl = 1;
                            }
                        }
                    });

                    o.childMenu = thirdMenuArr;

                    newChildMenuArr.push(o);
                }
            }
        });

    }else{


        $(childMenuArr).each(function(i,o){

            newChildMenuArr.push(o);
        });
    }

    return newChildMenuArr;

};

//验证首页是否在当前菜单
function checkedIndexUrl(menuObj,indexUrl){

    //获取当前url
    var curUrl = menuObj.uri;

    if(curUrl.indexOf(indexUrl) > -1){

        return true;

    }else {

        return false;
    }

};

//页面左侧主菜单绘制
function drawLeftMenu(menuArr){

    //定义左侧主菜单内容
    var _leftMainMenuHtml = '';

    //页面菜单绘制
    $(menuArr).each(function(i,o){

        //定义图片地址
        var imgUrl = '';

        //首页标识
        var ifIndexClass = '';

        if(o.indexUrl == 1){

            ifIndexClass = 'onChoose';

            //给当前显示的二级菜单列表赋值
            _theSecondMenuArr = o.newChildMenu;
        }

        if(o['icon-img']){

            if(o.indexUrl == 1){

                imgUrl = 'img/' + o['icon-img'];

            }else{

                imgUrl = 'img/' + o['icon-hover'];

            }

        };

        _leftMainMenuHtml +=   '<div class="main-menu '+ifIndexClass+'" data-id="'+ o.id+'">' +

            '<!--左侧图片-->' +
            '<img src="'+imgUrl+'" alt="" class="left-main-menu-img">' +

            '<!--右侧名称-->' +
            '<span class="right-mian-menu-name">'+ o.content+'</span>' +

            '</div>';


    });

    //左侧主体菜单页面赋值
    $('.left-bottom-menu-container').html(_leftMainMenuHtml);

};

//页面上方二级菜单 flag为true 则默认第一个选中
function drawTopMenu(secondMenuArr,flag){

    //二级菜单偏移量复位
    $(".right-menu-inner-container").css('marginLeft','0px');

    //清空二级菜单长度
    _secondMenuLength = 0;

    //console.log(secondMenuArr);

    //定义二级菜单页面内容
    var secondMenuHtml = '';

    $(secondMenuArr).each(function(i,o){

        _secondMenuLength += 160;

        //标识当前哪个二级菜单高亮
        var indexClass = '';

        if(o.type == 2){

            if(flag){

                if(i == 0){

                    indexClass = 'onChoose1';
                }

                //如果包含首页 则当前选中
            }else if(o.indexUrl == 1){

                indexClass = 'onChoose1';
            }


            //存放三级菜单
            var thirdMenuHtml = '';

            $(o.childMenu).each(function(k,j){

                thirdMenuHtml += '<li><a class="third-menu-message" href="javascript:;" data-id="'+ j.uri+'">'+ j.content+'</a></li>';

            });

            secondMenuHtml +=   '<div class="secondary-menu '+indexClass+'">' +
                o.content+

                                    '<!--三级菜单-->' +
                                    '<div class="thirdary-menu">' +

                                        '<ul>' +
                                                thirdMenuHtml+
                                        '</ul>' +

                                    '</div>' +

                                '</div>';

        }else if(o.type == 0){

            if(flag){

                if(i == 0){

                    indexClass = 'onChoose';
                }

                //如果包含首页 则当前选中
            }else if(o.indexUrl == 1){

                indexClass = 'onChoose';
            }


            secondMenuHtml +=   '<div class="secondary-menu  '+indexClass+'" data-id="'+ o.uri+'">' +

                                     o.content+

                                '</div>';

        }

    });

    secondMenuHtml += '<div class="clearfix"></div>';

    //页面赋值
    $('.right-menu-inner-container').html(secondMenuHtml);

    //获取当前菜单容器宽度
    _secondMenuContainerLength = parseInt($('.right-menu-container').css('width')) - 80;

    //如果菜单长度小于菜单容器宽度
    if(_secondMenuContainerLength > _secondMenuLength){

        $('.right-menu-container .carousel-control').hide();

    }else{

        $('.right-menu-container .carousel-control').show();

    }

};

//改变某个主菜单中的图片 flag=1为变成选中状态 2为变成未选中状态
function changeMainMenuImg(dom,flag){

    //变成选中状态
    if(flag==1){

        //获取到之前选中的菜单的图片
        var imgUrl = dom.find('.left-main-menu-img').attr('src');

        //选中图片变成未选中图片
        var newImgUrl = imgUrl.split('1')[0] + imgUrl.split('1')[1];

        //新图片赋值
        dom.find('.left-main-menu-img').attr('src',newImgUrl);

    }

    //变成未选中状态
    if(flag==2){

        //获取到之前选中的菜单的图片
        var imgUrl = dom.find('.left-main-menu-img').attr('src');

        //选中图片变成未选中图片
        var newImgUrl = imgUrl.split('.')[0] + '1.'+imgUrl.split('.')[1];

        //新图片赋值
        dom.find('.left-main-menu-img').attr('src',newImgUrl);

    }
}

//对象转化为数组
function transform(obj){

    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }

    return arr;

};

//删除字符串中某段字符
function myFunc(a,b){

    while(a.indexOf(b)!=-1){
        a=a.replace(b,'');
    }
    return a;

};

//给iframe添加点击事件
function addClickForIframe(){

    var testiframe=document.getElementById("embed-page").contentWindow;
    var doc=testiframe.document;
    /*testiframe.scroll(0,doc.body.scrollHeight);*/
    testiframe.addEventListener("click",function(e){
        $('.right-menu-inner-container .secondary-menu').addClass('hide-menu');
    },false);

}