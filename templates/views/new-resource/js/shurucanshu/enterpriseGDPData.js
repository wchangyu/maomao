/**
 * Created by admin on 2017/12/6.
 */
$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //日期插件初始化
    _yearDate($('.datatimeblock'));


    //给页面赋初始年份
    var year1 = moment().subtract('5','years').format('YYYY');

    var year2 = moment().format('YYYY');

    $('.min').val(year1);

    $('.max').val(year2);


    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //邮箱验证
    Vue.validator('emailFormat',function(val){
        val=val.replace(/^\s+|\s+$/g,'');
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val);
    })

    //新增地点登记对象
    var user = new Vue({
        el:'#user',
        data:{
            addressnum:'',
            addressname:'',
            build:'',
            plies:'',
            department:'',
            remarks:''
        },
        methods:{

        }
    });

    //获取企业
    getDepartment($('#company'));

    getDepartment($('#djbm'));



    //存放所有数据的数组
    var _allPersonalArr = [];

    //存放要删除的ID
    var removeId = -1;



    /*----------------------------------------表格初始化-----------------------------------------*/
    var table = $('#personal-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        "iDisplayLength":50,//默认每页显示的条数,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'',
                data:'id',
                class:'hidden'
            },
            {
                title:'企业名称',
                data:'enterpriseName'
            },
            {
                title:'年份',
                data:'dataDate',
                render:function(data, type, full, meta){

                    return moment(data).format('YYYY');
                }
            },
            {
                title:'GDP(万元)',
                data:'countGDP'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent":
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

            }
        ]
    });

    table.buttons().container().appendTo($('.excelButton'),table.table().container());

    //数据
    //conditionSelect();
    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });
    //数据初始化
    conditionSelect();


    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');

        $('#user .year').val('');

        $('#user .count-data').val('');

        var disableArea = $('#user').find('.input-blockeds');
        disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('select').attr('disabled',false).removeClass('disabled-block');

        disableArea.children('input').attr('readonly',false);
        disableArea.children('select').attr('readonly',false);

    });

    //操作确定按钮
    $('#myModal')
    //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('EnergyAnalyzeV2/PostEnergyDingEData','登记成功!','登记失败!');
        })
        //删除确定按钮功能
        .on('click','.shanchu',function(){
            //发送请求
            editOrView1('EnergyAnalyzeV2/DeleEnergyDingEData','删除成功!','删除失败!');
        });

    //表格操作
    $('#personal-table tbody')
    //查看详情
        //编辑
        .on('click','.option-edit',function(){

            //详情框
            moTaiKuang($('#myModal'),'编辑');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this));

        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData($(this),'flag');

            removeId = $(this).parents('tr').children('.hidden').html();

            $('#myModal select').attr('disabled','disabled');
            $('#myModal input').attr('disabled','disabled');
            $('#myModal select').attr('readonly','readonly');
            $('#myModal input').attr('readonly','readonly');

        });
    /*---------------------------------------其他方法--------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    };

    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
    }

    //获取条件查询
    function conditionSelect(){
        //获取条件

        //企业id
        var enterpriseID = $('#company').val();

        //开始日期
        var st = $('.min').val() + '-01-01';
        //结束日期
        var et = (parseInt($('.max').val()) + 1) + '-01-01';

        var prm = {
            "enterpriseID": enterpriseID,
            "startTime": st,
            "endTime": et,
            "f_InputType": 1
        };

        $.ajax({
            type:'post',
            url:_urls + 'EnergyAnalyzeV2/GetEnterpriseInputData',
            data:prm,
            success:function(result){
                console.log(result);

                //无数据
                if(result == null){

                    return false;
                }

                _allPersonalArr.length = 0;

                //企业名称
                var enterpriseName = result.enterpriseName;

                $(result.enterpriseDatas).each(function(i,o){

                    var obj = {};

                    //企业名称
                    obj.enterpriseName = enterpriseName;
                    //本行ID
                    obj.id = o.pK_ID;
                    //获取日期
                    obj.dataDate = o.dataDate;
                    //获取数据
                    obj.countGDP = o.data;

                    _allPersonalArr.push(obj);

                });
                //重构表格
                datasTable($('#personal-table'),_allPersonalArr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //编辑、登记方法
    function editOrView(url,successMeg,errorMeg,flag,flag1){

        //企业ID
        var enterpriseName = $('#myModal #djbm').val();
        //时间
        var year = $('#myModal .year').val();
        //数据
        var data = $('#myModal .count-data').val();

        //判断必填项是否为空
        if( enterpriseName == ''||year == ''||data == ''){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{

            //判断是编辑、登记、还是删除
            var prm = {};
            if(flag){
                prm = {
                    "userID":_userIdName
                };

                //获取当前ID
                prm.id = removeId;

            }else{
                //获取部门名称
                var departName =  $("#djbm").find("option:selected").text();
                //获取楼宇名称
                var buildName =  $("#building").find("option:selected").text();
                prm = {
                    "fK_Enterprise_Input": enterpriseName,
                    "enterpriseName": departName,
                    "f_InputType": 1,
                    "enterpriseDatas": [
                        {
                            "pK_ID": 0,
                            "dataDate": year + '-01-01',
                            "data": data
                        }
                    ],
                    "userID":_userIdName
                };


                if(flag1){
                    //获取当前ID
                    for(var i=0;i<_allPersonalArr.length;i++){
                        if(_allPersonalArr[i].locnum == user.addressnum){

                            prm.id = _allPersonalArr[i].id;
                        }
                    }
                }

            }
            //发送数据
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        //提示登记成功
                        tipInfo($('#myModal1'),'提示',successMeg,'flag');
                        $('#myModal').modal('hide');
                    }else if(result == 3){
                        //提示登记失败
                        tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                    }
                    conditionSelect();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })


        }
    }

    //删除方法
    function editOrView1(url,successMeg,errorMeg){

        console.log(33);

            var prm = {};

                prm = {
                    "UserID":_userIdName
                };

                //获取当前ID
                prm.PK_ID = removeId;

            //发送数据
            $.ajax({
                type:'post',
                url:_urls + url,
                data:JSON.stringify(prm),
                contentType:'application/json',
                success:function(result){
                    if(result == 99){
                        //提示登记成功
                        tipInfo($('#myModal1'),'提示',successMeg,'flag');
                        $('#myModal').modal('hide');
                    }else if(result == 3){
                        //提示登记失败
                        tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                    }
                    conditionSelect();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })

    }

    //查看、删除绑定数据
    function bindingData(el,flag){

        var thisBM = el.parents('tr').children('.hidden').html();
        console.log(_allPersonalArr);
        console.log(thisBM);
        //根据工号绑定数据
        for(var i=0;i<_allPersonalArr.length;i++){
            if(_allPersonalArr[i].id == thisBM){
                console.log(_allPersonalArr[i]);
                //绑定数据
                $('#myModal .year').val(_allPersonalArr[i].dataDate.split('-')[0]);

                $('#myModal .count-data').val(_allPersonalArr[i].countGDP);

                var enterpriseID = $('#company').val();

                $('#myModal .djbm').val(enterpriseID);

            }
        }


    }

    //获取企业
    function getDepartment(el){

        var companyArr =  getPointerTree();

        var html = '';
        //遍历企业放入页面中
        $(companyArr).each(function(i,o){
            //不是根节点
            if(o.nodeType != 0){

                html += '<option value="' + o.id +
                    '">' + o.name + '</option>'
            }
        })

        el.html(html);
    }

});