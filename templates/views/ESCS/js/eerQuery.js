$(function(){

    /*--------------------------------------时间插件-----------------------------------*/

    //初始化时间控件

    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM-DD');

    $('#spDT').val(nowTime);

    $('#epDT').val(moment(nowTime).add(1,'d').format('YYYY-MM-DD'));

    _dataComponentsFun($('.abbrDT'));


    /*---------------------------------------表格初始化----------------------------------*/

    var col = [];

    if(sessionStorage.misc == 1){

        //KW/KW
        col = [

            {
                title:'对象',
                data:'dtObj'
            },
            {
                title:'整体值',
                data:'totalV'
            },
            {
                title:'平均值',
                data:'agv'
            },
            {
                title:'10%最优平均值',
                data:'meritAgV'
            },
            {
                title:'	10%最差平均值',
                data:'inferiorAgV'
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

                    readOnly:true,

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

                                tdStr += opt.series[j].data[i]==undefined?'-':Number(opt.series[j].data[i]).toFixed(1);

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
        yAxis: {
            type: 'value'
        },
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

            ids += arr[i].tag + ',';

            names += arr[i].name + ',';

            namesArr.push(arr[i].name);

        }

        var prm = {
            //楼宇
            pId:sessionStorage.PointerID,
            //单位
            //misc:sessionStorage.misc,
            //对象选择id
            splitTagStr:ids,
            //对象选择名称
            splitNtStr:names,
            //开始事件
            sp:$('#spDT').val(),
            //结束事件
            ep:$('#epDT').val(),
            //时间间隔
            eTypeStr:$('#eType').val()

        }


        var url = sessionStorage.apiUrlPrefix + 'ZKEERcQ/ExportGetEERShow?pId=' + sessionStorage.PointerID +

            //'&misc=' + sessionStorage.misc +

            '&splitTagStr=' + ids +

            '&splitNtStr=' + encodeURIComponent(names) +

            '&sp=' + $('#spDT').val() +

            '&ep=' + $('#epDT').val() +

            '&eTypeStr=' + $('#eType').val()

        $.ajax({

            type:'get',

            url: sessionStorage.apiUrlPrefix + 'ZKEERcQ/ExportGetEERShow',

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
            obj.open = true;
            obj.tag = arr[i].tag;

            if(i == 0){

                obj.checked = true;

            }

            treeArr.push(obj);
        }

        var zTreeObj = $.fn.zTree.init($("#treeView"), setting, treeArr);

        //获取第一个元素下的所有节点，然后选中

        conditionSelect();

    }

    //条件选择
    function conditionSelect(){

        //获取选中的节点
        var arr = getCheckedNodeFun();

        //勾选的id
        var ids = '';

        //勾选的名称
        var names = '';

        //用于echart赋值
        var namesArr = [];

        for(var i=0;i<arr.length;i++){

            ids += arr[i].tag + ',';

            names += arr[i].name + ',';

            namesArr.push(arr[i].name);

        }

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //单位
            misc:sessionStorage.misc,
            //对象选择id
            splitTagStr:ids,
            //对象选择名称
            splitNtStr:names,
            //开始事件
            sp:$('#spDT').val(),
            //结束事件
            ep:$('#epDT').val(),
            //时间间隔
            eTypeStr:$('#eType').val()

        }

        $('.noDataTip').remove();

        _datasTable($('#avg_table'),[]);

        //echarts数据
        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'ZKEERcQ/GetEERcQDs',

            data:prm,

            timeout:_theTimes,

            beforeSend:function(){

                $('#chartBlock').showLoading();

                $('#avg_table').showLoading();


            },

            complete:function(){

                $('#chartBlock').hideLoading();

                $('#avg_table').hideLoading();

            },

            success:function(result){

                var nameUnite = [];

                //确定横坐标
                var dataX = [];

                //确定纵坐标
                var dataY = [];

                if(result.code == 0){

                    //确定legend(加单位)
                    nameUnite = result.lgs;

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

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

                }else{

                    option.yAxis = [

                        {
                            name:'能耗',

                            type:'value'
                        }

                    ]

                    var tip = '暂时没有获取到能效数据';

                    var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">' + tip + '</div>'

                    $('#chartBlock').append(str);

                    console.log('异常错误(能效分析):' + result.msg);

                }

                option.legend.data = nameUnite;

                option.xAxis.data = dataX;

                option.series = dataY;

                mychart.setOption(option,true);

                var arr = [];

                if(result.tbs != null && result.tbs.length>0){

                    //arr = result.tbs

                    for(i=0;i<result.tbs.length;i++){

                        var obj = {};

                        obj.dtObj = result.tbs[i].dtObj==null?'-':result.tbs[i].dtObj;

                        obj.totalV = result.tbs[i].totalV==null?'-':result.tbs[i].totalV;

                        obj.agv = result.tbs[i].agv==null?'-':result.tbs[i].agv;

                        obj.meritAgV = result.tbs[i].meritAgV==null?'-':result.tbs[i].meritAgV;

                        obj.inferiorAgV = result.tbs[i].inferiorAgV==null?'-':result.tbs[i].inferiorAgV;

                        arr.push(obj);

                    }

                }

                _datasTable($('.table'),arr);

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

    }

    //获取ztree数据
    function ztreeData(){

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'ZKEERcQ/GetEEFTrv',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                if(result.code == 0){

                    if(result.eers.length>0){

                        devTree(result.eers);

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