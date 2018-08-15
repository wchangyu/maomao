$(function(){

    /*---------------------------------事件插件-----------------------------------*/

    _timeYMDComponentsFun11($('.equipNewDT'));

    /*--------------------------------表格初始化-----------------------------------*/

    var col = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"

        },
        {
            title:'设备标识',
            data:'SBBS'
        },
        {
            title:'设备编号',
            data:'SBBM'
        },
        {

            title:'设备名称',
            data:'SBMC'

        },
        {
            title:'安装位置',
            data:'AZWZ'
        },
        {

            title:'所属系统',
            data:'SSXT'

        },
        {
            title:'型号',
            data:'XH'
        },
        {
            title:'性能参数',
            data:'XNCS'
        },
        {
            title:'品牌',
            data:'PP'
        },
        {
            title:'厂家',
            data:'CJ'
        },
        {
            title:'出厂编号',
            data:'CCBH'
        },
        {
            title:'使用状态',
            data:'SYZT'
        },
        {
            title:'出厂日期',
            data:'CCRQ'
        },
        {
            title:'购入日期',
            data:'GRRQ'
        },
        {
            title:'启用日期',
            data:'QYRQ'
        },
        {
            title:'使用年限',
            data:'SYNX'
        },
        {
            title:'免质保日期',
            data:'MZBRQ'
        },
        {
            title:'免质保单位',
            data:'MZBDW'
        },
        {
            title:'免质保电话',
            data:'MZBDH'
        },
        {
            title:'付费保日期',
            data:'FFBRQ'
        },
        {
            title:'付费保单位',
            data:'FFBDW'
        },
        {
            title:'付费保电话',
            data:'FFBDH'
        },
        {
            title:'归属部门',
            data:'GSBM'
        },
        {
            title:'归属负责人',
            data:'GSFZR'
        },
        {
            title:'负责人电话',
            data:'FZRDH'
        },
        {
            title:'备注',
            data:'BZ'
        }

    ];

    _tableInit($('#table'),col,2,false,'','','','','',true);

    /*--------------------------------按钮事件------------------------------------*/

    //【新增】
    $('#createBtn').click(function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#option-Modal'), '设备信息管理', false, '' ,'', '保存设备数据');

        //绑定数据

        //类
        $('#option-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

    })

    //新增【确定】
    $('#option-Modal').on('click','.dengji',function(){



    })

    //【编辑】
    $('#editBtn').click(function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#option-Modal'), '设备信息管理', false, '' ,'', '保存设备数据');

        //绑定数据

        //类
        $('#option-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

    })

    //编辑【确定】
    $('#option-Modal').on('click','.bianji',function(){



    })

    //【删除】
    $('#deleteBtn').click(function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#option-Modal'), '确定要删除吗？', false, '' ,'', '删除');

        //绑定数据

        //类
        $('#option-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

    })

    //删除【确定】
    $('#option-Modal').on('click','.shanchu',function(){



    })

    /*--------------------------------其他方法-------------------------------------*/

    //模态框初始化
    function modalInit(){

        var inputs = $('#option-Modal').find('.form-control');

        inputs.val('');

    }

    //条件查询
    var result = [

        {
            SBBS:'1',

            SBBM:'2',

            SBMC:'3',

            AZWZ:'4',

            SSXT:'5',

            XH:'6',

            XNCS:'7',

            PP:'8',

            CJ:'9',

            CCBH:'10',

            SYZT:'11',

            CCRQ:'12',

            GRRQ:'13',

            QYRQ:'14',

            SYNX:'15',

            MZBRQ:'16',

            MZBDW:'17',

            MZBDH:'18',

            FFBRQ:'19',

            FFBDW:'20',

            FFBDH:'21',

            GSBM:'22',

            GSFZR:'23',

            FZRDH:'24',

            BZ:'25'

        },
        {
            SBBS:'01',

            SBBM:'02',

            SBMC:'03',

            AZWZ:'04',

            SSXT:'05',

            XH:'06',

            XNCS:'07',

            PP:'08',

            CJ:'09',

            CCBH:'010',

            SYZT:'011',

            CCRQ:'012',

            GRRQ:'013',

            QYRQ:'014',

            SYNX:'015',

            MZBRQ:'016',

            MZBDW:'017',

            MZBDH:'018',

            FFBRQ:'019',

            FFBDW:'020',

            FFBDH:'021',

            GSBM:'022',

            GSFZR:'023',

            FZRDH:'024',

            BZ:'025'

        }

    ]

    //条件选择
    //function

})