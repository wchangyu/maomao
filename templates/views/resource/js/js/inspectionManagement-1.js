$(function(){
    /*--------------------------------------------全局变量---------------------------------------------*/
    //登记弹出框的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            bianma:'',
            mingcheng:'',
            sbfl:'',
            options:[],
            miaoshu:'',
            cankaozhi:'',
            bjgx:'是/否',
            options1:[
                {text:'是/否',value:'是/否'},
                {text:'<',value:'<'},
                {text:'<=',value:'<='},
                {text:'=',value:'='},
                {text:'>=',value:'>='},
                {text:'>',value:'>'}
            ],
            beizhu:''
        }
    });

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //设备分类
    sbClass();

    //存放所有巡检步骤的数组
    var _allData = [];

    /*-------------------------------------------表格初始化--------------------------------------------*/
    var col = [
        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName',
            className:'mingcheng'
        },
        {
            title:'设备分类',
            data:'dcName',
        },
        {
            title:'步骤描述',
            data:'desc',
        },
        {
            title:'参考关系',
            data:'relation'
        },
        {
            title:'步骤参考值',
            data:'stValue',
        },
        {
            title:'备注',
            data:'remark',
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }
    ]
    _tableInit($('#scrap-datatables'),col,'1','flag','','');

    //赋值
    conditionSelect();

    /*--------------------------------------------表格按钮---------------------------------------------*/
    //查看
    $('#scrap-datatables')
        .on('click','.option-see',function(){
            //赋值
            bjOrCk($(this),$(this),true,'flag');
        })
        .on('click','.option-edite',function(){
            //赋值
            bjOrCk($(this),$(this),false,'');
        })
        .on('click','.option-delete',function(){
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            _thisRowBM = $(this).parents('tr').find('.bianma').html();
            //赋值
            $('#tmbm').val($(this).parents('tr').find('.bianma').html());
            $('#tmmc').val($(this).parents('tr').find('.mingcheng').html());
            _moTaiKuang($('#myModal3'), '确定要删除吗？', '', '' ,'', '删除');
        })
    /*--------------------------------------------按钮事件---------------------------------------------*/
    //查询
    $('#selected').click(function(){
        conditionSelect();
    })

    //添加按钮
    $('.creatButton').click(function(){
        //确定按钮添加登记类
        $('#myModal').find('.btn-primary').show().removeClass('bianji').addClass('dengji');
        //模态框显示
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');
        //初始化
        myApp33.bianma = '';
        myApp33.mingcheng = '';
        myApp33.sbfl = '';
        myApp33.miaoshu ='';
        myApp33.bjgx = myApp33.options1[0].value;
        myApp33.cankaozhi = '';
        myApp33.beizhu = '';
        var notOption = $('#myApp33').children().children().children('.input-blockeds').children();
        notOption.attr('disabled',false).removeClass('disabled-block');
        $('.bianma1').attr('disabled',true).addClass('disabled-block');
    })

    //登记确定按钮
    $('#myModal')
        .on('click','.dengji',function(){
            djOrBj('YWDevIns/ywDIAddDIItem','新增成功！','新增失败!','');
        })
        .on('click','.bianji',function(){
            djOrBj('YWDevIns/ywDIUptDIItem','编辑成功！','编辑失败!','flag');
        })

    //删除确定按钮
    $('#myModal3').on('click','.shanchu',function(){
        var prm = {
            ditNum :_thisRowBM,
            userID:_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywDIDelDIItem',
            data:prm,
            success:function(result){
                if(result == 99){
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除成功!', '');
                    $('#myModal3').modal('hide');
                    conditionSelect();
                }else{
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除失败!', '');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    })
    /*--------------------------------------------其他方法---------------------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var prm = {
            dcNum:$('#shebeileixing').val(),
            ditName:$('.filterInput').val(),
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            success:function(result){
                _allData.length = 0;
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                _datasTable($('#scrap-datatables'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }

    //设备类型
    function sbClass(){
        var prm = {
            dcNum:'',
            dcName:'',
            dcPy:'',
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDCs',
            timeout:_theTimes,
            data:prm,
            success:function(result){
                var str = '<option value="">全部</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].dcNum +
                        '">' + result[i].dcName +
                        '</option>'
                }
                //巡检步骤条件查询
                $('#shebeileixing').empty().append(str);
                //新增巡检步骤
                $('#sblx').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //查询、编辑赋值(flag表示是查看);
    function bjOrCk(thisEl,el,zhi,flag){
        //样式
        var $this = thisEl.parents('tr');
        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        //确定按钮显示，
        var $myModal = $('#myModal');
        //moTaiKuang($myModal);
        if(flag){
            //不显示确定按钮
            _moTaiKuang($myModal, '查看详情', 'flag', '' ,'', '');
        }else{
            //显示确定按钮
            _moTaiKuang($myModal, '编辑', '', '' ,'', '保存');
        }
        //赋值
        _thisRowBM = el.parents('tr').find('.bianma').html();
        for( var i=0;i<_allData.length;i++ ){
            if( _allData[i].ditNum == _thisRowBM ){
                myApp33.bianma = _allData[i].ditNum;
                myApp33.mingcheng = _allData[i].ditName;
                myApp33.sbfl = _allData[i].dcNum;
                myApp33.cankaozhi = _allData[i].stValue;
                myApp33.miaoshu = _allData[i].desc;
                myApp33.bjgx = _allData[i].relation;
                myApp33.beizhu = _allData[i].remark;
            }
        }
        //给所有的操作框添加不可操作属性
        var notOption = $('#myApp33').children().children().children('.input-blockeds').children();
        notOption.attr('disabled',zhi);
        if(flag){
            notOption.addClass('disabled-block');
            //$('.bianma').attr('disabled',true).addClass('disabled-block');
        }else{
            notOption.removeClass('disabled-block');
            $('.bianma1').attr('disabled',true).addClass('disabled-block');
            //添加编辑类
            $myModal.find('.btn-primary').removeClass('dengji').addClass('bianji');

        }
    }

    //登记、编辑(flag表示编辑)
    function djOrBj(url,successMeg,errorMeg,flag){
        //验证非空
        if(myApp33.mingcheng == '' || myApp33.sbfl == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
        }else{
            //获取填写的值
            var prm = {
                dcNum:myApp33.sbfl,
                dcName: $.trim($('#sblx').find('option:selected').html()),
                ditName:myApp33.mingcheng,
                description :myApp33.miaoshu,
                relation:myApp33.bjgx,
                stValue:myApp33.cankaozhi,
                remark:myApp33.beizhu,
                userID:_userIdName
            }
            if(flag){
                prm.ditNum = myApp33.bianma;
            }
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function( result ){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,successMeg, '');
                        $('#myModal').modal('hide');
                        conditionSelect();
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })
        }
    }
})