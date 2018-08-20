$(function(){

    /*-------------------------------时间插件---------------------------------*/

    _timeYMDComponentsFun($('.abbrDT'));

    var nowTime = moment().format('YYYY/MM/DD');

    $('#spDT').val(moment(nowTime).subtract('1','days').format('YYYY/MM/DD'));

    $('#epDT').val(nowTime);

    /*-------------------------------表格初始化-------------------------------*/

    var col = [

        {
            title:'对象',
            data:'kpiN'
        },
        {
            title:'总值<span class="Lunite">(KWH/KWH)</span>',
            data:'totalV'
        },
        {
            title:'峰值<span class="Lunite">(KWH/KWH)</span>',
            data:'maxV'
        },
        {
            title:'出现时间',
            data:'maxDT'
        },
        {
            title:'谷值<span class="Lunite">(KWH/KWH)</span>',
            data:'minV'
        },
        {
            title:'出现时间',
            data:'minDT'
        },
        {
            title:'平均值<span class="Lunite">(KWH/KWH)</span>',
            data:'averV'
        }

    ]

    _tableInit($('.table'),col,2,true,'','',true,'','',false);

    /*-------------------------------ztree----------------------------------*/

    var _mychart = echarts.init(document.getElementById('rheader-content-16'));

    //折线图配置项
    var option = {

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataView: {
                }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: [

        ],
        series: [

        ]
    };


    /*-------------------------------按钮事件---------------------------------*/

    //获取区域位置的数据
    getDevAreaByType();

    //查询
    $('#btn').click(function(){

        getLineData();

        tableData();

    })

    //删除已选中设备
    //删除每个的小按钮
    $('.main-selected-block').on('click','.remove-selected',function(){

        $(this).parent('.main-selected-list').remove();

        var values = $(this).parent('.main-selected-list').children('.main-selected-list1').attr('attr-id')

        var zTree_Menu = $.fn.zTree.getZTreeObj("allDev");

        var node = zTree_Menu.getNodeByParam("id",values);

        zTree_Menu.selectNode(node,false);

        zTree_Menu.checkNode(node,false);


    })

    //全清
    $('#emptyAll').click(function(){

        $('.main-selected-block').empty();

        var zTree_Menu = $.fn.zTree.getZTreeObj("allDev");

        zTree_Menu.checkAllNodes(false);

    })

    /*-------------------------------其他方法----------------------------------*/

    //获取区域位置的数据
    function getDevAreaByType(){

        var ecParams = {

            "pointerID": sessionStorage.PointerID,
        };

        //发送请求
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+"ZKDevicesShow/GetDevAreaByType",
            data:ecParams,
            timeout:_theTimes,
            beforeSend:function(){

                $('#allPointer').showLoading();

                $('.noData').remove();

            },
            success:function(result){

                $('#allPointer').hideLoading();

                //判断是否返回数据
                if(result.code != 0 || result.tvs == null){

                    var str = '<div class="noData" style="line-height: 30px;display: block;width: 100%">暂时没有获取到设备数据</div>'

                    $('#allPointer').before(str);

                    return false;

                }

                var dataArr = [];

                if(result.code == 0){

                    $(result.tvs).each(function(i,o){

                        dataArr.push(o);

                    });

                }

                areaTree(dataArr);

            },
            error:function(jqXHR, textStatus, errorThrown){
                $('#allPointer').hideLoading();

                //错误提示信息
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');

                }else{

                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');

                }

            }
        })
    };

