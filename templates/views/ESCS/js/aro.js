$(function(){

    /*--------------------------------------时间插件-----------------------------------*/

    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM-DD');

    $('#spDT').val(nowTime);

    $('#epDT').val(moment(nowTime).add(1,'d').format('YYYY-MM-DD'));

    //初始化时间控件
    _timeYMDComponentsFun11($('.abbrDT'));

    /*---------------------------------------表格初始化----------------------------------*/

    var col = [];

    if(sessionStorage.misc == 1){

        //KW/KW
        col = [

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


    }else if(sessionStorage.misc == 2){

        //KW/RT
        col = [

            {
                title:'对象',
                data:'kpiN'
            },
            {
                title:'总值<span class="Lunite">(KWH/RTH)</span>',
                data:'totalV'
            },
            {
                title:'峰值<span class="Lunite">(KWH/RTH)</span>',
                data:'maxV'
            },
            {
                title:'出现时间',
                data:'maxDT'
            },
            {
                title:'谷值<span class="Lunite">(KWH/RTH)</span>',
                data:'minV'
            },
            {
                title:'出现时间',
                data:'minDT'
            },
            {
                title:'平均值<span class="Lunite">(KWH/RTH)</span>',
                data:'averV'
            }

        ]


    }

    _tableInit($('#avg_table'),col,2,true,'','',true,'','',false);

    /*---------------------------------------echarts-----------------------------------*/

    var mychart = echarts.init(document.getElementById('chartBlock'));

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

                    optionToContent: function(opt) {

                        //thead
                        var table = '<table class="table table-striped table-advance table-hover  dataTable no-footer">';

                        var tables = '</table>';

                        var thead = '<thead>';

                        var theads = '</thead>';

                        var tbody = '<tbody>';

                        var tbodys = '</tbody>';

                        //th
                        var thStr = '<tr><th>时间</th>';

                        for(var i=0;i<opt.series.length;i++){

                            thStr += '<th>';

                            thStr += opt.series[i].name;

                            thStr += '</th>'

                        }

                        thStr += '</tr>';

                        //td
                        var tdStr = '';

                        for(var i=0;i<opt.xAxis[0].data.length;i++){

                            tdStr += '<tr>';

                            //时间
                            tdStr += '<td>';

                            tdStr += opt.xAxis[0].data[i];

                            tdStr += '</td>';

                            for(var j=0;j<opt.series.length;j++){

                                tdStr += '<td>';

                                tdStr += opt.series[j].data[i]==undefined?'-':opt.series[j].data[i];

                                tdStr += '</td>';

                            }

                            tdStr += '</tr>';


                        }

                        return table + thead + thStr + theads + tbody + tdStr + tbodys + tables;



                    }

                },

                //保存图片
                saveAsImage:{},
                //还原
                restore:{},

                magicType:{

                    type: ['bar','line']

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

    //树加载完之后默认加载数据
    ztreeData();

    /*---------------------------------------按钮事件-----------------------------------*/

    //条件查询
    $('#aroBtn').click(function(){

        //条件查询
        conditionSelect();

    })

    //对象选择切换
    $('#btnSel').click(function(){

        $('#treeCNT').slideToggle();

        //防止向上冒泡
        return false;

    })

    //窗口重置
    window.onresize = function(){

        if(mychart){

            mychart.resize();

        }

    }

    //点击其他地方，对象选择下拉框消失
    $(document).click(function(e){

        var targetDom = e.target.classList.value;

        //console.log(e);

        if(targetDom.indexOf('ztree')>=0 ||$(e.target).parents('#treeView').length != 0 ){

            return false;

        }else{

            $('#treeCNT').slideUp();

        }

    })

    //删除已选中设备
    //删除每个的小按钮
    $('.main-selected-block').on('click','.remove-selected',function(){

        $(this).parent('.main-selected-list').remove();

        var values = $(this).parent('.main-selected-list').children('.main-selected-list1').attr('attr-id')

        var zTree_Menu = $.fn.zTree.getZTreeObj("treeView");

        var node = zTree_Menu.getNodeByParam("id",values);

        zTree_Menu.selectNode(node,false);

        zTree_Menu.checkNode(node,false);


    })

    //全清
    $('#emptyAll').click(function(){

        $('.main-selected-block').empty();

        var zTree_Menu = $.fn.zTree.getZTreeObj("treeView");

        zTree_Menu.checkAllNodes(false);

    })

    //导出数据
    $('#exportBtn').click(function(){

        //获取选中的节点
        var arr = getCheckedNodeFun();

        //勾选的id
        var ids = '';

        //勾选的名称
        var names = '';

        //用于echart赋值
        var namesArr = [];

        for(var i=0;i<arr.length;i++){

            ids += arr[i].item + '(' + arr[i].name + ')' + ',';

            names += arr[i].name + ',';

            namesArr.push(arr[i].name);

        }

        var prm = {
            //楼宇
            pId:sessionStorage.PointerID,
            //单位
            misc:sessionStorage.misc,
            //对象选择id
            ids:ids,
            //对象选择名称
            ns:encodeURIComponent(names),
            //开始事件
            sp:$('#spDT').val(),
            //结束事件
            ep:$('#epDT').val(),
            //时间间隔
            eType:$('#eType').val()

        }


        var url = sessionStorage.apiUrlPrefix + 'AnalysisAro/ExportAnalysisAroChartVie?pId=' + sessionStorage.PointerID +

            '&misc=' + sessionStorage.misc +

            '&ids=' + ids +

            '&ns=' + encodeURIComponent(names) +

            '&sp=' + $('#spDT').val() +

            '&ep=' + $('#epDT').val() +

            '&eType=' + $('#eType').val()

        $.ajax({

            type:'get',

            url: sessionStorage.apiUrlPrefix + 'AnalysisAro/ExportAnalysisAroChartVie',

            data:prm,

            //发送数据之前
            beforeSend:function(){

                $('#exportBtn').html('导出中...').attr('disabled',true);

            },

            //发送数据完成之后
            complete:function(){

                $('#exportBtn').html('导出数据').attr('disabled',false);

            },

            timeout:_theTimes,

            success:function(result){
                window.open(url, "_self", true);

            },

            error:_errorFun1


        })

    })

    /*---------------------------------------其他方法----------------------------------*/

    //ztree树
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

                        var arr = [];

                        arr.push(treeNode);

                        if(treeNode.isParent){

                            for(var i=0;i<treeNode.children.length;i++){

                                arr.push(treeNode.children[i]);

                            }

                        }

                        var str = '';

                        for(var i=0;i<arr.length;i++){

                            str += '<div class="main-selected-list">' +
                                '<div class="main-selected-list1" attr-id="' + arr[i].id + '">' + arr[i].name +
                                '</div>' +
                                '<div class="remove-selected">x</div>' +
                                '</div>';

                        }

                        //选中,插入已选中的区域
                        //放到已选择类型中
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
            //obj.open = true;
            treeArr.push(obj);
        }

        var zTreeObj = $.fn.zTree.init($("#treeView"), setting, treeArr);


        var node = zTreeObj.getNodes();

        //console.log(node);

        var node1 = '';

        //默认显示第一个子元素

        //getChildNodeFirst(node);
        //
        //function getChildNodeFirst(node){
        //
        //    if(node.isParent){
        //
        //        node1 = node.children[0];
        //
        //        getChildNodeFirst(node1);
        //
        //    }
        //
        //}
        //
        //zTreeObj.setting.callback.onClick(null, zTreeObj.setting.treeId, node1);

        //获取第一个元素下的所有节点，然后选中


        //默认显示最外边的父元素
        for(var i=0;i<node.length;i++){

            zTreeObj.checkNode(node[i],true);

        }

        conditionSelect();

    }

    //条件选择
    function conditionSelect(){

        //loadding
        $('.content-top').showLoading();

        $('#avg_table').showLoading();

        //获取选中的节点
        var arr = getCheckedNodeFun();

        //勾选的id
        var ids = '';

        //勾选的名称
        var names = '';

        //用于echart赋值
        var namesArr = [];

        for(var i=0;i<arr.length;i++){

            ids += arr[i].item + ',';

            names += arr[i].name + ',';

            namesArr.push(arr[i].name);

        }

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //单位
            misc:sessionStorage.misc,
            //对象选择id
            ids:ids,
            //对象选择名称
            ns:encodeURIComponent(names),
            //开始事件
            sp:$('#spDT').val(),
            //结束事件
            ep:$('#epDT').val(),
            //时间间隔
            eType:$('#eType').val()

        }

        $('.noDataTip').remove();

        _datasTable($('#avg_table'),[]);

        //echarts数据
        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'AnalysisAro/GetAnalysisAroChartViewDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                //loadding
                $('.content-top').hideLoading();

                if(result.code == 0){

                    //确定legend(加单位)
                    var nameUnite = [];

                    for(var i=0;i<namesArr.length;i++){

                        var str = namesArr[i] + '(' + result.aroMs[i] + ')';

                        nameUnite.push(str);

                    }

                    option.legend.data = nameUnite;

                    //确定横坐标
                    var dataX = [];

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    option.xAxis.data = dataX;

                    //确定纵坐标
                    var dataY = [];

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

                            obj.name = nameUnite[i];

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

                    option.series = dataY;

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

                }else{

                    option.yAxis = [

                        {
                            name:'能耗',

                            type:'value'
                        }

                    ]

                    var tip = '';

                    if(result.code == -1){

                        tip = result.msg;

                    }else{

                        tip = '暂时没有获取到能耗数据';

                    }

                    var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">' + tip + '</div>'

                    $('#chartBlock').append(str);

                    console.log('异常错误(能耗分析):' + result.msg);

                }

                mychart.setOption(option,true);

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                $('.content-top').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

        //表格数据
        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'AnalysisAro/GetAnalysisAroTableDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#avg_table').hideLoading();

                if(result.code == 0){

                    _datasTable($('#avg_table'),result.tbs);

                }else{

                    console.log('异常错误(能耗分析):' + result.msg);

                }

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                $('#avg_table').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }
        })

    }

    //获取ztree数据
    function ztreeData(){

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'AnalysisAro/GetAroItemTVs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                if(result.code == 0){

                    if(result.tvs.length>0){

                        devTree(result.tvs);

                    }

                }
            },

            error:function(){}

        })

    }

    //获取勾选的节点
    function getCheckedNodeFun(){

        var treeObj = $.fn.zTree.getZTreeObj("treeView");

        var nodes = treeObj.getCheckedNodes(true);

        return nodes;

    }


})