$(function(){

    //去重数组
    var uniqueArr = [];

    //保存treeNode
    var _treeNodeArr = [];


    /*--------------------------------时间插件-------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));


    /*---------------------------------ztree---------------------------*/

    ztreeData();

    //搜索功能

    var key = $("#key");

    searchKey();

    /*---------------------------------echart图------------------------*/

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
                saveAsImage: {}
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
            {
                name:'',
                type:'line',
                data:[]
            }
        ]
    };


    /*--------------------------------按钮功能---------------------------*/

    //全清
    $('#emptyAll').click(function(){

        $('.main-selected-block').empty();

        var zTree_Menu = $.fn.zTree.getZTreeObj("allPointer");

        zTree_Menu.checkAllNodes(false);

    })

    //删除每个的小按钮
    $('.main-selected-block').on('click','.remove-selected',function(){

        $(this).parent('.main-selected-list').remove();

        var values = $(this).parent('.main-selected-list').children('.main-selected-list1').attr('attr-id')

        uniqueArr.remove(values);

        var zTree_Menu = $.fn.zTree.getZTreeObj("allPointer");

        var node = zTree_Menu.getNodeByParam("id",values);

        zTree_Menu.selectNode(node,false);

        zTree_Menu.checkNode(node,false);


    })

    //查询
    $('#btn').click(function(){

        realTimeData();

    })


    /*---------------------------------其他方法--------------------------*/

    //ztree树
    function devTree(arr){

        var setting = {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "", "N": "" },
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

                    if(treeNode.returnType == 4){

                        //判断是否是选中状态
                        if(treeNode.checked){

                            //去重
                            if(uniqueArr.indexOf(treeNode.id)<0){

                                //放到已选择类型中
                                var str = '<div class="main-selected-list">' +
                                    '<div class="main-selected-list1" attr-id="' + treeNode.id + '">' + treeNode.name +
                                    '</div>' +
                                    '<div class="remove-selected">x</div>' +
                                    '</div>';

                                $('.main-selected-block').append(str);

                                uniqueArr.push(treeNode.id);


                            }

                        }else{

                            uniqueArr.remove(treeNode.id);

                            //遍历已选中的节点，移除
                            var list = $('.main-selected-list1');

                            for(var i=0;i<list.length;i++){

                                if(list.eq(i).attr('attr-id') == treeNode.id){

                                    list.eq(i).parent().remove();

                                }

                            }

                        }


                    }else{

                        return false;

                    }




                },
                onCheck:function(e,treeId,treeNode){

                    //点击前边的按钮选中事件
                    if(treeNode.returnType == 4){

                        //判断是否是选中状态
                        if(treeNode.checked){

                            //去重
                            if(uniqueArr.indexOf(treeNode.id)<0){

                                //放到已选择类型中
                                var str = '<div class="main-selected-list">' +
                                    '<div class="main-selected-list1" attr-id="' + treeNode.id + '">' + treeNode.name +
                                    '</div>' +
                                    '<div class="remove-selected">x</div>' +
                                    '</div>';

                                $('.main-selected-block').append(str);

                                uniqueArr.push(treeNode.id);

                            }

                        }else{

                            uniqueArr.remove(treeNode.id);

                            //遍历已选中的节点，移除
                            var list = $('.main-selected-list1');

                            for(var i=0;i<list.length;i++){

                                if(list.eq(i).attr('attr-id') == treeNode.id){

                                    list.eq(i).parent().remove();

                                }

                            }

                        }


                    }else{

                        return false;

                    }

                }
            }
        };

        var treeArr = [];

        var ifFirst = true;

        var firstId;

        //定义选中第一个有检测因子的区域索引
        var areaIndex = 0;

        for(var i=0;i<arr.length;i++){
            var obj = {};
            obj.id = arr[i].returnOBJID;
            obj.name = arr[i].returnOBJName;
            obj.pId = arr[i].parentOBJID;
            obj.returnType = arr[i].returnType;

            if(arr[i].returnType == 4 && ifFirst == true){

                ifFirst = false;

                firstId = arr[i].parentOBJID;

            }

            if(arr[i].returnType == 4){



                obj.nocheck = false;

            }else{

                obj.nocheck = true;

            }

            treeArr.push(obj);
        }

        var zTreeObj = $.fn.zTree.init($("#allPointer"), setting, treeArr);

        zTreeObj.expandAll(true);

        var nodes = zTreeObj.getNodes();


        //获取当前第一个有检测因子的区域的索引

        var areaArr = nodes[0].children[0].children[0].children;

        $(areaArr).each(function(i,o){

            if(o.id == firstId){


                areaIndex = i;

                return false;
            }
        });

        zTreeObj.checkNode(nodes[0].children[0].children[0].children[areaIndex].children[0],true,false,false);

        //条件查询
        realTimeData();


    }

    //获取ztree数据
    function ztreeData(){

        var prm = {

            //设备类型
            devTypeID:62,
            //楼宇ids
            pointerIDs:sessionStorage.PointerID

        }

        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/GetDevAreaByType',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                if(result){

                    devTree(result);

                }

            },

            error:function(){}

        })

    }

    //获取已选中的节点
    //获取勾选的节点
    function getCheckedNodeFun(){

        var treeObj = $.fn.zTree.getZTreeObj("allPointer");

        var nodes = treeObj.getCheckedNodes(true);

        return nodes;

    }

    //获取实时数据
    function realTimeData(){

        //loadding
        $('.right-top').showLoading();

        var arr = [];

        for(var i=0;i<getCheckedNodeFun().length;i++){

            arr.push(getCheckedNodeFun()[i].id);

        }

        var prm = {

            //检测因子
            typeIds:arr,

            //时间
            dt:moment().format('YYYY-MM-DD HH:mm:ss')

        }

        $.ajax({

            type:'post',

            url:_urls + 'EVNMo/GetEVNMoAndHysDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('.right-top').hideLoading();

                if(result.code == 0){

                    var str = '';

                    //生成实时数据块
                    for(var i=0;i<result.mos.length;i++){

                        var misc = (result.mos[i].misc == null)?'':result.mos[i].misc;

                        str += '<div class="real-time-list">' +
                                    '<p>' + result.mos[i].data +
                                        '<span>' + misc + '</span></p>' +
                                    '<div>' + result.mos[i].nt + '</div>' +
                                '</div>';


                    }

                    $('.real-time-block').eq(0).empty().append(str);

                    //生成chart图

                    var strChart = '';

                    for(var i=0;i<result.ys.length;i++){

                        strChart += '<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">' +

                            '  <div class="real-chart-list" id="' + 'chart-list' + i +
                            '" ></div>' +

                            '</div>';

                    }

                    $('.real-time-block').eq(1).empty().append(strChart);


                    //初始化echarts图，

                    var listChart = $('.real-chart-list');

                    for(var i=0;i<listChart.length;i++){

                        var idInfo = listChart.eq(i).attr('id');

                        drawChart(idInfo,result,i);

                    }


                }else{

                    console.log(result.msg)

                }



            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                $('.right-top').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }

    //ztree树搜索功能
    function searchKey(){

        //聚焦事件
        key.bind("focus",focusKey($('#key')));
        //失去焦点事件
        key.bind("blur", blurKey);
        //输入事件
        //key.bind("propertychange", searchNode);
        //输入事件
        key.bind("input", searchNode);

        function focusKey(e) {

            if ($('#key').hasClass("empty")) {

                $('#key').removeClass("empty");

            }
        }

        function blurKey(e) {

            //内容置为空，并且加empty类
            if ($('#key').get(0).value === "") {

                $('#key').addClass("empty");
            }
        }

        var lastValue='',nodeList=[];

        function searchNode(e) {

            //获取树
            var zTree = $.fn.zTree.getZTreeObj("allPointer");

            //去掉input中的空格（首尾）
            var value = $.trim($('#key').get(0).value);

            //设置搜索的属性
            var keyType = "name";

            if (lastValue === value)

                return;

            lastValue = value;

            if (value === "") {

                $('#tip').html('');
                //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
                //获取 zTree 的全部节点数据
                //如果input是空的则显示全部；
                zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;

                return;
            }
            //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
            // 的节点数据 JSON 对象集合
            nodeList = zTree.getNodesByParamFuzzy(keyType,value);

            nodeList = zTree.transformToArray(nodeList);

            if(nodeList==''){

                $('.tipe').html('抱歉，没有您想要的结果');

            }else{

                $('.tipe').html('');

            }

            updateNodes(true);

        }

        //选中之后更新节点
        function updateNodes(highlight) {

            var zTree = $.fn.zTree.getZTreeObj("allPointer");

            var allNode = zTree.transformToArray(zTree.getNodes());

            //指定被隐藏的节点 JSON 数据集合
            zTree.hideNodes(allNode);

            //遍历nodeList第n个nodeList

            for(var n in nodeList){

                findParent(zTree,nodeList[n]);

            }

            zTree.showNodes(nodeList);
        }

        //确定父子关系
        function findParent(zTree,node){

            //展开符合搜索条件的节点
            //展开 / 折叠 指定的节点
            zTree.expandNode(node,true,false,false);

            if(typeof node == 'object'){

                //pNode父节点
                var pNode = node.getParentNode();

            }

            if(pNode != null){

                nodeList.push(pNode);

                findParent(zTree,pNode);
            }
        }

    }

    //echart赋值
    function drawChart(idInfo,result,i){

        var mychart = echarts.init(document.getElementById(idInfo));

        //设置legend
        var legendArr = [];

        //设置x轴
        var dataX = [];

        for(var j=0;j<result.xs.length;j++){

            dataX.push(result.xs[j]);

        }

        //设置y轴
        var dataY = [];

        legendArr.push(result.ys[i].lgs);

        for(var z=0;z<result.ys[i].ys.length;z++){

            dataY.push(result.ys[i].ys[z]);

        }

        //配置x轴
        option.xAxis.data = dataX;

        //配置y轴
        option.series[0].data = dataY;

        //name
        option.series[0].name = legendArr[0];

        //legend
        option.legend.data = legendArr;

        mychart.setOption(option,true);

        console.log(dataY);

    }

})