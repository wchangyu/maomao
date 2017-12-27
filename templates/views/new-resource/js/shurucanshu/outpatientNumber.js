/**
 * Created by admin on 2017/12/7.
 */
$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //日期插件初始化
    _monthDate($('.datatimeblock'));

    //给页面赋初始年份
    var month1 = moment().format('YYYY-MM');

    $('.min').val(month1);


    //获取企业
    getDepartment($('#company'));

    getDepartment($('#djbm'));


    //平均到天按钮
    $('.average').on('click',function(){

        //获取当前选中月份
        var curMonth = $('#user .months').val();

        //获取当前数据
        var curData = $('#user .count-data').val();

        //判断是否填写完整
        if(curMonth == '' || curData == ''){

            tipInfo($('#myModal1'),'提示','请填写月份及月份数据后进行计算','flag');

            return false;
        }

        //计算当月天数
        var dayNumber = parseInt(moment(curMonth).endOf('month').format('DD'));

        //计算平均值
        var anerageNum = Math.round(curData / dayNumber)

        //赋值
        for(var i=0; i<dayNumber; i++){

            $('.bottom-day-data .day-data').eq(i).val(anerageNum);
        }

    });

    //改变月份 动态改变下方展示的天数
    $('.months').on('change',function(){

        //获取当前选中月份
        var curMonth = $('#user .months').val();

        //计算当月天数
        var dayNumber = parseInt(moment(curMonth).endOf('month').format('DD'));

        $('.bottom-day-data li').hide();

        for(var i=0; i<dayNumber; i++){

            $('.bottom-day-data li').eq(i).show();

            $('.bottom-day-data li').eq(i).find('input').val('');
        }

    });

    //编辑按钮
    $('.top-edit').on('click',function(){

        //判断编辑的月份是否小于当前月份
        var date = moment().format('YYYY/MM');

        if(moment(dataMonth) < moment(date)){

            tipInfo($('#myModal1'),'提示','过去数据不可编辑！','flag');

            return false;
        }

        //可编辑
        $('.bottom-day-data1').find('input').removeAttr('disabled','disabled');

        $('.bottom-day-data1').removeClass('uninput');
    });

    //保存按钮
    $('.top-save').on('click',function(){

        //判断是否是过去数据
        if($('.bottom-day-data1').hasClass('uninput')){

            return false;
        }

        //保存数据
        editOrView1('EnergyAnalyzeV2/PostEnergyDingEData','编辑成功!','编辑失败!');
    });

    //存放数据的月份
    var dataMonth = month1;

    //存放所有数据的数组
    var _allPersonalArr = [];

    //存放当前对象
    var _allPersonObj = {};


    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){

        conditionSelect();
    });
    //数据初始化
    conditionSelect();


    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');

        $('#user .months').val('');

        $('#user .count-data').val('');

        $('#user .day-data').val('');

    });

    //操作确定按钮
    $('#myModal')
    //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('EnergyAnalyzeV2/PostEnergyDingEData','登记成功!','登记失败!');
        });


    /*---------------------------------------其他方法--------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    };

    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
    }


    //获取条件查询
    function conditionSelect(){
        //获取条件

        //企业id
        var enterpriseID = $('#company').val();

        //开始日期
        var st = $('.min').val() + '-01';
        //结束日期
        var et = moment(st).add('1','months').format('YYYY-MM-DD');

        var prm = {
            "enterpriseID": enterpriseID,
            "startTime": st,
            "endTime": et,
            "f_InputType": 0
        };

        $.ajax({
            type:'post',
            url:_urls + 'EnergyAnalyzeV2/GetEnterpriseInputData',
            data:prm,
            success:function(result){


                //无数据
                if(result == null || result.enterpriseDatas.length == 0){

                    tipInfo($('#myModal1'),'提示','无数据！','flag');

                    return false;
                }

                _allPersonalArr.length = 0;

                _allPersonObj = result;

                //企业名称
                var enterpriseName = result.enterpriseName;

                $(result.enterpriseDatas).each(function(i,o){

                    var obj = {};

                    //企业名称
                    obj.enterpriseName = enterpriseName;
                    //本行ID
                    obj.id = o.pK_ID;
                    //获取日期
                    obj.dataDate = o.dataDate;
                    //获取数据+
                    obj.data = o.data;

                    _allPersonalArr.push(obj);

                });
                //下方数据展示
                $('.bottom-day-data1 li').hide();

                $(_allPersonalArr).each(function(i,o){


                    $('.bottom-day-data1 li').eq(i).show();

                    $('.bottom-day-data1 li').eq(i).find('input').val(o.data);
                });
                //不可编辑
                $('.bottom-day-data1').find('input').attr('disabled','disabled');

                $('.bottom-day-data1').addClass('uninput');

                //当前数据月份
                dataMonth = $('.min').val();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //登记方法
    function editOrView(url,successMeg,errorMeg,flag){

        //企业ID
        var enterpriseName = $('#myModal #djbm').val();
        //时间
        var month = $('#myModal .months').val();

        //判断必填项是否为空
        if( enterpriseName == ''||month == ''){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{

            //判断是编辑、登记、还是删除
            var prm = {};
            if(flag){
                prm = {
                    "userID":_userIdName
                };

                //获取当前ID
                prm.id = removeId;

            }else{
                //获取部门名称
                var departName =  $("#djbm").find("option:selected").text();
                //获取楼宇名称
                var buildName =  $("#building").find("option:selected").text();

                //获取当前选中月份
                var curMonth = $('#user .months').val();

                //计算当月天数
                var dayNumber = parseInt(moment(curMonth).endOf('month').format('DD'));

                //存放返回数据
                var enterpriseDatasArr = [];

                for(var i=0; i<dayNumber; i++){

                    //获取日期
                    var date = moment(curMonth).startOf('month').add(i,'days').format('YYYY-MM-DD');

                    //获取数据
                    var data = parseInt($('.bottom-day-data li').eq(i).find('input').val());

                    if(isNaN(data)){
                        tipInfo($('#myModal1'),'提示','请填写本月每日的数据！','flag');
                        return false;
                    }

                    var obj = {
                        "pK_ID": 0,
                        "dataDate": date,
                        "data": data
                    };
                    //把对象放入定义好的数组
                    enterpriseDatasArr.push(obj);

                }

                prm = {
                    "fK_Enterprise_Input": enterpriseName,
                    "enterpriseName": departName,
                    "f_InputType": 0,
                    "enterpriseDatas": enterpriseDatasArr,
                    "userID":_userIdName
                };


            }
            //发送数据
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        //提示登记成功
                        tipInfo($('#myModal1'),'提示',successMeg,'flag');
                        $('#myModal').modal('hide');
                    }else if(result == 3){
                        //提示登记失败
                        tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                    }
                    conditionSelect();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })


        }
    };

    //编辑方法
    function editOrView1(url,successMeg,errorMeg){

        var prm = _allPersonObj;

        //计算当月天数
        var dayNumber = parseInt(moment(dataMonth).endOf('month').format('DD'));

        //存放返回数据
        var enterpriseDatasArr = [];

        for(var i=0; i<dayNumber; i++){

            //获取日期
            var date = moment(dataMonth).startOf('month').add(i,'days').format('YYYY-MM-DD');

            //获取数据
            var data = parseInt($('.bottom-day-data1 li').eq(i).find('input').val());

            if(isNaN(data)){
                tipInfo($('#myModal1'),'提示','请填写本月每日的数据！','flag');
                return false;
            }

            var obj = {
                "pK_ID": _allPersonObj.enterpriseDatas[i].pK_ID,
                "dataDate": date,
                "data": data
            };
            //把对象放入定义好的数组
            enterpriseDatasArr.push(obj);

        }
        prm.enterpriseDatas = enterpriseDatasArr;
        prm.userID = _userIdName;

        console.log(prm);

        //发送数据
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result == 99){
                    //提示登记成功
                    tipInfo($('#myModal1'),'提示',successMeg,'flag');
                    $('#myModal').modal('hide');
                }else if(result == 3){
                    //提示登记失败
                    tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                }
                conditionSelect();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取企业
    function getDepartment(el){

        var companyArr =  getPointerTree();

        var html = '';
        //遍历企业放入页面中
        $(companyArr).each(function(i,o){
            //不是根节点
            if(o.nodeType != 0){

                html += '<option value="' + o.id +
                    '">' + o.name + '</option>'
            }
        })

        el.html(html);
    }

});