/**
 * Created by admin on 2017/6/20.
 */
//点击切换按钮时
$('.top-choose-img li a').on('click',function(){

    $(this).parents('ul').find('a').removeClass('onClick');
    $(this).addClass('onClick');
});


//获取后台数据
function getData(){

    $.ajax({
        type: 'post',
        url: 'http://192.168.1.196/BEEWebAPI/api'+ "/YWGD/ywGDGetLocInfo",
        timeout: theTimes,
        data:{
            "userID": _userIdName
        },
        beforeSend: function () {
            $('#theLoading').modal('show');


        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            //console.log(data);

            //存放搜索框中内容
            var html = '';

            var html1 = '';

            $(data).each(function(i,o){

                var obj =  {
                    title: o.userName,
                    point: ''+o.longitude+',' + o.latitude + '',
                    address: "",
                    tel: o.mobile,
                    online: 0 ,
                    class: o.depart,
                    id: o.userID
                };
                html +=     '<li class="titles search-li" data-name='+ o.userName+' data-online="不在线"><span></span>'+o.userName+'</li>';

                var left=o.longitude * 2 * (i+1) + 'px';

                var top = o.latitude * 3 * (i+1) + 'px';

                html1 += '<span class="marker" style="position: absolute;left:'+left+';top:'+top+'" name = "'+o.userName+'" tel = "'+o.mobile+'" team = "'+o.depart+'">' +
                    '<label style="display:none;padding-left:5px;padding-right:5px;border:1px solid red;background:white;font-weight: 400;color:black;margin-left:40px;white-space : nowrap ;width:auto !important;float:left;height:22px;position: absolute">'+o.userName+'</label>' +
                    '</span>'

            });


            //重构右上角搜索框中内容
            $('#ul1').html(html);

            $(html1).appendTo('#container');

            //新的搜索对象
            new SEARCH_ENGINE("search-test-inner","search-value","search-value-list","search-li");

            addClick();

            detail();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
}

getData();

//右上角城市切换功能
function detail(){



            $('.titles').off('click');
            $('.titles').on('click',function(){

                var name = $(this).attr('data-name');
                //console.log(name);

               for(var i=0; i<$('.marker').length ; i++){

                   if(name == $('.marker').eq(i).attr('name')){
                        //console.log(666);
                       $('.marker').eq(i).mouseover();
                   }
               }
                event.stopPropagation();

            });

            $('.search-value-list li').off('click');

            $('.search-value-list li').on('click',function(){
              var name = $(this).find('.name').html();
                for(var i=0; i<$('.marker').length ; i++){

                    if(name == $('.marker').eq(i).attr('name')){
                        //console.log(666);
                        $('.marker').eq(i).mouseover();
                    }
                }
                event.stopPropagation();

            });


}


//信息弹窗中的关闭按钮
$('.show-message .close').on('click',function(){

    //console.log(666);
    $(this).parent('.show-message').css({
        display:'none'
    })
});
//点击marker时，出现信息弹窗
function addClick(){
    $('.marker').off('mouseover');
    $('.marker').on('mouseover',function(){

        var left1 = $(this).css('left');

        var top1 = $(this).css('top');

        var name = $(this).attr('name');

        var tel = $(this).attr('tel');

        var team = $(this).attr('team');

        //console.log(left1,top1);

        $('.show-message').css({

            top:top1,
            left:left1,
            display:'block'
        });

        $('.show-message .name').html(name);

        $('.show-message .tel span').html(tel);

        $('.show-message .team span').html(team);
    });
}

$('body').on('click',function(event){

    var that = $(event.target);

    var className = that.prop("className")

   //console.log(className);
    if(className != 'marker'){
        $('.show-message').css({
            display:'none'
        })
    }
});

var removeNum = 0;
$('#onOff').on('click',function(){
    removeNum ++;
    if(removeNum % 2){

        $('.marker label').css({
            display:'inline-block'
        })
        $('#onOff').css({
            background:'url("img/offs.png") no-repeat 0 1.5px'
        })



    }else{


        $('.marker label').css({
            display:'none'
        });

        $('#onOff').css({
            background:'url("img/off.png") no-repeat 0 1.5px',

        })
    }
})



var removeNum = 0;



//右上角下拉菜单显示与隐藏
function showList(){
    $('#ul1').toggle();

}

//获取完整的地址
function getAreas(){

    $('.otherAreas').toggle();

}

//右上角按钮
function display(){
    $('.switch').css({
        'display':'none',

    });
    $('.showCompany').toggle();


}
$('.showTitle p .close').on('click',function(){
    closeCompany();
})



//右上角关闭按钮
function closeCompany(){
    //console.log('666');
    $('.switch').css({
        'display':'block',

    });
    $('.showCompany').css({
        'display':'none'
    });
    $('#ul1 li').css({
        'display':'block'
    });
    $('.search-value-list li').css({
        'display':'none'
    });
    $('.search-value').val('');

    $('#onOff').css({
        'display':'block'
    });
}

//右上角全部显示按钮
function showAll(){
    $('#ul1 li').css({
        'display':'block'
    });
    $('.search-value-list li').css({
        'display':'none'
    });

}


//搜索功能
$(function(){
    // search-test-inner --->  最外层div
    // search-value --->  input 输入框
    // search-value-list --->  搜索结果显示div
    // search-li --->  搜索条目
    new SEARCH_ENGINE("search-test-inner","search-value","search-value-list","search-li");

});


function SEARCH_ENGINE(dom,searchInput,searchResultInner,searchList){

    //存储拼音+汉字+数字的数组
    this.searchMemberArray = [];

    //作用对象
    this.dom = $("." + dom);

    //搜索框
    this.searchInput = "." + searchInput;

    //搜索结果框
    this.searchResultInner = this.dom.find("." + searchResultInner);

    //搜索对象的名单列表
    this.searchList = this.dom.find("." + searchList);

    //转换成拼音并存入数组
    this.transformPinYin();

    //绑定搜索事件
    this.searchActiveEvent();

};


//创建搜索原型对象
SEARCH_ENGINE.prototype = {
    //-----------------------------【转换成拼音，并将拼音、汉字、数字存入数组】
    transformPinYin : function(){

        //临时存放数据对象
        $("body").append('<input type="text" class="hidden pingying-box">');
        var $pinyin = $("input.pingying-box");

        for(var i=0;i<this.searchList.length;i++){

            //存放名字，转换成拼音
            $pinyin.val(this.searchList.eq(i).attr("data-name"));

            //汉字转换成拼音
            var pinyin = $pinyin.toPinyin().toLowerCase().replace(/\s/g,"");

            //汉字
            var cnCharacter = this.searchList.eq(i).attr("data-name");

            //数字
            var online = this.searchList.eq(i).attr("data-online");

            //存入数组
            this.searchMemberArray.push(pinyin + "&" + cnCharacter + "&" + online);
        }

        //删除临时存放数据对象
        $pinyin.remove();
    },

    //-----------------------------【模糊搜索关键字】
    fuzzySearch : function(type,val){
        var s;
        var returnArray = [];

        //拼音
        if(type === "pinyin"){
            s = 0;
        }
        //汉字
        else if(type === "cnCharacter"){
            s = 1;
        }
        //数字
        else if(type === "digital"){
            s = 2;
        }

        for(var i=0;i<this.searchMemberArray.length;i++){
            //包含字符
            if(this.searchMemberArray[i].split("&")[s].indexOf(val) >= 0){
                returnArray.push(this.searchMemberArray[i]);
            }
        }

        return returnArray;

    },

    //-----------------------------【输出搜索结果】
    postMemberList : function(tempArray){
        var html = '';

        //有搜索结果
        if(tempArray.length > 0){

            html += '<li class="tips">搜索结果（' + tempArray.length + '）</li>';

            for(var i=0;i<tempArray.length;i++){
                var sArray = tempArray[i].split("&");

                html += '<li>';

                //判断是否在线
                var color;
                if(sArray[2] == '不在线'){

                    color = '#2097f3';
                }else{
                    color = 'red'
                }

                html += '<span class="ifOnline" style="background:' + color + '"></span>';
                html += '<span class="name">' + sArray[1] + '</span>';
                html += '</li>';

            }
        }
        //无搜索结果
        else{

            if($(this.searchInput).val() != ""){
                html += '<li class="tips">无搜索结果……</li>';
            }else{
                this.searchResultInner.html("");
            }
        }
        this.searchResultInner.html(html);
    },

    //-----------------------------【绑定搜索事件】
    searchActiveEvent : function(){

        var searchEngine = this;


        $(document).on('keyup',this.searchInput,function(){
            //使默认的展示项关闭
            $('#ul1 li').css({
                'display':'none'
            })
            //临时存放找到的数组
            var tempArray = [];

            var val = $(this).val();

            //判断拼音的正则
            var pinYinRule = /^[A-Za-z]+$/;

            //判断汉字的正则
            var cnCharacterRule = new RegExp("^[\\u4E00-\\u9FFF]+$","g");

            //判断整数的正则
            var digitalRule = /^[-\+]?\d+(\.\d+)?$/;

            //只搜索3种情况
            //拼音
            if(pinYinRule.test(val)){
                tempArray = searchEngine.fuzzySearch("pinyin",val);
            }
            //汉字
            else if(cnCharacterRule.test(val)){
                tempArray = searchEngine.fuzzySearch("cnCharacter",val);
            }
            //数字
            else if(digitalRule.test(val)){

                tempArray = searchEngine.fuzzySearch("digital",val);
            }
            else{
                searchEngine.searchResultInner.html('<li class="tips">无搜索结果……</li>');
            }

            searchEngine.postMemberList(tempArray);
            detail();

        });
    }
};
