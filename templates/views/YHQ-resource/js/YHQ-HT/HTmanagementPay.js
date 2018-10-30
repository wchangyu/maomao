$(function(){

    /*-----------------------------时间插件---------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*-----------------------------表格初始化--------------------------------*/

    //主表格
    var col = [

        {
            title:'合同编号',
            data:'htnum',
            name:'htnum',
            render:function(data, type, full, meta){

                return '<a href="HTDetails.html?num=' + data + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'合同名称',
            data:'htname'
        },
        {
            title:'所属项目',
            data:'projectName'
        },
        {
            title:'签订人',
            data:'signusername'
        },
        {
            title:'甲方单位',
            data:'clientname'
        },
        {
            title:'合同金额',
            data:'amountmoney'
        },
        {
            title:'审核状态',
            data:'audit',
            render:function(data, type, full, meta){

                return approvalStatusFun(data)


            }
        },
        {
            title:'合同签定时间',
            data:'httime',
            render:function(data, type, full, meta){

                return data.split('T')[0]

            }

        },
        {
            title:'经办人',
            data:'payUserName'
        },
        {
            title:'金额',
            data:'money'
        },
        {
            title:'款项名称',
            data:'payName'
        },
        {
            title:'款项时间',
            data:'payTime'
        },
        {
            title:'款项备注',
            data:'memo'
        }

    ]

    //导出列
    //var _exportCol = [0,1,2,3,4,5,6,7,8,9,10,11,12];

    //_tableInit($('#table'),col,1,true,'','','',_exportCol);

    var table = $('#table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": true,
        "bProcessing":true,
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
        'buttons':[

            {

                extend: 'excelHtml5',
                text: '导出数据',
                className:'saveAs L-condition-button'

            }

        ],
        "columns": col,

        "rowsGroup": [
            'htnum:name',
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7
        ]
    });

    table.buttons().container().appendTo($('.excelButton'),table.table().container());

    conditionSelect();

    //导出
    $('#excelBtn').click(function(){

        _exportExecl($('#table'));

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('.L-condition').eq(0).find('input').val('');

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

        $('.L-condition').eq(0).find('select').val(-1);

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {
            //项目名称
            projectName:$('#HT-projectCon').val(),
            //合同名称
            htname:$('#HT-nameCon').val(),
            //合同类型
            catename:$('#HT-typeCon').val(),
            //甲方单位
            clientName:$('#HT-customerCon').val(),
            //签订人
            signUserName:$('#HT-signCon').val(),
            //审核状态
            audit:$('#HT-approveCon').val(),
            //合同编码
            //htNum:$('#DC-numCon').val(),
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //状态
            htStatus:-1
        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTInfoList4',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //审核状态
    function approvalStatusFun(data){

        var str = ''

        if(data == '0'){

            str = '未审批'

        }else if(data == '1'){

            str = '审批中'

        }else if(data == '2'){

            str = '审批通过'

        }else if(data == '3'){

            str = '审批未通过'

        }else if(data == '9'){

            str = '没有审批'

        }

        return str;

    }


})