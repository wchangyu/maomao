/*--------------------------------------------------查看工单报修图片------------------------------------*/

//工单报修图片的数量
var _imgNum = 0;

//工单完工图片的数量
var _imgWGNum = 0;

//备件图片数量
var _imgBJNum = 0;

//工单详情【查看图片】
$('#viewImage,.viewImage').click(function(){

    var o = $('.showImage').css('display');

    if(o == 'none'){

        //loadding
        $('#theLoading').modal('show');

        if(_imgNum){
            var str = '';

            for(var i=0;i<_imgNum;i++){

                str += '<img class="viewIMG" src="' + _replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + '2' + (i + 1) + '">'
            }

            $('.showImage').html('').append(str).show();

        }else{

            $('.showImage').html('没有图片').show();

        }

        $('#theLoading').modal('hide');

    }else{

        $('.showImage').hide();

    }

})

//图片放大
$('.showImage').on('click','.viewIMG',function(){

    _moTaiKuang($('#img-Modal'),'工单图片详情',true,'','','');

    var imgSrc = $(this).attr('src');

    $('#img-Modal').find('img').attr('src',imgSrc);

    //模态框位置
    $('#img-Modal').children().css({'marginTop':'30px'});

})

//备件详情【查看图片】
$('#viewBJImage').click(function(){

    var o = $('.bjImg').css('display');

    if(o == 'none'){

        //loadding
        $('#theLoading').modal('show');

        if(_imgBJNum){

            var str = '';

            for(var i=0;i<_imgBJNum;i++){

                str += '<img class="viewIMG" src="' + _replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + (i + 1) + '">'
            }

            $('.bjImg').html('').append(str).show();

        }else{

            $('.bjImg').html('没有图片').show();

        }

        $('#theLoading').modal('hide');

    }else{

        $('.bjImg').hide();

    }

})

//备件图片放大
$('.bjImg').on('click','.viewIMG',function(){

    _moTaiKuang($('#img-Modal'),'备件图片详情',true,'','','');

    var imgSrc = $(this).attr('src');

    $('#img-Modal').find('img').attr('src',imgSrc);

    //模态框位置
    $('#img-Modal').children().css({'marginTop':'30px'});

})

//完工图片
$('#viewWGImage').click(function(){

    var o = $('.wgImg').css('display');

    if(o == 'none'){

        //loadding
        $('#theLoading').modal('show');

        if(_imgWGNum){

            var str = '';

            for(var i=0;i<_imgWGNum;i++){

                str += '<img class="viewIMG" src="' + _replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + '3' + (i + 1) + '">'
            }

            $('.wgImg').html('').append(str).show();

        }else{

            $('.wgImg').html('没有图片').show();

        }

        $('#theLoading').modal('hide');

    }else{

        $('.wgImg').hide();

    }

})

//完工图片放大
$('.wgImg').on('click','.viewIMG',function(){

    _moTaiKuang($('#img-Modal'),'备件图片详情',true,'','','');

    var imgSrc = $(this).attr('src');

    $('#img-Modal').find('img').attr('src',imgSrc);

    //模态框位置
    $('#img-Modal').children().css({'marginTop':'30px'});

})

//配置工单来源
if($('.gdly')){

    _gdSource();

}
/*------------------------------------------------------工单来源----------------------------------------*/

//工单来源
function _gdSource(){

    var str = '';

    str = '<option value="1">'+ __names.department +'报修</option><option value="2">现场人员报修</option>';

    $('.gdly').empty().append(str);

}

/*------------------------------------------------------线路配置----------------------------------------*/

if( !__routeShow){

    $('.routeShow').hide();

}else{

    $('.routeShow').show();

}

//页面加载的时候，首先要判断用户所属的班组，是属于车间还是维保组。（权限）

//标识在维保组中
var _AisWBZ = false;

//标识在维修班组中
var _AisBZ = false;

//维保组数组
var _AWBZArr = [];

//维修班组
var _ABZArr = [];

