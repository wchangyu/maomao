$(function () {
  /*--------------------------全局变量初始化设置----------------------------------*/
  //获得用户名
  var _userIdName = sessionStorage.getItem('userName');
  //获取本地url
  var _urls = sessionStorage.getItem("apiUrlPrefixYW");
  //开始/结束时间插件
  $('.datatimeblock').datepicker({
    language:  'zh-CN',
    todayBtn: 1,
    todayHighlight: 1,
    format: 'yyyy/mm/dd'
  });
  //设置初始时间(主表格时间)
  var _initStart = moment().format('YYYY/MM/DD');
  var _initEnd = moment().format('YYYY/MM/DD');
  //选择设备时间
  var _initStartSB = '';
  var _initEndSB = '';
  //显示时间
  $('.min').val(_initStart);
  $('.max').val(_initEnd);
  //实际发送时间
  var realityStart;
  var realityEnd;
  //自定义验证器
  //手机号码
  Vue.validator('telephones', function (val) {
    return /^[0-9]*$/.test(val)
  })
  //验证必填项（非空）
  Vue.validator('persons', function (val) {
    //获取内容的时候先将首尾空格删除掉；
    val=val.replace(/^\s+|\s+$/g,'');
    return /[^.\s]{1,500}$/.test(val)
  })
  //登记信息绑定
  var app33 = new Vue({
    el:'#myApp33',
    data:{
      picked:'1',
      rwlx:4,
      telephone:'',
      person:'',
      place:'',
      section:'',
      matter:'',
      sbSelect:'',
      sbLX:'',
      sbMC:'',
      sbBM:'',
      azAddress:'',
      remarks:''
    },
    methods:{
      radios:function(){
        $('#myApp33').find('.inpus').click(function(a){
          $('#myApp33').find('.inpus').parent('span').removeClass('checked');
          $(this).parent('span').addClass('checked');
        })
      }
    }
  })
  //快速创建
  var quickWork = new Vue({
    "el":'#quickWork',
    "data":{
      picked:1,
      rwlx:4,
      telephone:'',
      person:'',
      place:'',
      section:'',
      matter:'',
      weixiushebei:'',
      weixiukeshis:'',
      sbSelect:'',
      sbLX:'',
      sbMC:'',
      sbBM:'',
      azAddress:'',
      beizhus:'',
      weixiuBZ:''
    },
    methods:{
      radios:function(){
        $('#quickWork').find('.inpus').click(function(a){
          $('#quickWork').find('.inpus').parent('span').removeClass('checked');
          $(this).parent('span').addClass('checked');
        })
      }
    }
  })
  //存放执行人信息的数组
  var _zhixingRens = [];
  /*//存放设备类型的所有数据
  var _allDataLX = [];
  //存放设备区域的所有数据
  var _allDataQY = [];
  //存放设备系统的所有数据
  var _allDataXT = [];
  //存放设备部门的所有数据
  var _allDataBM = [];
  //获取设备类型
  ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#leixing'),'dcName','dcNum');
  //设备区域
  ajaxFun('YWDev/ywDMGetDAs',_allDataQY,$('#quyu'),'daName','daNum');
  //设备系统
  ajaxFun('YWDev/ywDMGetDSs',_allDataXT,$('#xitong'),'dsName','dsNum');
  //设备部门
  ajaxFun('YWDev/ywDMGetDDs',_allDataBM,$('#bumen'),'ddName','ddNum');
  //记录选择的设备的变量
  var sbObject = {};*/
  /*-----------------------------表格初始化----------------------------------------*/
  //页面表格
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
      'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
        text: '导出',
        className:'saveAs',
        header:true
      }
    ],
    "dom":'t<"F"lip>',
    "columns": [
      {
        title:'工单号',
        data:'gdCode',
        className:'gongdanId'
      },
      {
        title:'工单类型',
        data:'gdJJ',
        render:function(data, type, full, meta){
          if(data == 0){
            return '普通'
          }if(data == 1){
            return '快速'
          }
        }
      },
      {
        title:'工单状态',
        data:'gdZht',
        className:'gongdanZt',
        render:function(data, type, full, meta){
          if(data == 1){
            return '待下发'
          }if(data == 2){
            return '待分派'
          }if(data == 3){
            return '待执行'
          }if(data == 4){
            return '执行中'
          }if(data == 5){
            return '等待资源'
          }if(data == 6){
            return '待关单'
          }if(data == 7){
            return '任务关闭'
          }if(data == 8){
            return '任务取消'
          }
        }
      },
      {
        title:'车间站',
        data:'bxKeshi'
      },
      {
        title:'维修事项',
        data:'wxShiX'
      },
      {
        title:'故障位置',
        data:'wxDidian'
      },
      {
        title:'登记时间',
        data:'gdShij'
      },
      {
        title:'操作',
        "targets": -1,
        "data": null,
        "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>查看</span>"
      }
    ]
  });
  //自定义按钮位置
  table.buttons().container().appendTo($('.excelButton'),table.table().container());
  //报错时不弹出弹框
  $.fn.dataTable.ext.errMode = function(s,h,m){
    console.log('')
  }
  //初始化设备表格
  $('#sbTable').DataTable({
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
        visible: false,
        className:'ids'
      },
      {
        title:'设备编号',
        data:'dNum',
        className:'dNum'
      },
      {
        title:'设备名称',
        data:'dName',
        className:'dName'
      },
      {
        title:'规格型号',
        data:'spec',
      },
      {
        title:'设备类型',
        data:'dcName',
        className:'dcName'
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
        className:'ddName'
      },
      {
        title:'设备系统',
        data:'dsName',
      }
    ],
    "aoColumnDefs": [
      {
        sDefaultContent: '',
        aTargets: [ '_all' ]
      }
    ]
  });
  //执行人员表格
  var col2 = [
    {
      title:'工号',
      data:'wxrID',
      className:'wxrID'
    },
    {
      title:'执行人员',
      data:'wxRName',
      className:'wxRName'
    },
    {
      title:'联系电话',
      data:'wxRDh',
      className:'wxRDh'
    }
  ];
  tableInit($('#personTable1'),col2);
  /*-----------------------------页面加载时调用的方法------------------------------*/
  //条件查询
  conditionSelect();
  /*----------------------------------按钮触发的事件-----------------------------*/
  //弹窗切换表格效果
  $('.table-title span').click(function(){
    $('.table-title span').removeClass('spanhover');
    $(this).addClass('spanhover');
    $('.tableHover').css({'z-index':0});
    $('.tableHover').css({'opacity':0});
    $('.tableHover').eq($(this).index()).css({
      'z-index':1,
      'opacity':1
    })
  });
  //查询按钮功能
  $('#selected').click(function(){
    if( $('.min').val() == '' || $('.max').val() == '' ){
      var myModal = $('#myModal2')
      myModal.find('.modal-body').html('起止时间不能为空');
      moTaiKuang(myModal);
    }else{
      //结束时间不能小于开始时间
      if( $('.min').val() > $('.max').val() ){
        var myModal = $('#myModal2');
        //提示框
        myModal.find('.modal-body').html('起止时间不能大于结束时间');
        moTaiKuang(myModal);
      }else{
        conditionSelect();
      }
    }
  })
  //重置按钮功能
  $('.resites').click(function(){
    //清空input框内容
    var parents = $(this).parents('.condition-query');
    var inputs = parents.find('input');
    inputs.val('');
    //时间置为今天
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
  })
  //登记按钮
  $('.creatButton').click(function(){
    //所有input可操作
    $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
    $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
    $('#myApp33').find('textarea').attr('disabled',false).removeClass('disabled-block');
    //所有登记页面的输入框清空(radio的按钮默认为否)；
    app33.picked = 0;
    $('.inpus').parent('span').removeClass('checked');
    $('#twos').parent('span').addClass('checked');
    app33.rwlx = 4;
    app33.telephone = '';
    app33.person = '';
    app33.place = '';
    app33.matter = '';
    app33.remarks = '';
    app33.section = '';
    app33.sbSelect = '';
    app33.sbLX = '';
    app33.sbMC = '';
    app33.sbBM = '';
    app33.azAddress = '';
    moTaiKuang($('#myModal'));
    $('#myModal').find('.btn-primary').show();
  });
  //快速登记按钮
  $('.quickCreat').click(function(){
    quickWork.picked = 1;
    $('#quickWork').find('.inpus').parent('span').removeClass('checked');
    $('#one1').parent('span').addClass('checked');
    quickWork.rwlx = 4;
    quickWork.telephone = '';
    quickWork.person = '';
    quickWork.place = '';
    quickWork.section = '';
    quickWork.matter = '';
    quickWork.weixiukeshis = '';
    quickWork.sbSelect = '';
    quickWork.sbLX = '';
    quickWork.sbMC = '';
    quickWork.sbBM = '';
    quickWork.azAddress = '';
    quickWork.beizhus = '';
    quickWork.weixiuBZ = '';
    moTaiKuang($('#myModal4'));
    //将执行人默认为本人
    var personObject = {};
    personObject.wxRName = _userIdName;
    personObject.wxrID = _userIdName;
    personObject.wxRDh = '';
    _zhixingRens = [];
    _zhixingRens.push(personObject);
    datasTable($('#personTable1'),_zhixingRens);
  })
  $('.dengji').click(function(){
    if(app33.person == '' || app33.place == '' || app33.matter == ''){
      var myModal = $('#myModal2');
      myModal.find('.modal-body').html('请填写红色必填项');
      moTaiKuang(myModal);
    }else{
      var gdInfo = {
        'gdJJ':app33.picked,
        'bxRen':app33.person,
        'bxDianhua':app33.telephone,
        'bxKeshi':app33.section,
        'wxDidian':app33.place,
        'wxShiX':app33.matter,
        'wxKeshi':'',
        'bxBeizhu':app33.remarks,
        'userID':_userIdName,
        'gdLeixing':app33.rwlx,
        'dName':app33.sbMC,
        'gdSrc':2,
        'ddName':app33.sbBM,
        'wxShebei':app33.sbSelect,
        'dcName':app33.sbLX,
        'installAddress':app33.azAddress
      }
      $.ajax({
        type:'post',
        url: _urls + 'YWGD/ywGDCreDJ',
        data:gdInfo,
        success:function(result){
          if(result == 99){
            var myModal = $('#myModal2');
            myModal.find('.modal-body').html('添加成功!');
            moTaiKuang(myModal)
          }
          //刷新表格
          conditionSelect();
        }
      })
    }
  });
  $('.quickDengji').click(function()  {
    if(quickWork.person == '' || quickWork.place == '' || quickWork.matter == '' || quickWork.weixiukeshis == '' || quickWork.weixiuBZ == ''){
      var myModal = $('#myModal2');
      myModal.find('.modal-body').html('请填写红色必填项');
      moTaiKuang(myModal);
    }else{
      var weixiuRen = [
        {
          wxRen:_userIdName,
          wxRName:_userIdName,
          wxRDh:''
        }
      ];
      var gdInfo = {
        'gdJJ':quickWork.picked,
        'bxRen':quickWork.person,
        'bxDianhua':quickWork.telephone,
        'bxKeshi':quickWork.section,
        'wxDidian':quickWork.place,
        'wxShiX':quickWork.matter,
        'wxKeshi':quickWork.weixiukeshis,
        'bxBeizhu':quickWork.beizhus,
        'userID':_userIdName,
        'gdLeixing':quickWork.rwlx,
        'dName':quickWork.sbMC,
        'gdSrc':2,
        'ddName':quickWork.sbBM,
        'wxShebei':quickWork.sbSelect,
        'dcName':quickWork.sbLX,
        'installAddress':quickWork.azAddress,
        'gdWxRs':weixiuRen,
        'wxBeizhu':quickWork.weixiuBZ
      }
      $.ajax({
        type:'post',
        url: _urls + 'YWGD/ywGDCreQuickDJ',
        data:gdInfo,
        success:function(result){
          if(result == 99){
            $('#myModal4').modal('hide');
            var myModal = $('#myModal2');
            myModal.find('.modal-body').html('添加成功!');
            moTaiKuang(myModal);
          }
          //刷新表格
          conditionSelect();
        }
      })
    }
  })
  $('.confirm').click(function(){
      $(this).parents('.modal').modal('hide');
  });
  //设备选择功能
  /*$('#sbSelect').click(function(){
    moTaiKuang($('#myModal3'));
    selectSBList();
  });*/
  //设备查询按钮
  /*$('#selectedSB').click(function(){
    selectSBList();
  })*/
  /*//选择设备确定按钮
  $('.sbConfirm').click(function(){
    app33.sbSelect = sbObject.sbID;
    app33.sbLX = sbObject.sbLX;
    app33.sbMC = sbObject.sbMC;
    app33.sbBM = sbObject.sbBM;
  })*/
  /*---------------------------------表格绑定事件-------------------------------------*/
  //主表格事件
  $('#scrap-datatables tbody')
      .on( 'click','.option-edit',function(){
        //确定按钮消失；
        $('#myModal').find('.btn-primary').hide();
        var $this = $(this).parents('tr');
        currentTr = $this;
        currentFlat = true;
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        moTaiKuang($('#myModal'));
        //获取详情
        var gongDanState = $this.children('.gongdanZt').html();
        var gongDanCode = $this.children('.gongdanId').html();
        var prm = {
          'gdCode':gongDanCode,
          'gdZht':gongDanState,
          'userID':_userIdName
        }
        //每次获取弹出框中执行人员的数量
        $.ajax({
          type:'post',
          url: _urls + 'YWGD/ywGDGetDetail',
          async:false,
          data:prm,
          success:function(result){
            console.log(result);
            if(result.gdJJ == 1){
              $('#myApp33').find('.inpus').parent('span').removeClass('checked');
              $('#myApp33').find('#ones').parent('span').addClass('checked');
            }else{
              $('#myApp33').find('.inpus').parent('span').removeClass('checked');
              $('#myApp33').find('#twos').parent('span').addClass('checked');
            }
            //绑定弹窗数据
            app33.telephone = result.bxDianhua;
            app33.person = result.bxRen;
            app33.place = result.wxDidian;
            app33.section = result.bxKeshi;
            app33.matter = result.wxShiX;
            app33.remarks = result.bxBeizhu;
            app33.sbSelect = result.wxShebei;
            app33.sbLX = result.dcName;
            app33.sbMC = result.dName;
            app33.sbBM = result.ddName;
            app33.azAddress = result.installAddress;
            app33.rwlx = result.gdLeixing;
            //所有input不可操作
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');
          }
        });
      });
  /*//设备选择表格事件
  $('#sbTable tbody')
      .on('click','tr',function(){
        var $this = $(this);
        $('#sbTable tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        sbObject.sbID = $this.children('.dNum').html();
        sbObject.sbMC = $this.children('.dName').html();
        sbObject.sbLX = $this.children('.dcName').html();
        sbObject.sbBM = $this.children('.ddName').html();
        console.log(sbObject);
      })*/
  /*-------------------------------方法----------------------------------------*/
  //条件查询
  function conditionSelect(){
    //获取条件
    var filterInput = [];
    var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
    for(var i=0;i<filterInputValue.length;i++){
      filterInput.push(filterInputValue.eq(i).val());
    }
    realityStart = filterInput[2] + ' 00:00:00';
    realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
    var prm = {
      'gdCode':filterInput[0],
      'gdSt':realityStart,
      'gdEt':realityEnd,
      'bxKeshi':filterInput[1],
      'wxKeshi':'',
      "gdZht": 1,
      'userID':_userIdName
    }
    $.ajax({
      type:'post',
      url:_urls + 'YWGD/ywGDGetDJ',
      async:false,
      data:prm,
      success:function(result){
        datasTable($("#scrap-datatables"),result);
      }
    })
  }
  //模态框自适应
  function moTaiKuang(who){
    who.modal({
      show:false,
      backdrop:'static'
    })
    //$('#myModal2').find('.modal-body').html('起止时间不能为空');
    who.modal('show');
    var markHeight = document.documentElement.clientHeight;
    var markBlockHeight = who.find('.modal-dialog').height();
    var markBlockTop = (markHeight - markBlockHeight)/2;
    who.find('.modal-dialog').css({'margin-top':markBlockTop});
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
  //ajaxFun（select的值）
  function ajaxFun(url,allArr,select,text,num){
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
          allArr.push(result[i]);
        }
        select.append(str);
      }
    })
  }
  //获取设备列表
  function selectSBList(){
    //获取条件
    var filterInput = [];
    var filterInputValue = $('.condition-query').eq(1).find('.input-blocked').children('input');
    for(var i=0;i<filterInputValue.length;i++){
      filterInput.push(filterInputValue.eq(i).val());
    }
    if( filterInput[2] == ''){
      _initStartSB = ''
    }else{
      _initStartSB = filterInput[2] + ' 00:00:00';
    }
    if( filterInput[2] == '' ){
      _initEndSB = ''
    }else{
      _initEndSB = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
    }
    var prm =   {
      'st':_initStartSB,
      'et':_initEndSB,
      'dName':filterInput[0],
      'spec':filterInput[1],
      'status':$('#zhuangtai').val(),
      'daNum':$('#quyu').val(),
      'ddNum':$('#bumen').val(),
      'dsNum':$('#xitong').val(),
      'dcNum':$('#leixing').val(),
      'userID':_userIdName
    }
    $.ajax({
      type:'post',
      url:_urls + 'YWDev/ywDIGetDevs',
      data:prm,
      async:false,
      success:function(result){
        for(var i=0;i<result.length;i++){
          //_allDateArr.push(result[i]);
          console.log(result);
        }
        datasTable($('#sbTable'),result);
      }
    })
  }
  //表格初始化方法
  function tableInit(tableID,col,fun){
    tableID.DataTable({
      'autoWidth': false,  //用来启用或禁用自动列的宽度计算
      'paging': true,   //是否分页
      'destroy': true,//还原初始化了的datatable
      'searching': true,
      'ordering': false,
      'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 条',
        'zeroRecords': '没有数据',
        'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
        'infoEmpty': '没有数据',
        'sSearch':'查询',
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
          text: '保存为excel格式',
        },
      ],
      'columns':col,
      'rowCallback': fun
    })
  }
})