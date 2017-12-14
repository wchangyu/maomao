$(function(){

    /*---------------------------------------------变量-------------------------------------------*/

    //类型vue对象

    var typeVue = new Vue({

        el:'#myApp33',
        data:{
            //id
            id:'',
            //类型编码
            typeNum:'',
            //类型名称
            typeName:'',
            //第一阶段补贴金额
            firstCost:'',
            //第二阶段补贴金额
            secondCost:'',
            //排序
            sort:''
        }

    });

    //存放所有
    var _allData = [];

    //记录当前选中行的id
    var _thisID = '';

    /*----------------------------------------------表格初始化-------------------------------------*/
    var tableListCol = [
        {
            title:'排序',
            data:'sort'
        },
        {
            title:'id',
            data:'id',
            className:'typeId'
        },
        {
            title:'类型编号',
            data:'type'
        },
        {
            title:'类型名称',
            data:'name'
        },
        {
            title:'第一阶段补贴金额',
            data:'money1'

        },
        {
            title:'第二阶段补贴金额',
            data:'money2'
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent":
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    conditionSelect();
    /*--------------------------------------------按钮事件----------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //新增
    $('.creatButton').click(function(){

        //初始化
        datailInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作
        abledOption();

    })

    //新增确定按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        optionButton('YWFZ/JBRenTypeAdd',false,'新增成功！','新增失败！');

    })

    //编辑
    $('#table-list').on('click','.option-edit',function(){

        //初始化
        datailInit();

        //数据绑定
        bindData($(this));

        //是否可操作
        abledOption();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

    })

    //编辑确定按钮
    $('#ADD-Modal').on('click','.bianji',function(){

        optionButton('YWFZ/JBRenTypeUpdate',true,'编辑成功！','编辑失败！');

    })

    //删除
    $('#table-list').on('click','.option-delete',function(){

        //初始化
        datailInit();

        //数据绑定
        bindData($(this));

        //是否可操作
        disabledOption();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'确定要删除吗？','','','','删除');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
    })

    //删除确定按钮
    $('#ADD-Modal').on('click','.shanchu',function(){

        optionButton('YWFZ/JBRenTypeDelete',true,'删除成功！','删除失败！');

    })


    /*--------------------------------------------其他方法----------------------------------------*/

    //获取所有加班类型
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JBRenTypeGetAll',
            data:{

                name:$('.JBLX').val()

            },
            timeout:_theTimes,
            success:function(result){

                _allData.length = 0;

                for(var i=0;i<result.length;i++){

                    _allData.push(result[i]);

                }

                _datasTable($('#table-list'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    }

    //页面初始化
    function datailInit(){

        //类型编码
        typeVue.typeNum = '';
        //类型名称
        typeVue.typeName = '';
        //第一阶段补贴金额
        typeVue.firstCost = '';
        //第二阶段补贴金额
        typeVue.secondCost = '';
        //排序
        typeVue.sort = '';

    }

    //登记、编辑方法、删除方法flag = true的时候
    function optionButton(url,flag,successMeg,errorMeg){

        var  prm = {

            //编号类型
            type:typeVue.typeNum,
            //类型名称
            name:typeVue.typeName,
            //第一阶段补贴金额
            money1:typeVue.firstCost,
            //第二阶段补贴金额
            money2:typeVue.secondCost,
            //排序
            sort:typeVue.sort

        };

        if(flag){

            prm.id = typeVue.id;
        }

        $.ajax({

            type:'post',
            url:_urls + url,
            data:prm,
            timeout:_theTimes,
            success:function(result){

                console.log(result);

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap',successMeg,'');

                    conditionSelect();

                    $('#ADD-Modal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap',errorMeg,'');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

    //数据绑定
    function bindData($this){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        _thisID = $this.parents('tr').children('.typeId').html();

        //遍历_allData,比较
        for(var i=0;i<_allData.length;i++){

            if(_thisID == _allData[i].id){

                //绑定数据
                typeVue.id = _allData[i].id;
                //编码
                typeVue.typeNum = _allData[i].type;
                //名称
                typeVue.typeName = _allData[i].name;
                //第一阶段补贴金额
                typeVue.firstCost = _allData[i].money1;
                //第二阶段补贴金额
                typeVue.secondCost = _allData[i].money2;
                //排序
                typeVue.sort = _allData[i].sort;

            }

        }

    }

    //不可操作
    function disabledOption(){

        $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

    }

    //可操作
    function abledOption(){

        $('#myApp33').find('input').removeAttr('readonly','readonly').removeClass('disabled-block');

    }
})