//根据设备类型获取设备名称及监测点类型
    function getDevInfoCTypes(){

        //获取设备
        var treeObj = $.fn.zTree.getZTreeObj("allPointer");

        var nodes = treeObj.getCheckedNodes(true);

        //传递给后台的数据
        var ecParams = {

            "pId": sessionStorage.PointerID,
            "itemId": nodes[0].item
        };

        //发送请求
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+"ZKDevicesShow/GetDevInfoCTypes",
            data:ecParams,
            timeout:_theTimes,
            beforeSend:function(){
                $('#allDev').showLoading();
            },
            success:function(result){

                $('#allDev').hideLoading();

                //判断是否返回数据
                if(result.code != 0){

                    var str = '<div class="noData" style="line-height: 30px;display: block;width: 100%">暂时没有获取到设备数据</div>'

                    $('#allDev').before(str);

                    return false;
                }

                if(result.arosList.length == 0 || result.arosList == null){

                    var str = '<div class="noData" style="line-height: 30px;display: block;width: 100%">暂时没有获取到设备数据</div>'

                    $('#allDev').before(str);

                    return false;

                }

                var arr = [];

                for(var i=0;i<result.arosList.length;i++){

                    var obj = {};

                    obj.id = result.arosList[i].id;

                    obj.name = result.arosList[i].name;

                    obj.item = result.arosList[i].item;

                    arr.push(obj);

                }

                devTree(arr);

                //获取设备列表
                //getEquipmentZtree(equipmentArr,2,false,false,equipmentObj);

            },
            error:function(jqXHR, textStatus, errorThrown){
                myChartTopLeft.hideLoading();
                $('.left-middle-main1').hideLoading();
                //错误提示信息
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
                }else{
                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
                }

            }
        })

    };

    //设备ztree
    function devTree(arr){

        var setting = {

            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" },
                radioType:'all'
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{

                showIcon:false
            },
            callback: {
                //这个是点击后边的文字选中的事件
                onClick: function(e,treeId,treeNode){

                    //勾选当前选中的节点
                    zTreeObj.checkNode(treeNode, !treeNode.checked, true);

                    //判断当前节点是否选中
                    if(treeNode.checked){

                        //选中,插入已选中的区域
                        //放到已选择类型中
                        var str = '<div class="main-selected-list">' +
                            '<div class="main-selected-list1" attr-id="' + treeNode.id + '">' + treeNode.name +
                            '</div>' +
                            '<div class="remove-selected">x</div>' +
                            '</div>';

                        $('.main-selected-block').append(str);


                    }else{

                        //未选中,从已选中的区域剔除
                        var selectedArr = $('.main-selected-list');

                        for(var i=0;i<selectedArr.length;i++){

                            var id = selectedArr.eq(i).children('.main-selected-list1').attr('attr-id')

                            if(treeNode.id == id){

                                selectedArr.eq(i).remove();

                            }


                        }


                    }


                },
                onCheck:function(e,treeId,treeNode){

                    //判断当前节点是否选中
                    if(treeNode.checked){

                        //选中,插入已选中的区域
                        //放到已选择类型中
                        var str = '<div class="main-selected-list">' +
                            '<div class="main-selected-list1" attr-id="' + treeNode.id + '">' + treeNode.name +
                            '</div>' +
                            '<div class="remove-selected">x</div>' +
                            '</div>';

                        $('.main-selected-block').append(str);


                    }else{

                        //未选中,从已选中的区域剔除
                        var selectedArr = $('.main-selected-list');

                        for(var i=0;i<selectedArr.length;i++){

                            var id = selectedArr.eq(i).children('.main-selected-list1').attr('attr-id')

                            if(treeNode.id == id){

                                selectedArr.eq(i).remove();

                            }


                        }


                    }


                }
            }
        };

        var treeArr = [];

        for(var i=0;i<arr.length;i++){
            var obj = {};
            obj.id = arr[i].id;
            obj.name = arr[i].name;
            obj.pId = arr[i].pid;
            obj.item = arr[i].item;
            treeArr.push(obj);
        }

        var zTreeObj = $.fn.zTree.init($("#allDev"), setting, treeArr);


    }

    //区域ztree
    function areaTree(arr){

        var setting = {

            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "ps", "N": "ps" },
                radioType:'all'
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{

                showIcon:false
            },
            callback: {
                //这个是点击后边的文字选中的事件
                onClick: function(e,treeId,treeNode){

                    //初始化已选中的设备
                    $('.main-selected-block').empty();

                    $.fn.zTree.init($("#allDev"), setting, []);

                    $('.noData').empty();

                    //勾选当前选中的节点
                    zTreeObj.checkNode(treeNode, !treeNode.checked, true);

                    //获取当前区域下的设备
                    getDevInfoCTypes();


                },
                onCheck:function(e,treeId,treeNode){

                    $.fn.zTree.init($("#allDev"), setting, []);

                    //初始化已选中的设备
                    $('.main-selected-block').empty();

                    $('.noData').empty();

                    //获取当前区域下的设备
                    getDevInfoCTypes();


                }
            }
        };

        var treeArr = [];

        for(var i=0;i<arr.length;i++){
            var obj = {};
            obj.id = arr[i].id;
            obj.name = arr[i].name;
            obj.pId = arr[i].pid;
            obj.item = arr[i].item;
            treeArr.push(obj);
        }

        var zTreeObj = $.fn.zTree.init($("#allPointer"), setting, treeArr);

    }

    //曲线数据
    function getLineData(){

        //获取设备
        var treeObj = $.fn.zTree.getZTreeObj("allDev");

        var nodes = treeObj.getCheckedNodes(true);

        //id集合
        var numStr = '';

        //name集合
        var nameStr = '';

        for(var i=0;i<nodes.length;i++){

            numStr += nodes[i].item + ',';

            nameStr += nodes[i].name + ',';

        }

        var prm = {

            //楼宇ID
            pId : sessionStorage.PointerID,
            //单位
            misc:sessionStorage.misc,
            //设备
            ids:numStr,
            //设备分项名称集合
            ns:nameStr,
            //开始时间
            sp:$('#spDT').val(),
            //结束时间
            ep:$('#epDT').val(),
            //时间间隔
            eType:1

        }

        //发送请求
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+"ZKDevicesShow/GetAnalysisAroChartViewDs",
            data:prm,
            timeout:_theTimes,
            beforeSend:function(){

                $('#rheader-content-16').showLoading();
            },
            success:function(result){

                $('#rheader-content-16').hideLoading();

                //图例
                option.legend.data = nodes[0].name;

                //x轴
                var dataX = [];

                //y轴
                var dataY = [];

                //确定是双轴还是单轴

                if(result.code == 0){

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    //首先判断是否包含冷价(true的时候包含，并且取最后一条);

                    if(result.anyEPRc){

                        //确定是双轴还是单轴
                        var ZhouArr = [

                            {
                                type: 'value',
                                name: '能耗',
                                min: 0,
                                max: '',
                                interval: '',
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            },
                            {
                                type: 'value',
                                name: '冷价',
                                min: 0,
                                max: 1,
                                interval: 0.1,
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            }

                        ];

                        for(var i=0;i<result.ys.length;i++){

                            var obj = {};

                            obj.name = nameUnite[i];

                            obj.type = 'line';

                            if(i != result.ys.length-1){

                                obj.yAxisIndex = 0;

                            }else{

                                obj.yAxisIndex = 1;

                            }


                            var yArr = [];

                            for(var j=0;j<result.ys[i].length;j++){

                                yArr.push(result.ys[i][j]);

                            }

                            obj.data = yArr;

                            dataY.push(obj);

                        }

                    }else{

                        //确定是双轴还是单轴
                        var ZhouArr = [

                            {
                                type: 'value',
                                name: '能耗',
                                min: 0,
                                max: '',
                                interval: '',
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            }

                        ];

                        for(var i=0;i<result.ys.length;i++){

                            var obj = {};

                            obj.name = nodes[i].name;

                            obj.type = 'line';

                            var yArr = [];

                            for(var j=0;j<result.ys[i].length;j++){

                                yArr.push(result.ys[i][j]);

                            }

                            obj.data = yArr;

                            dataY.push(obj);

                        }

                    }

                    option.yAxis = ZhouArr;

                    //根据最大值来确定纵坐标的间隔
                    var _max = 0;

                    var _interval = 0;

                    var max = result.maxVa;

                    var lengths = parseInt(max).toString().length -1;

                    var first = Number(max.substr(0,1)) + Number(1);

                    _max = first * Math.pow(10,lengths);

                    _interval = _max / 10;

                    option.yAxis[0].max = _max;

                    option.yAxis[0].interval = _interval;

                    option.xAxis.data = dataX;

                    option.series = dataY;

                    _mychart.setOption(option,true);


                }else{

                    var tip = '';

                    if(result.code == -1){

                        tip = result.msg;

                    }else{

                        tip = '暂时没有获取到能耗数据';

                    }

                    var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 25%;width: 100%">' + tip + '</div>'

                    $('#rheader-content-16').append(str);

                }


            },
            error:function(jqXHR, textStatus, errorThrown){

                $('#rheader-content-16').hideLoading();

                //错误提示信息
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
                }else{
                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
                }

            }
        })

    }

