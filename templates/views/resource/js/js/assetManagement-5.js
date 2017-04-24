$(function(){
    /*--------------------------------------------初始全局变量----------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //存放所有列表中的数据
    var _allDateArr = [];
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
    //判断保修截止日标识是否有效
    var isQueryMaintain = 0;
    //判断使用截止日标识是否有效
    var isQueryLife = 0;
    //获取设备类型
    var prm = {
        'dcName':'',
        'userID':_userIdName
    }
    ajaxFun(prm,'YWDev/ywDMGetDCs',$('#leixing'),'dcName','dcNum',myApp33.options);
    if( myApp33.options.length !=0 ){
        myApp33.zcLX = myApp33.options[0].value;
    }
    //设备区域
    var prm1 = {
        'daName':'',
        'userID':_userIdName
    }
    ajaxFun(prm1,'YWDev/ywDMGetDAs',$('#quyu'),'daName','daNum',myApp33.options1);
    if( myApp33.options1.length !=0 ){
        myApp33.ssQY = myApp33.options1[0].value;
    }
    //设备系统
    var prm2 = {
        'dsName':'',
        'userID':_userIdName
    }
    ajaxFun(prm2,'YWDev/ywDMGetDSs',$('#xitong'),'dsName','dsNum',myApp33.options2);
    if( myApp33.options2.length !=0 ){
        myApp33.ssXT = myApp33.options2[0].value;
    }
    //设备部门
    var prm3 = {
        'ddName':'',
        'userID':_userIdName
    }
    ajaxFun(prm3,'YWDev/ywDMGetDDs',$('#bumen'),'ddName','ddNum',myApp33.options3);
    if( myApp33.options3 ){
        myApp33.ssbumen = myApp33.options3[0].value;
    }
    /*-------------------------------------------表格初始化------------------------------------------*/
    //资产浏览表格
    $('.table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "columns": [
            {
                title:'编号',
                data:'id',
                visible: false
            },
            {
                title:'设备编号',
                data:'dNum',
                className:'dNum'
            },
            {
                title:'设备名称',
                data:'dName',
            },
            {
                title:'规格型号',
                data:'spec',
            },
            {
                title:'设备类型',
                data:'dcName',
            },
            {
                title:'购置日期',
                data:'purDate',
                render:function timeForma(data){
                    return data.split(' ')[0].replace(/-/g,'/');
                }
            },
            {
                title:'保修年限',
                data:'maintain',
            },
            {
                title:'安装时间',
                data:'installDate',
                render:function timeForma(data){
                    return data.split(' ')[0].replace(/-/g,'/');
                }
            },
            {
                title:'使用年限',
                data:'life',
            },
            {
                title:'状态',
                data:'status',
                render:function(data, type, full, meta){
                    if( data == 1){
                        return '正常'
                    }else if( data ==2 ){
                        return '维修'
                    }else if( data == 3 ){
                        return '报废'
                    }
                }
            },
            {
                title:'设备部门',
                data:'ddName',
            },
            {
                title:'设备系统',
                data:'dsName',
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    conditionSelect();
    //给表格中的下载附链接
    for( var i=0;i<_allDateArr.length;i++ ){
        $('#information-datatables tbody').find('tr').eq(i).find('.option-edite').children('a').attr({'href':_allDateArr[i].docPath});
    }
    /*------------------------------------------按钮方法--------------------------------------------*/
    $('.table tbody')
        .on('click','.option-see',function(){
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
                    console.log(_allDateArr[i]);
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
    //状态选项卡
    $('.table-title').children('span').click(function(){
        $('.table-title').children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.main-contents-table').addClass('hide-block');
        $('.main-contents-table').eq($(this).index()).removeClass('hide-block');

    })
    /*-------------------------------------------其他方法--------------------------------------------*/
    //ajaxFun（select的值）
    function ajaxFun(parameter,url,select,text,num,arr){
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:parameter,
            success:function(result){
                //给select赋值
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                    var obj = {};
                    obj.text = result[i][text];
                    obj.value = result[i][num];
                    arr.push(obj);
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
        if( $('#baoxiu').val()!= '' ){
            isQueryMaintain = 1
        }else{
            isQueryMaintain = 0
        }
        if( $('#shiyong').val()  != '' ){
            isQueryLife = 1
        }else{
            isQueryLife = 0
        }
        //保修期为1，使用期为0
        var prm =   {
            'dName':filterInput[0],
            'spec':filterInput[1],
            'status':$('#zhuangtai').val(),
            'daNum':$('#quyu').val(),
            'ddNum':$('#bumen').val(),
            'dsNum':$('#xitong').val(),
            'dcNum':$('#leixing').val(),
            'isQueryMaintain':isQueryMaintain,
            'queryMaintainMonth':$('#baoxiu').val(),
            'isQueryLife':0,
            'queryLifeMonth':'',
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm,
            async:false,
            success:function(result){
                console.log(result);
                for(var i=0;i<result.length;i++){
                    _allDateArr.push(result[i]);
                }
                datasTable($('#information-datatables'),result);
            }
        })
        //保修期为0，使用期为1
        var prm1 =   {
            'dName':filterInput[0],
            'spec':filterInput[1],
            'status':$('#zhuangtai').val(),
            'daNum':$('#quyu').val(),
            'ddNum':$('#bumen').val(),
            'dsNum':$('#xitong').val(),
            'dcNum':$('#leixing').val(),
            'isQueryMaintain':0,
            'queryMaintainMonth':'',
            'isQueryLife':isQueryLife,
            'queryLifeMonth':$('#shiyong').val(),
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm1,
            async:false,
            success:function(result){
                console.log(result);
                for(var i=0;i<result.length;i++){
                    _allDateArr.push(result[i]);
                }
                datasTable($('#information-datatables1'),result);
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
})