//仓库数组
var _AWarehouseArr = [];

//当前部门的车站
var _departStationArr = [];

//维修班组
//车间、维修班组数据

function _WxBanzuStationData(fun){

    $.ajax({

        type:'post',
        url:_urls + 'YWGD/ywGDGetWxBanzuStation',
        data:{

            //用户id
            userID:_userIdNum,
            //用户姓名
            userName:_userIdName
        },
        timeout:_theTimes,
        success:function(result){

            _AWBZArr.length = 0;

            _ABZArr.length = 0;

            if(result){

                if(result.stations){

                    for(var i=0;i<result.stations.length;i++){

                        if( _maintenanceTeam == result.stations[i].departNum ){

                            //在车间中
                            _AisWBZ = true;

                            _AWBZArr.push(result.stations[i]);

                        }

                    }

                }

                if( result.wxBanzus ){

                    for(var i=0;i<result.wxBanzus.length;i++){

                        if(_maintenanceTeam == result.wxBanzus[i].departNum){

                            _AisBZ = true;

                            _ABZArr.push(result.wxBanzus[i]);

                        }
                    }

                }

            }

            if(fun){

                fun();

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(jqXHR.responseText);
        }

    })

}

//获取仓库列表
function _warehouseLise(fun){

    $.ajax({

        type:'post',
        url:_urls + 'YWCK/ywCKGetStorages',
        timeout:_theTimes,
        data:{

            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole

        },
        success:function(result){

            _AWarehouseArr.length = 0;

            for(var i=0;i<result.length;i++){

                _AWarehouseArr.push(result[i]);

            }

            fun();

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(jqXHR.responseText);
        }

    })

}

//获取日志信息（备件logType始终传2）
function _logInformation(el,logType){
    var gdLogQPrm = {
        "gdCode": _gdCode,
        "logType": logType,
        "userID": _userIdNum,
        "userName": _userIdName
    };
    $.ajax({
        type:'post',
        url:_urls + 'YWGD/ywDGGetLog',
        data:gdLogQPrm,
        success:function(result){
            if(logType == 2){
                var str = '';

                for(var i =0;i<result.length;i++){
                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                }

                el.empty().append(str);

            }else if(logType == 1){
                var str = '';

                for(var i=0;i<result.length;i++){
                    str += '<li><span class="list-dot"> </span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;' + result[i].logTitle + '</li>';
                }

                el.empty().append(str);
            }else{
                var str = '';
                for(var i =0;i<result.length;i++){
                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                }
                el.empty().append(str);
            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    })
}

//获取当前的车站
function _stationData(){

    var prm = {
        //当前部门
        "departNum": _maintenanceTeam,
        "isWx": 1,
        //当前用户id
        "userID": _userIdNum,
        //当前用户名
        "userName": _userIdName,
        //角色
        "b_UserRole": _userRole,
        //所属班组
        "b_DepartNum": _loginUser.isWx
    }

    $.ajax({

        type:'post',
        url:_urls + 'YWGD/ywGetDepSta',
        data:prm,
        timeout:_theTimes,
        success:function(result){

            console.log(result);

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }

    })

}

//根据用户班组，生成班组下拉列表
function _BZList(el,fun){

    //生成维修班组
    var arr = [];

    if(_AisWBZ){

        for(var i=0;i<_AWBZArr.length;i++){

            for(var j=0;j<_AWBZArr[i].wxBanzus.length;j++){

                arr.push(_AWBZArr[i].wxBanzus[j]);

            }

        }

    }else if(_AisBZ){

        for(var i=0;i<_ABZArr.length;i++){

            if(_maintenanceTeam == _ABZArr[i].departNum ){

                arr.push(_ABZArr[i]);

            }

        }

    }

    var str = '<option value="">全部</option>';

    for(var i=0;i<arr.length;i++){

        str += '<option value="' + arr[i].departNum +
            '">' + arr[i].departName + '</option>'

    }

    el.empty().append(str);

    if(fun){

        fun();

    }

}

