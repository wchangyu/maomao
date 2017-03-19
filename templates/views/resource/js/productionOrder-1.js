$(function(){
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //获得用户名
    var userIdName = sessionStorage.getItem('userName');
    //设置初始时间
    var initStart = moment().format('YYYY/MM/DD');
    var initEnd = moment().add(1,'day').format('YYYY/MM/DD');
    //var initStart = '2017/02/28';
    //var initEnd = '2017/03/01';
    $('.min').val(initStart);
    $('.max').val(initEnd);
    //查看详细信息的Vue形式
    workDones = new Vue(    {
        el:'#workDone',
        data:{
            weixiukeshis:'',
            baoxiukeshis:'',
            baoxiudidians:'',
            weixiushixiangs:'',
            baoxiudianhua:'',
            baoxiuren:'',
            beizhus:'',
            wxbeizhu:''
        }
    })
    //自定义验证器
    //手机号码
    Vue.validator('telephones', function (val) {
        //return /(^(\d{3,4}-)?\d{7,8})$|(^0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8})$/.test(val)
        return /^[0-9]*$/.test(val)
    })
    //验证必填项（非空）
    Vue.validator('persons', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })
    //登记工单信息
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:'0',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sections:'',
            remarks:''
        },
        methods:{
            radios:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    })
    //初始化表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'工单号',
                data:'gdCode',
                className:'gongdanId'
            },
            {
                title:'工单状态',
                data:'gdZht',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '待受理'
                    }if(data == 2){
                        return '待接单'
                    }if(data == 3){
                        return '待执行'
                    }if(data == 4){
                        return '待完成'
                    }if(data == 5){
                        return '完工确认'
                    }if(data == 6){
                        return '待评价'
                    }if(data == 7){
                        return '结束'
                    }
                }
            },
            {
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'维修事项',
                data:'wxShiX'
            },
            {
                title:'维修地点',
                data:'wxDidian'
            },
            {
                title:'登记时间',
                data:'gdShij'
            }
        ],
    });
    $('#scrap-datatables tbody')
        .on( 'mouseover', 'td', function () {
            var colIdx = table.cell(this).index();
            if ( colIdx !== lastIdx ) {
                $( table.cells().nodes() ).removeClass( 'highlight' );
                $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        } )
        .on('dblclick','tr',function(){
            //当前行变色
            var $this = $(this);
            $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
            $(this).css({'background':'#FBEC88'});
            $('#myModal1').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal1').modal('show');
            moTaiKuang();
            //包装参数(绑定弹窗input数据)
            var gongDanState = $this.children('td').eq(2).html();
            var gongDanCode = $this.children('td').eq(0).html();
            if( gongDanState == '待接单' ){
                $('.workDone .gongdanClose').find('.btn-success').html('接单');
                gongDanState = 2;
            }else if( gongDanState == '待执行'){
                $('.workDone .gongdanClose').find('.btn-success').html('执行');
                gongDanState = 3;
            }else if( gongDanState == '待完成' ){
                $('.workDone .gongdanClose').find('.btn-success').html('完成');
                gongDanState = 4
            }
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':userIdName
            }
            $.ajax({
                type:'post',
                url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    console.log(result);
                    //绑定弹窗数据
                    workDones.weixiukeshis = result.wxKeshi;
                    workDones.baoxiukeshis = result.bxKeshi;
                    workDones.baoxiudidians = result.wxDidian;
                    workDones.weixiushixiangs = result.wxShiX;
                    workDones.beizhus = result.bxBeizhu;
                    workDones.baoxiudianhua = result.bxDianhua;
                    workDones.baoxiuren = result.bxRen;
                    workDones.wxbeizhu = result.wxbeizhu;
                }
            });

        });
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //鼠标行高亮
    var lastIdx = null;
    //弹窗中的表格()
    $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'执行人员',
                data:'name'
            },
            {
                title:'部门',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'联系电话',
                data:'phone'
            }
        ]
    });
    //弹出框的复选框选择
    $('#personTable1 tbody').on('click','input',function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //确定是哪一行，然后变颜色
            $(this).parents('tr').css({'background':'#fbec88'});
        }else{
            $(this).parent($('span')).removeClass('checked');
            $(this).parents('tr').css({'background':'#ffffff'});
        }
        //判断如果所有的tbody中的复选框都是选中状态，thead自动置为选中状态
        var $thisCheckedLength = $(this).parents('tbody').find('.checker').children('.checked').length;
        var $thisTrLength = $(this).parents('tbody').children('tr').length;
        if($thisCheckedLength == $thisTrLength){
            $(this).parents('table').children('thead').find('.checkeds').find('span').addClass('checked');
        }else{
            $(this).parents('table').children('thead').find('.checkeds').find('span').removeClass('checked');
        }
    })
    //弹出框的全选复选框
    $('table thead').on('click','input',function(){
        var $thisChecked = $(this).parents('table').children('tbody').children('tr').find('.checkeds').children().children('span');
        var $thisTr = $(this).parents('table').children('tbody').children('tr')
        if($(this).parents('.checker').children('.checked').length != 0){
            $thisChecked.addClass('checked');
            $thisTr.css({'background':'#fbec88'})
        }else{
            $thisChecked.removeClass('checked');
            $thisTr.css({'background':'#ffffff'})
        }
    })
    /*--------------------------------------------------------------------------------------------*/
    //弹窗中的另一个表格
    $('#personTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'材料分析',
                data:'caiLiaoFenLei'
            },
            {
                title:'维修材料',
                data:'weiXiuCaiLiao'
            },
            {
                title:'单价',
                data:'danWei'
            },
            {
                title:'数量',
                data:'shuLiang'
            },
            {
                title:'总价',
                data:'zongJia'
            },
            {
                title:'使用人',
                data:'shiYongRen'
            }
        ]
    });
    /*--------------------------------------------------------------------------------------------*/
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        alert(0);
        $('.table-title span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.tableHover').css({'z-index':0});
        $('.tableHover').eq($(this).index()).css({
            'z-index':1
        })
    });
    /*------------------------------------------------------------------------------*/
    //弹出框的复选框选择
    $('#personTables1 tbody').on('click','input',function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //确定是哪一行，然后变颜色
            $(this).parents('tr').css({'background':'#fbec88'});
        }else{
            $(this).parent($('span')).removeClass('checked');
            $(this).parents('tr').css({'background':'#ffffff'});
        }
        //判断如果所有的tbody中的复选框都是选中状态，thead自动置为选中状态
        var $thisCheckedLength = $(this).parents('tbody').find('.checker').children('.checked').length;
        var $thisTrLength = $(this).parents('tbody').children('tr').length;
        if($thisCheckedLength == $thisTrLength){
            $(this).parents('table').children('thead').find('.checkeds').find('span').addClass('checked');
        }else{
            $(this).parents('table').children('thead').find('.checkeds').find('span').removeClass('checked');
        }
    })
    /*---------------------------------------------------------------------------*/
    //登记按钮功能
    $('.creatButton').on('click',function(){
        //所有登记页面的输入框清空
        app33.telephone = '';
        app33.person = '';
        app33.place = '';
        app33.matter = '';
        app33.sections = '';
        app33.remarks = '';
        app33.section = '';
        $('#myModal').modal({
            show:false,
            backdrop:'static'
        })
        $('#myModal').modal('show');
        moTaiKuang();
    });
    /*重置按钮的*/
    //点击重置按钮的时候，所有input框清空，时间还原成今天的
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(initStart);
        $('.max').val(initEnd);
    })
    conditionSelect();
    /*查询按钮*/
    $('#selected').click(function(){
        conditionSelect();
    })
    /*条件查询*/
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        //console.log(filterInput);
        var prm = {
            'gdCode':filterInput[0],
            'gdSt':filterInput[2] + ' 00:00:00',
            'gdEt':filterInput[3] + ' 00:00:00',
            'bxKeshi':filterInput[1],
            'wxKeshi':'',
            "gdZht": 1,
            'userID':userIdName
        }
        $.ajax({
            type:'post',
            url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDGetDJ',
            async:false,
            data:prm,
            success:function(result){
                if(result.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result);
                    table.fnDraw();
                }
            }
        })
    }
    //弹窗表格添加复选框
    var creatCheckBox = '<input type="checkbox">';
    $('.checkeds').prepend(creatCheckBox);
    $('.dengji').click(function(){
        if(app33.person == '' || app33.place == '' || app33.matter == '' || app33.telephone == ''){
            //alert('请填写必填项')
            $('#myModal2').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal2').find('.modal-body').html('请填写红色必填项');
            $('#myModal2').modal('show');
            moTaiKuang2();
        }else{
            $('#myModal').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal').modal('hide');
            var gdInfo = {
                'gdJJ':app33.picked,
                'bxRen':app33.person,
                'bxDianhua':app33.telephone,
                'bxKeshi':app33.section,
                'wxDidian':app33.place,
                'wxShiX':app33.matter,
                'wxKeshi':'',
                'bxBeizhu':app33.remarks,
                'userID':userIdName,
                'gdSrc':1
            }
            $.ajax({
                type:'post',
                url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDCreDJ',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        $('#myModal2').modal({
                            show:false,
                            backdrop:'static'
                        })
                        $('#myModal2').find('.modal-body').html('添加成功');
                        $('#myModal2').modal('show');
                        moTaiKuang2()
                    }
                    //刷新表格
                    conditionSelect();
                }
            })
        }
    });
    $('.confirm').click(function(){
        $('#myModal1').modal('hide');
    })
    $('.confirm1').click(function(){
        $('#myModal2').modal('hide');
    })
    /*---------------------------------模态框始终居中--------------------------------------------*/
    //双击框的垂直居中
    function moTaiKuang(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        //console.log(markBlockHeight);
        $('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //提示框
    function moTaiKuang2(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('#myModal2').find('.modal-dialog').height();
        console.log(markBlockHeight);
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('#myModal2').find('.modal-dialog').css({'margin-top':markBlockTop});
    }
})