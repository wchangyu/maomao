$(function(){
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认开始时间
    var endTime =moment().format('YYYY/MM/DD');

    var startTime = moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.min').val(startTime);

    $('.max').val(endTime);

    //存储所有仓库信息
    var _ckArr = [];

    var _InfluencingArr = [];

    //所有仓库
    //warehouse();

    //所属车间、所属维保组
    wbz();

    //仓库库区联动
    $('#storage').change(function(){
        //根据已选仓库，确定库区
        var str = '<option value="">请选择</option>';
        for(var i=0;i<_ckArr.length;i++){
            if($('#storage').val() == _ckArr[i].storageNum){
                for(var j=0;j<_ckArr[i].locations.length;j++){
                    str += '<option value="' + _ckArr[i].locations[j].localNum +
                        '">' + _ckArr[i].locations[j].localName + '</option>'
                }
            }
        }
        $('#kqSelect').empty().append(str);
    })

    //印象单位联动
    $('#yxdw').change(function(){
        var values = $('#yxdw').val();
        $('#userClass').empty();
        if(values == ''){
            wbz('flag');
        }else{
            for(var i=0;i<_InfluencingArr.length;i++){
                if(values == _InfluencingArr[i].departNum){
                    var str = '<option value="">请选择</option>';
                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){
                        str += '<option value="' + _InfluencingArr[i].wxBanzus[j].departNum +
                            '">' + _InfluencingArr[i].wxBanzus[j].departName + '</option>'
                    }
                    $('#userClass').append(str);
                }
            }
        }
    });

    //conditionSelect();

    //仓库是否执行完毕
    var _isWarehouse = false;

    /*---------------------------------表格初始化------------------------------*/
    var col = [
        {
            title:'物品编号',
            data:'itemNum'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'物品序列号',
            data:'sn'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'数量',
            data:'num'
        },
        {
            title:'单价',
            data:'price',
            render:function(data, type, full, meta){

                return formatNumber(data)

            }
        },
        {
            title:'金额',
            data:'amount',
            render:function(data, type, full, meta){

                return formatNumber(data)

            }
        },
        {
            title:'库区',
            data:'localName'
        },
        {
            title:'车站',
            data:'bxKeshi'
        },
        {
            title:'所属班组',
            data:'departName'
        },
        {
            title:'时间',
            data:'createTime'
        },
        {
            title:'工单号',
            data:'gdCode2'
        },
        {
            title:'请领人',
            data:'qlRen'
        },
        {
            title:'收料人',
            data:'slRen'
        },
        {
            title:'发料人',
            data:'flRen'
        }
    ];
    _tableInit($('#scrap-datatables'),col,'1','flag','','');


    //数据
    warehouse();

    /*----------------------------------按钮事件------------------------------*/
    //查询
    $('#selected').click(function(){
        if($('.min').val() == '' || $('.max').val() == '' || $('#yxdw').val() == '' || $('#storage').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择红色必选项进行查询！', '');

        }else{

            conditionSelect();

        }
    })

    //重置
    $('.resites').click(function(){
        //input时间重置
        $('.min').val(startTime);
        $('.max').val(endTime);
        //select清空
        $('.condition-query').find(select).val('');
    })

    /*---------------------------------其他方法--------------------------------*/
    //获取车间、维保组
    function wbz(flag){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:{
                "userID": _userIdNum,
                "userName": _userIdNum
            },
            success:function(result){
                var str = '<option value="">请选择</option>';
                var str1 = '<option value="">请选择</option>';
                if(flag){
                    for(var i=0;i<result.wxBanzus.length;i++){
                        str1 += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                    }
                    $('#userClass').append(str1);
                }else{
                    _InfluencingArr = [];
                    for(var i=0;i<result.stations.length;i++){
                        _InfluencingArr.push(result.stations[i]);
                        str += '<option value="' + result.stations[i].departNum +
                            '">' + result.stations[i].departName + '</option>';
                    }
                    for(var i=0;i<result.wxBanzus.length;i++){
                        str1 += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                    }
                    $('#yxdw').append(str);
                    $('#userClass').append(str1);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //条件查询
    function conditionSelect(){
        var ckArr = [];
        var ckNum = '';
        if($('#storage').val() == ''){
            for(var i=0;i<_ckArr.length;i++){
                ckArr.push(_ckArr[i].storageNums)
            }
            ckNum='';
        }else{
            ckNum = $('#storage').val();
            ckArr = [];
        }
        var endTime1 = moment(endTime).add(1,'d').format('YYYY/MM/DD')
        var prm ={
            st:$('.min').val(),
            et:endTime1,
            departNum2:$('#yxdw').val(),
            departNum:$('#userClass').val(),
            storageNums:ckArr,
            storageNum:ckNum,
            localNum:$('#kqSelect').val(),
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetDepOutDetail',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#scrap-datatables'),result);

                //标题

                //获取仓库
                var storage = '';

                if( $('#storage').val() == '' ){

                    storage = '';

                }else{

                    storage = $('#storage').children('option:selected').html();

                }

                var yxdw = '';


                if( $('#yxdw').val() == '' ){

                    yxdw = '';

                }else{

                    yxdw = $('#yxdw').children('option:selected').html();

                }

                var str = '材料总支出';

                if( typeof storage == 'undefined'){

                    storage = '';

                }

                if(typeof yxdw == 'undefined'){

                    yxdw= '';

                }

                $('#scrap-datatables').find('caption').html( storage + yxdw + str );


                var num = 0;

                var amount = 0;

                for(var i=0;i<result.length;i++){

                    num += result[i].num;

                    amount += result[i].amount;
                }

                if(isNaN(formatNumber(amount)) && isNaN(num)){

                    $('#scrap-datatables .total-amount').html(0.00);

                    $('#scrap-datatables .total-num').html(0);

                }else{
                    $('#scrap-datatables .total-amount').html(formatNumber(amount));

                    $('#scrap-datatables .total-num').html(parseInt(num));
                }




            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库
    function warehouse(){
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:{
                'hasLocation':1,
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole
            },
            timeout:_theTimes,
            success:function(result){
                //console.log(result);
                _isWarehouse = true;
                _ckArr.length = 0;
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    _ckArr.push(result[i]);
                    str += '<option value="' + result[i].storageNum
                        + '">' + result[i].storageName + '</option>'
                }
                $('#storage').empty().append(str);
                if(_isWarehouse){
                    conditionSelect();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint');
    //格式化数字，排除infinity NaN 其他格式
    function formatNumber(num){
        if(num===Infinity){
            return 0.00;
        }
        if(+num===num){
            return num.toFixed(2);
        }
        return 0.00;
    }

})
