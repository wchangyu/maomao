/**
 * Created by admin on 2018/7/18.
 */
$(function(){

    //时间
    _timeComponentsFun1($('.chooseDate'));

    //获取所有游泳馆
    conditionSelect();

    //改变游泳馆 重新获取游泳池
    $('#eprName').on('change',function(){

        //根据游泳馆 获取游泳池
        getPointerList();

    });

    //点击提交按钮
    $('.success-btn').on('click',function(){

        $('.content-container').showLoading();

        //获取游泳池id
        var pointerID = $('#f_IsApproval').val();

        //获取PH值
        var phData = $('.content-container .phData').val();

        //获取浊度
        var zhuDuData = $('.content-container .zhuDuData').val();

        //获取余氯
        var yuLvData = $('.content-container .yuLvData').val();

        //获取ORP
        var orpData = $('.content-container .orpData').val();

        //获取人数
        var  renShuDaTa= $('.content-container .people-num').val();

        //获取时间
        var time = $('.content-container .chooseDate').val();

        //传递给后台的参数
        var accParams =
        {
            "pointerID": pointerID,
            "phData": phData,
            "zhuDuData":zhuDuData,
            "yuLvData": yuLvData,
            "orpData": orpData,
            "renShuDaTa": renShuDaTa,
            "time": time,
            "userName": _userIdNum
        };


        //为空验证
        if(!pointerID || pointerID == ''){

            $('.content-container').hideLoading();

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'游泳池信息不能为空', '');

            return false;

        }

        var url = sessionStorage.apiUrlPrefix + "HBYYG/PubenvDatasAddHM2";

        //调用后台数据
        $.ajax({
            url:url,
            type:"post",
            data:accParams,
            //async:true,
            success:function(res){
                console.log(res);

                $('.content-container').hideLoading();

                setTimeout(function(){

                    //报错提示信息
                    if(res.status == 3){

                        var message = res.message;

                        if( !message || message == ''){

                            message = '录入失败';
                        }

                        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,res.message, '');

                    }else if(res.status == 99){

                        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'录入成功', '');

                    }

                },100);


            },
            error:function(xhr,res,err){

                $('.content-container').hideLoading();
            }
        });
    });

});



//获取所有游泳馆
function conditionSelect(){
    $.ajax({
        type:'post',
        url:_urls + 'HBYYG/GetUserPubenvDatas',
        data:{
            'userID':_userIdName
        },
        success:function(result){

            //if(result.length == 0){
            //    moTaiKuang($('#myModal'),'请先添加栏目！');
            //}

            var str = '';
            for(var i=0;i<result.length;i++){
                str += '<option value="'+ result[i].enterpriseID+ '" >' + result[i].eprName +'</option>'
            }

            $('#eprName').html(str);

            //根据游泳馆 获取游泳池
            getPointerList();

        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
}

//根据游泳馆 获取游泳池
function getPointerList(){

    //获取当前游泳馆id
    var id = $('#eprName').val();

    $.ajax({
        type:'post',
        url:_urls + 'HBYYG/GetPointerList',
        data:{
            'enterpriseID':id
        },
        success:function(result){

            console.log(result);

            if(result.length == 0){
                moTaiKuang($('#myModal'),'当前无泳池！');
            }

            var str = '';
            for(var i=0;i<result.length;i++){
                str += '<option value="'+ result[i].pointerID+ '" >' + result[i].pointerName +'</option>'
            }

            $('#f_IsApproval').html(str);

        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
};


//时间插件初始化
function _timeComponentsFun1(el){

    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        format : "yyyy/mm/dd hh:ii",//日期格式
        startView: 2,  //1时间  2日期  3月份 4年份
        forceParse: true,
        //minView : 1,
        minuteStep:0
    });
};