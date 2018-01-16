$(function(){

    /*--------------------------------------------初始全局变量----------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //存放所有列表中的数据
    var _allDateArr = [];

    //页面插入station选择框
    addStationDom($('#bumen').parent());

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //新增资产vue对象
    var myApp33 = new Vue({
        'el':'#myApp33',
        'data':{
            'sbbm':'',
            'zcLX':'',
            'options':[],
            'mingcheng':'',
            'ssQY':'',
            'options1':[],
            'ssXT':'',
            'options2':[],
            'ssbumen':'',
            'options3':[],
            'zhuangtai':'1',
            'options4':[
                {text:'正常',value:1},
                {text:'维修',value:2},
                {text:'报废',value:3}
            ],
            'pingpai':'',
            'guige':'',
            'gongyingshang':'',
            'shengchanshang':'',
            'nianxian':'',
            'baoxiu':'',
            'pinyin':''
        }
    });
    //表格
    var _table = $('#information-datatables');
    //存放设备类型的所有数据
    var _allDataLX = [];
    //存放设备区域的所有数据
    var _allDataQY = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放设备部门的所有数据
    var _allDataBM = [];
    //获取设备类型
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#leixing'),'dcName','dcNum',myApp33.options);
    if( _allDataLX.length !=0 ){
        myApp33.zcLX = _allDataLX[0].dcNum;
    }
    //设备区域
    ajaxFun('YWDev/ywDMGetDAs',_allDataQY,$('#quyu'),'daName','daNum',myApp33.options1);
    if( _allDataQY.length !=0 ){
        myApp33.ssQY = _allDataQY[0].daNum;
    }
    //设备系统
    ajaxFun('YWDev/ywDMGetDSs',_allDataXT,$('#xitong'),'dsName','dsNum',myApp33.options2);
    if( _allDataXT.length !=0 ){
        myApp33.ssXT = _allDataXT[0].dsNum;
    }
    //设备部门
    ajaxFun('YWDev/ywDMGetDDs',_allDataBM,$('#bumen'),'ddName','ddNum',myApp33.options3);
    if( _allDataBM.length !=0 ){
        myApp33.ssbumen = _allDataBM[0].ddNum;
    }
    /*-------------------------------------------表格初始化------------------------------------------*/
    //资产浏览表格
    var _tables = _table.DataTable({
        "autoWidth": true,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        "columns": [
            {
                title:'编号',
                data:'id',
                visible: false
            },
            {
                title:'设备名称',
                data:'dName',
                className:'dName'
            },
            {
                title:'设备编码',
                data:'dNum',
                className:'dNum hidden',
                render:function timeForma(data){
                    return '<span>'+data+'</span>'
                }
            },
            {
                title:'设备编码',
                data:'dNewNum'

            },
            {
                title:'规格型号',
                data:'spec'
            },
            {
                title:'所属'+ __names.department,
                data:'ddName'
            },
            {
                title:'安装位置',
                data:'installAddress'
            },
            {
                title:'设备系统',
                data:'dsName'
            },
            {
                title:'设备类别',
                data:'dcName'
            },
            {
                title:'安装时间',
                data:'installDate',
                render:function timeForma(data){
                    return data.split(' ')[0].replace(/-/g,'/');
                }
            },
            {
                title:'保修年限',
                data:'maintain'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                'class':'caozuo',
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edite btn default btn-xs green-stripe'><a href='' title='右击文件另存为'>下载</a></span>"
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    conditionSelect();
    //给表格中的下载附链接
    for( var i=0;i<_allDateArr.length;i++ ){
        $('#information-datatables tbody').find('tr').eq(i).find('.option-edite').children('a').attr({'href':_allDateArr[i].docPath});
    }
    /*------------------------------------------按钮方法--------------------------------------------*/
    _table.find('tbody')
        .on('click','.option-see',function(){
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //上传文件隐藏
            $('#uploader').hide();
            //时间控件不弹出
            $('#gouzhi').attr('disabled',true);
            $('#anzhuang').attr('disabled',true);
            //获取绑定的值
            $('#myModal').find('.btn-primary').hide();
            moTaiKuang($('#myModal'));
            //绑定数据
            var $thisNum = $(this).parents('tr').find('.dNum').html();
            for(var i=0;i<_allDateArr.length;i++){
                if(_allDateArr[i].dNum == $thisNum){
                    myApp33.sbbm = _allDateArr[i].dNum;
                    myApp33.zcLX = _allDateArr[i].dcNum;
                    myApp33.mingcheng = _allDateArr[i].dName;
                    myApp33.pinyin = _allDateArr[i].dPy;
                    myApp33.ssQY = _allDateArr[i].daNum;
                    myApp33.ssXT = _allDateArr[i].dsNum;
                    myApp33.ssbumen = _allDateArr[i].ddNum;
                    myApp33.zhuangtai = _allDateArr[i].status;
                    myApp33.pingpai = _allDateArr[i].brand;
                    myApp33.guige = _allDateArr[i].spec;
                    myApp33.gongyingshang = _allDateArr[i].supName;
                    myApp33.shengchanshang = _allDateArr[i].prodName;
                    myApp33.nianxian = _allDateArr[i].life;
                    myApp33.baoxiu = _allDateArr[i].maintain;
                    $('#gouzhi').val(timeForma(_allDateArr[i].purDate));
                    $('#anzhuang').val( timeForma(_allDateArr[i].installDate));
                    $('#miaoshu').val(_allDateArr[i].description);
                    $('.lujing').html(_allDateArr[i].docPath);
                }
            }
        })
    //查询
    $('#selected').click(function(){
        conditionSelect();
    })
    /*-------------------------------------------其他方法--------------------------------------------*/
    //ajaxFun（select的值）
    function ajaxFun(url,allArr,select,text,num,arr){
        var prm = {
            'userID':_userIdName
        }
        prm[text] = '';
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:prm,
            success:function(result){
                //给select赋值
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                    var obj = {};
                    obj.text = result[i][text];
                    obj.value = result[i][num];
                    arr.push(obj);
                    allArr.push(result[i]);
                }
                select.append(str);
            }
        })
    }
    //查询功能
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm =   {
            'dName':filterInput[0],
            'spec':filterInput[1],
            'status':$('#zhuangtai').val(),
            'daNum':$('#quyu').val(),
            'ddNum':$('#bumen').val(),
            'dsNum':$('#xitong').val(),
            'dcNum':$('#leixing').val(),
            'isQueryDevDoc':1,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm,
            async:false,
            beforeSend:function(){
                jQuery('#loading').showLoading();
            },
            success:function(result){
                for(var i=0;i<result.length;i++){
                    _allDateArr.push(result[i]);
                }
                datasTable($('#information-datatables'),result);
                jQuery('#loading').hideLoading();
            }
        })
    }
    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //确定新增弹出框的位置
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //时间格式处理
    function timeForma(time){
        return time.split(' ')[0].replace(/-/g,'/');
    }

    //设置延迟时间
    var theTimes = 300000;
    //获取设备系统与设备类型对应的父子关系
    var _relativeArr1 = [];
    getSelectContent('YWDev/GetDevSysGroupClass', _relativeArr1);
    //获取车务段与车站对应的父子关系
    var _relativeArr2 = [];
    getSelectContent('YWDev/GetDevAreaGroupDep',_relativeArr2);
    function getSelectContent(url,arr){

        $.ajax({
            type: 'get',
            url: _urls + url,
            timeout: theTimes,
            success: function (data) {

                $(data).each(function(i,o){
                    arr.push(o);
                })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                }else{

                }

            }
        });
    };

    $('#xitong').change(function(){

        var value = $('#xitong').val();
        if(value == ''){
            var str = '<option value="">全部</option>';
            $(_allDataLX).each(function(i,o){

                str += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>'
            });
            $('#leixing').html('');
            $('#leixing').html(str);
            return false;
        }

        $(_relativeArr1).each(function(i,o){

            if(value == o.dsNum){
                var pushArr = o.devClasss;
                var str = '<option value="">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>'
                });
                console.log(str);
                $('#leixing').html('');
                $('#leixing').html(str);
                return false;
            }
        });
    });

    $('#quyu').change(function(){

        var value = $('#quyu').val();
        $('#bumen').parent().next().find('.add-select-block').hide();
        $('#bumen').parent().next().find('.add-input-select').find('span').html('全部');
        $('#bumen').parent().next().find('.add-input-select').find('span').attr('values','');
        $('.AbcSearch li').removeClass('action');
        $('.AbcSearch li').eq(0).addClass('action');

        if(value == ''){
            var str = '<option value="">全部</option>';
            $(_allDataBM).each(function(i,o){

                str += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>'
            });
            $('#bumen').html('');
            $('#bumen').html(str);
            //显示根据拼音选择车站选框
            stationArr = _allDataBM;
            classifyArrByInitial(stationArr,0);
            return false;
        }


        $(_relativeArr2).each(function(i,o){

            if(value == o.daNum){
                var pushArr = o.devDeps;
                stationArr = pushArr;
                classifyArrByInitial(stationArr,0);
                var str = '<option value="">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>'
                });
                //console.log(str);
                $('#bumen').html('');
                $('#bumen').html(str);
                return false;
            }
        });
    });
})