//表格数据
    function tableData(){

        //获取设备
        var treeObj = $.fn.zTree.getZTreeObj("allDev");

        var nodes = treeObj.getCheckedNodes(true);

        //id集合
        var numStr = '';

        //name集合
        var nameStr = '';

        for(var i=0;i<nodes.length;i++){

            numStr += nodes[i].item + ',';

            nameStr += nodes[i].name + ',';

        }

        var prm = {

            //楼宇ID
            pId : sessionStorage.PointerID,
            //单位
            misc:sessionStorage.misc,
            //设备
            ids:numStr,
            //设备分项名称集合
            ns:nameStr,
            //开始时间
            sp:$('#spDT').val(),
            //结束时间
            ep:$('#epDT').val(),
            //时间间隔
            eType:1

        }

        //发送请求
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+"ZKDevicesShow/GetAnalysisAroTableDs",
            data:prm,
            timeout:_theTimes,
            beforeSend:function(){

                $('#dateTables').showLoading();

            },
            success:function(result){

                $('#dateTables').hideLoading();

                var arr = [];

                if(result.code == 0){

                    arr = result.tbs;

                }

                _datasTable($('.table'),arr);


            },
            error:function(jqXHR, textStatus, errorThrown){

                $('#dateTables').hideLoading();

                //错误提示信息
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
                }else{
                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
                }

            }
        })

    }

})