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
            //第三阶段金额
            thirdCost:'',
            //第四阶段金额
            fourthCost:'',
            //排序
            sort:''
        },
        methods:{

            naturalNumber:function(attr){

                var mny = /^[1-9]\d*(\.\d+)?$/;

                var $this = $(this)[0][attr];

                var e = e||window.event;

                var error = $(e.srcElement).parents('li').find('.multiple-condition');

                if( $this == '' ){

                    error.show();

                }else{

                    if(mny.test($this)){

                        error.hide();

                    }else{

                        error.show();

                    }

                }


            },

            keepTwo:function(attr){

                var $this = $(this)[0][attr];

                if($this == ''){

                    $this = 0;

                }

                typeVue[attr] = Number($this).toFixed(2);

            },

            intNumber:function(attr){

                var mny = /^\d+$/;

                var $this = $(this)[0][attr];

                var e = e||window.event;

                var error = $(e.srcElement).parents('li').find('.multiple-condition');

                if( $this == '' ){

                    error.show();

                }else{

                    if(mny.test($this)){

                        error.hide();

                    }else{

                        error.show();

                    }

                }

            }

        }

    });

    //存放所有
    var _allData = [];

    //记录当前选中行的id
    var _thisID = '';

    /*----------------------------------------------表格初始化-------------------------------------*/
    var tableListCol = [
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
            title:'第三阶段补贴金额',
            data:'money3'
        },
        {
            title:'第四阶段补贴金额',
            data:'money4'
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-id='" + full.id + "'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe' data-id='" + full.id + "'>删除</span>"

            }

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

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        datailInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作
        abledOption();

        //loadding消失
        $('#theLoading').modal('hide');

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
        //第三阶段金额
        typeVue.thirdCost = '';
        //第四阶段金额
        typeVue.fourthCost = '';
        //排序
        typeVue.sort = '';

        //提示消息不显示
        $('.multiple-condition').hide();

    }

    //登记、编辑方法、删除方法flag = true的时候
    function optionButton(url,flag,successMeg,errorMeg){

        //非空验证
        if(typeVue.typeName == '' || typeVue.firstCost == '' || typeVue.secondCost == '' || typeVue.thirdCost == '' || typeVue.fourthCost == ''){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写红色必填项！', '');

        }else{

            //格式验证
            var o = $('#ADD-Modal').find('.multiple-condition');

            var isShow = false;

            for(var i=0;i< o.length;i++){

                if(o.eq(i).css('display') != 'none'){

                    isShow = true;

                    break;

                }

            }

            if(isShow){

                _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'格式错误！', '');

            }else{

                var  prm = {

                    //编号类型
                    //type:typeVue.typeNum,
                    //类型名称
                    name:typeVue.typeName,
                    //第一阶段补贴金额
                    money1:typeVue.firstCost,
                    //第二阶段补贴金额
                    money2:typeVue.secondCost,
                    //第三阶段金额
                    money3:typeVue.thirdCost,
                    //第四阶段金额
                    money4:typeVue.fourthCost,
                    //排序
                    //sort:typeVue.sort

                };

                if(flag){

                    prm.id = typeVue.id;
                }

                $.ajax({

                    type:'post',
                    url:_urls + url,
                    data:prm,
                    timeout:_theTimes,
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },
                    complete: function () {
                        $('#theLoading').modal('hide');
                    },
                    success:function(result){

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


        }

    }

    //数据绑定
    function bindData($this){

        //loadding显示
        $('#theLoading').modal('show');

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        _thisID = $this.attr('data-id');

        //遍历_allData,比较
        for(var i=0;i<_allData.length;i++){

            if(_thisID == _allData[i].id){

                //绑定数据
                typeVue.id = _allData[i].id;
                //编码
                //typeVue.typeNum = _allData[i].type;
                //名称
                typeVue.typeName = _allData[i].name;
                //第一阶段补贴金额
                typeVue.firstCost = _allData[i].money1;
                //第二阶段补贴金额
                typeVue.secondCost = _allData[i].money2;
                //第三阶段金额
                typeVue.thirdCost = _allData[i].money3;
                //第四阶段金额
                typeVue.fourthCost = _allData[i].money4;
                //排序
                //typeVue.sort = _allData[i].sort;

            }

        }

        //loadding消失
        $('#theLoading').modal('hide');

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