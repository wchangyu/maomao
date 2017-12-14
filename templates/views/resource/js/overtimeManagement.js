$(function(){

    /*----------------------------------------------------变量---------------------------------------------*/

    var datailVue = new Vue({

        el:'#myApp33',
        data:{

            //车站名称
            station:'',
            //事由说明
            reason:'',
            //故障描述
            faultDes:'',
            //相关工单
            aboutGD:'',
            //计划开始时间
            stTime:'',
            //计划结束时间
            etTime:'',
            //施工高度
            buildHeight:'',
            //加班人
            overtimeP:'',
            //时长类型
            moneyType:''
        },
        methods:{

            timeFun:function(){

                var e = e||window.event;

                var el = $(e.srcElement);

                _dataComponentsFun(el);

            },
            blurFun:function(){

                var e = e||window.event;

                var el = $(e.srcElement);

                var view = el.parent().children().eq(0);

                el.off('changeDate');

                el.on('changeDate',function(){

                    datailVue[view[0].__v_model.descriptor.raw] = el.val()

                })

            }

        }

    })

    //所有车站数据
    var _allCZ = [];

    /*----------------------------------------------------表格初始化----------------------------------------*/
    var tableListCol = [

        {
            title:'加班编号',
            data:''
        },
        {
            title:'上报人姓名',
            data:''
        },
        {
            title:'上报人编号',
            data:''
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

    ]

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    conditionSelect();

    //加班人员表格
    var workerListCol = [

        {
            title:'人员编号',
            data:''
        },
        {
            title:'人员名称',
            data:''
        },
        {
            title:'人员类型',
            data:''
        }

    ];

    _tableInit($('#worker-list'),workerListCol,2,true,'','');

    //获取所有车站数据
    ajaxFun('YWDev/ywDMGetDDs', _allCZ);
    /*----------------------------------------------------按钮事件------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //新增
    $('.creatButton').click(function(){

        $('#ADD-Modal').find('.datatimeblock').click();

        //初始化
        datilInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //是否可操作


        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
    })

    //新增确定按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        optionButton('YWFZ/JiaBanAdd',true,'新增成功！','新增失败！');

    })


    /*----------------------------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JiaBanGetAll',
            data:{
                //加班编号
                gdCode:$('.overtimeBM').val(),
                //上报人编号
                createUserName:$('.shangName').val(),
                //上报人姓名
                createUser:$('.shangNum').val(),
                //当前用户部门编号
                userdepartNum:_loginUser.departNum,
                //当前用户id
                userID:_userIdNum,
                //当前用户角色
                b_UserRole:_userRole
            },
            timeout:_theTimes,
            success:function(result){

                console.log(result);

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    }

    //初始化
    function datilInit(){

        //车站名称
        datailVue.station = '';
        //事由说明
        datailVue.reason = '';
        //故障描述
        datailVue.faultDes = '';
        //相关工单
        datailVue.aboutGD = '';
        //计划开始时间
        datailVue.stTime = '';
        //计划结束时间
        datailVue.etTime = '';
        //施工高度
        datailVue.buildHeight = '';
        //加班人
        datailVue.overtimeP = '';
        //时长类型
        datailVue.moneyType = '';

    }

    //登记、编辑、删除
    function optionButton(url,flag,successMeg,errorMeg){

        var prm = {

            //车站名称
            ddName:datailVue.station,
            //车站编号
            ddNum:$('.station').attr('data-num'),
            //所属系统编号
            dcNum:'',
            //所属系统名称
            dcName:'',
            //事由说明
            reason:datailVue.reason,
            //故障描述
            descs:datailVue.faultDes,
            //报修工单编号
            gdCodeRef:'',
            //计划开始时间
            planBeginTime:datailVue.aboutGD,
            //计划结束时间
            planStopTime:datailVue.stTime,
            //上报人编号
            createUser:'',
            //上报人姓名
            createUserName:'',
            //时长类型
            moneyType:datailVue.moneyType,
            //高度
            height:datailVue.buildHeight,
            //所属部门编号
            departNum:'',
            //所属部门名称
            departName:'',
            //加班人员集合
            jbRenList:arr


        };

        //if(flag){
        //
        //    prm.id = typeVue.id;
        //}

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

    //获取所有车站
    function ajaxFun(url, allArr, select, text, num) {
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {

                console.log(result);

                //给select赋值
                //var str = '<option value=" ">请选择</option>';
                //for (var i = 0; i < result.length; i++) {
                //    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                //    allArr.push(result[i]);
                //}
                //select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
})