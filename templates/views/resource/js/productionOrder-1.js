$(function () {
  /*--------------------------全局变量初始化设置----------------------------------*/
  //页面列表加载
  $('.loading').showLoading();

  //图片ip
  var _urlImg = 'http://1.1.1.1/ApService/dimg.aspx';

  //开始/结束时间插件
  $('.datatimeblock').datepicker({
    language: 'zh-CN',
    todayBtn: 1,
    todayHighlight: 1,
    format: 'yyyy/mm/dd',     forceParse: 0,
    forceParse: 0
  });

  //datatimepicker
  $('.otime').datetimepicker({
    language:  'zh-CN',//此处修改
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 1,
    forceParse: 0,
  });

  //设置初始时间(主表格时间)
  var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
  var _initEnd = moment().format('YYYY/MM/DD');


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
    val = val.replace(/^\s+|\s+$/g, '');
    return /[^.\s]{1,500}$/.test(val)
  })

  //登记信息绑定
  var app33 = new Vue({
    el: '#myApp33',
    data: {
      picked: '1',
      whether:'0',
      rwlx: 4,
      telephone: '',
      person: '',
      place: '',
      section: '',
      matter: '',
      sbSelect: '',
      sbLX: '',
      sbMC: '',
      azAddress: '',
      gdly: 1,
      lineRoute: '',
      gdCode:'',
      state:''
    },
    methods: {
      radios: function () {
        selectRadio($('#myApp33'),'.inpus');
      },
      selects:function(){
        selectRadio($('#myApp33'),'.whether');
      },
      selectLine:function(){
        //首先将select子元
         var values = $('#line-route').val();
         if(values == ''){
          //所有车站
            var str = '<option value="">请选择</option>';
           for(var i=0;i<_allDataBM.length;i++){
              str += '<option value="' + _allDataBM[i].ddNum +
                  '">' + _allDataBM[i].ddName + '</option>'
           }
           $('.cjz').empty().append(str);
         }else{
           var str = '<option value="">请选择</option>';
           for(var i=0;i<_lineArr.length;i++){
             if(app33.lineRoute == _lineArr[i].dlNum){
               for(var j=0;j<_lineArr[i].deps.length;j++){
                 str += '<option value="' + _lineArr[i].deps[j].ddNum + '">' + _lineArr[i].deps[j].ddName + '</option>'
               }
             }
           }
           $('.cjz').empty().append(str);
         }
      }
    }
  })

  //快速创建
  var quickWork = new Vue({
    "el": '#quickWork',
    "data": {
      picked: 1,
      rwlx: 4,
      telephone: '',
      person: '',
      place: '',
      section: '',
      matter: '',
      weixiushebei: '',
      weixiukeshis: '',
      sbSelect: '',
      sbLX: '',
      sbMC: '',
      azAddress: '',
      gdly: '1',
      lineRoute: '',
      whether:0,

    },
    methods: {
      radios: function () {
        selectRadio($('#quickWork'),'.inpus',$(this));
      },
      selectLine:function(){
        //首先将select子元
        var values = $('#line-route1').val();
        if(values == ''){
          //所有车站
          var str = '<option value="">请选择</option>';
          for(var i=0;i<_allDataBM.length;i++){
            str += '<option value="' + _allDataBM[i].ddNum +
                '">' + _allDataBM[i].ddName + '</option>'
          }
          $('.cjz1').empty().append(str);
        }else{
          var str = '<option value="">请选择</option>';
          for(var i=0;i<_lineArr.length;i++){
            if(quickWork.lineRoute == _lineArr[i].dlNum){
              for(var j=0;j<_lineArr[i].deps.length;j++){
                str += '<option value="' + _lineArr[i].deps[j].ddNum + '">' + _lineArr[i].deps[j].ddName + '</option>'
              }
            }
          }
          $('.cjz1').empty().append(str);
        }
      },
      selects: function () {
        selectRadio($('#quickWork'),'.whether',$(this));
      },
    }
  })

  //存放执行人信息的数组
  var _zhixingRens = [];

  //存放设备系统的所有数据
  var _allDataXT = [];

  //存放设备部门的所有数据
  var _allDataBM = [];

  //设备系统
  ajaxFun('YWDev/ywDMGetDSs', _allDataXT, $('.xitong'), 'dsName', 'dsNum');

  //设备部门
  ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('.cjz'), 'ddName', 'ddNum');

  //快速报障设备部门
  ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('.cjz1'), 'ddName', 'ddNum');

  //存放登记的信息的对象
  var _obj = {};

  //存放快速登记的对象
  var _quickObj = {};

  //记录当前工单号
  var _gdCode = '';

  //记录当前工单详情有几个图
  var _imgNum = 0;

  //重发值
  var _gdCircle = 0;

  //存放所有线路的数据
  var _lineArr = [];

  //获取线路数据
  lineRouteData(_lineArr);

  //存放所有维保组的数组
  var _InfluencingArr = [];

  //维修班组数组
  var _bzArr = [];

  //标识在维保组中
  var _isWBZ = false;

  //标识在维修班组中
  var _isBZ = false;
  /*-----------------------------表格初始化----------------------------------------*/
  //工单表格
  var table = $('#scrap-datatables').DataTable({
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    "paging": true,   //是否分页
    "destroy": true,//还原初始化了的datatable
    "searching": true,
    "ordering": false,
    "iDisplayLength":50,//默认每页显示的条数
    "pagingType": "full_numbers",
    'language': {
      'emptyTable': '没有数据',
      'loadingRecords': '加载中...',
      'processing': '查询中...',
      'lengthMenu': '每页 _MENU_ 条',
      'zeroRecords': '没有数据',
      'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
      //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
      'infoEmpty': '没有数据',
      'paginate': {
        "previous": "上一页",
        "next": "下一页",
        "first": "首页",
        "last": "尾页"
      }
    },
    'buttons': [
      {
        extend: 'excelHtml5',
        text: '导出',
        className: 'saveAs',
        header: true,
        exportOptions: {
          columns: [0, 1, 2, 4, 5, 6, 7]
        }
      }
    ],
    "dom": 't<"F"lip>',
    "columns": [
      {
        title: '工单号',
        data: 'gdCode2',
        className: 'gongdanId',
        render: function (data, type, row, meta) {
          return '<span gdCode="' + row.gdCode +
              '"' + "gdCircle=" + row.gdCircle +
              '>' + data +
              '</span>'
        }
      },
      {
        title: '工单类型',
        data: 'gdJJ',
        render: function (data, type, full, meta) {
          if (data == 0) {
            return '普通'
          }
          if (data == 1) {
            return '快速'
          }
        }
      },
      {
        title: '工单状态',
        data: 'gdZht',
        className: 'gongdanZt',
        render: function (data, type, full, meta) {
          if (data == 1) {
            return '待下发'
          }
          if (data == 2) {
            return '待分派'
          }
          if (data == 3) {
            return '待执行'
          }
          if (data == 4) {
            return '执行中'
          }
          if (data == 5) {
            return '等待资源'
          }
          if (data == 6) {
            return '待关单'
          }
          if (data == 7) {
            return '任务关闭'
          }
          if (data == 999) {
            return '任务取消'
          }
        }
      },
      {
        title: '状态值',
        data: 'gdZht',
        className: 'ztz'
      },
      {
        title: '楼栋',
        data: 'bxKeshi'
      },
      {
        title: '设备类型',
        data: 'wxShiX'
      },
      {
        title: '故障位置',
        data: 'wxDidian'
      },
      {
        title: '登记时间',
        data: 'gdShij'
      },
      {
        title: '操作',
        "targets": -1,
        "data": null,
        "className": 'noprint',
        "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"
      }
    ]
  });

  //自定义按钮位置
  table.buttons().container().appendTo($('.excelButton'), table.table().container());

  //报错时不弹出弹框
  $.fn.dataTable.ext.errMode = function (s, h, m) {
    console.log('')
  };

  //执行人员表格
  var col2 = [
    {
      title: '工号',
      data: 'wxrID',
      className: 'wxrID'
    },
    {
      title: '执行人员',
      data: 'wxRName',
      className: 'wxRName'
    },
    {
      title: '联系电话',
      data: 'wxRDh',
      className: 'wxRDh'
    }
  ];
  tableInit($('#personTable1'), col2);

  /*-----------------------------页面加载时调用的方法------------------------------*/
  //条件查询
  InfluencingUnit();

  //不打印部分
  noPrint($('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate'));
  /*----------------------------------按钮触发的事件-----------------------------*/
  //弹窗切换表格效果
  $('.table-title span').click(function () {
    $('.table-title span').removeClass('spanhover');
    $(this).addClass('spanhover');
    $('.tableHover').css({'z-index': 0});
    $('.tableHover').css({'opacity': 0});
    $('.tableHover').eq($(this).index()).css({
      'z-index': 1,
      'opacity': 1
    })
  });

  //查询按钮功能
  $('#selected').click(function () {
    if ($('.min').val() == '' || $('.max').val() == '') {
      _moTaiKuang($('#myModal2'),'提示','flag','istap','起止时间不能为空!','');
    } else {
      //结束时间不能小于开始时间
      if ($('.min').val() > $('.max').val()) {
        //提示框
        _moTaiKuang($('#myModal2'),'提示','flag','istap','起止时间不能大于结束时间!','');
      } else {
        conditionSelect();
      }
    }
  })

  //重置按钮功能
  $('.resites').click(function () {
    //清空input框内容
    var parents = $(this).parents('.condition-query');
    var inputs = parents.find('input');
    inputs.val('');
    //时间置为今天
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
  })

  //登记按钮
  $('.creatButton').click(function () {
    //工单号、状态、工单登记时间不显示seeBlock
    $('.seeBlock').hide();
    //添加登记类
    $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji').html('登记');
    //所有input可操作
    $('#myApp33').find('input').attr('disabled', false).removeClass('disabled-block');
    $('#myApp33').find('select').attr('disabled', false).removeClass('disabled-block');
    $('#myApp33').find('textarea').attr('disabled', false).removeClass('disabled-block');
    $('.inpus').attr('disabled', true);
    //工单来源显示
    $('.gdly').parents('li').show();
    //所有登记页面的输入框清空(radio的按钮默认为否)；
    app33.picked = 0;
    $('.inpus').parent('span').removeClass('checked');
    $('#twos').parent('span').addClass('checked');
    app33.rwlx = 4;
    app33.telephone = '';
    app33.person = '';
    app33.place = '';
    $('.remarkDes').eq(0).val('');
    app33.sbSelect = '';
    app33.sbLX = '';
    app33.sbMC = '';
    app33.azAddress = '';
    app33.gdly = 1;
    app33.whether = 0;
    $('.whether').parent('span').removeClass('checked');
    $('#three').parent('span').addClass('checked');
    app33.lineRoute = '';
    app33.section = '';
    app33.matter = '';
    _moTaiKuang($('#myModal'),'登记','','','','登记');
    var _inittime = moment().format('YYYY/MM/DD HH:mm:ss');
    $('.otime').val(_inittime);
  });

  //快速登记按钮
  $('.quickCreat').click(function () {
    //工单来源显示
    $('.gdly').parents('li').show();
    quickWork.picked = 1;
    $('#quickWork').find('.inpus').parent('span').removeClass('checked');
    $('#one1').parent('span').addClass('checked');
    quickWork.rwlx = 4;
    quickWork.telephone = '';
    quickWork.person = '';
    quickWork.place = '';
    quickWork.weixiukeshis = '';
    quickWork.sbSelect = '';
    quickWork.sbLX = '';
    quickWork.sbMC = '';
    quickWork.azAddress = '';
    $('.remarkDes').eq(1).val('');
    $('.weixiuBZ').val('');
    quickWork.gdly = '1';
    _moTaiKuang($('#myModal4'), '快速报障', '','','', '快速报障');
    //将执行人默认为本人
    var personObject = {};
    personObject.wxRName = _userIdNum;
    personObject.wxrID = _userIdNum;
    personObject.wxRDh = '';
    _zhixingRens = [];
    _zhixingRens.push(personObject);
    datasTable($('#personTable1'), _zhixingRens);
    quickWork.whether = 1;
    $('#quickWork').find('.whether').parent('span').removeClass('checked');
    $('#three1').parent('span').addClass('checked');
    quickWork.lineRoute = '';
    quickWork.section = '';
    quickWork.matter = '';
    quickWork.whether = 0;
    var _inittime = moment().format('YYYY/MM/DD HH:mm:ss');
    $('.otimes').val(_inittime);
  })

  //确定按钮
  $('#myModal')
  //登记
      .on('click', '.dengji', function () {
        if (app33.telephone == '' || app33.person == '' || app33.place == ''  || app33.section == '' || app33.matter == '') {
          _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '请填写红色必填项!', '');
        } else {
          $('.loading').showLoading();
          var gdInfo = {
            'gdJJ': app33.picked,
            'bxRen': app33.person,
            'bxDianhua': app33.telephone,
            'bxKeshi': $('.cjz').eq(0).children('option:selected').html(),
            'wxDidian': app33.place,
            'wxShiX': $('.xitong').eq(0).children('option:selected').html(),
            'wxKeshi': '',
            'bxBeizhu': $('.remarkDes').eq(0).val(),
            'userID': _userIdNum,
            'gdLeixing': app33.rwlx,
            'dName': app33.sbMC,
            'gdSrc': 2,
            'wxShebei': app33.sbSelect,
            'dcName': app33.sbLX,
            'installAddress': app33.azAddress,
            'gdCodeSrc': app33.gdly,
            'bxKeshiNum': app33.section,
            'wxShiXNum': app33.matter,
            'gdRange':app33.whether,
            'gdFsShij':$('.otime').val()
          };
          //将发送请求的对象付给_obj;
          if ($.isEmptyObject(_obj)) {
            _obj = {
              'gdJJ': app33.picked,
              'bxRen': app33.person,
              'bxDianhua': app33.telephone,
              'bxKeshi': $('.cjz').eq(0).children('option:selected').html(),
              'wxDidian': app33.place,
              'wxShiX': $('.xitong').eq(0).children('option:selected').html(),
              'wxKeshi': '',
              'bxBeizhu': $('.remarkDes').eq(0).val(),
              'userID': _userIdNum,
              'gdLeixing': app33.rwlx,
              'dName': app33.sbMC,
              'gdSrc': 2,
              'wxShebei': app33.sbSelect,
              'dcName': app33.sbLX,
              'installAddress': app33.azAddress,
              'gdCodeSrc': app33.gdly,
              'bxKeshiNum': app33.section,
              'wxShiXNum': app33.matter,
              'gdRange':app33.whether,
              'gdFsShij':$('.otime').val()
            };
            register();
          } else {
            if (isEqual(_obj, gdInfo)) {
              //提示不能重复登记
              _moTaiKuang($('#myModal2'), '提示', 'flag','istap','不能重复登记！' , '');
            } else {
              //满足登记条件
              register();
            }
          }

        }
      })
      //编辑
      .on('click', '.bianji', function () {
        if (app33.telephone == '' || app33.person == '' || app33.place == '' || app33.section == '' || app33.matter == '') {
          _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '请填写红色必填项！', '');
        } else {
          $('.loading').showLoading();
          var gdInfo = {
            'gdCode': _gdCode,
            'gdJJ': app33.picked,
            'bxRen': app33.person,
            'bxDianhua': app33.telephone,
            'bxKeshi': $('.cjz').eq(0).children('option:selected').html(),
            'wxDidian': app33.place,
            'wxShiX': $('.xitong').eq(0).children('option:selected').html(),
            'wxKeshi': '',
            'bxBeizhu': $('.remarkDes').eq(0).val(),
            'userID': _userIdNum,
            'gdLeixing': app33.rwlx,
            'dName': app33.sbMC,
            'gdSrc': 2,
            'wxShebei': app33.sbSelect,
            'dcName': app33.sbLX,
            'installAddress': app33.azAddress,
            'userName': _userIdName,
            'gdCodeSrc': app33.gdly,
            'bxKeshiNum': app33.section,
            'wxShiXNum': app33.matter,
            'gdRange':app33.whether,
            'gdFsShij':$('.otime').val()
          };
          $.ajax({
            type: 'post',
            url: _urls + 'YWGD/ywGDUpt',
            data: gdInfo,
            success: function (result) {
              if (result == 99) {
                $('.loading').hideLoading();
                _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '编辑成功！', '');
                $('#myModal').modal('hide');
                //刷新数据
                conditionSelect();
              } else {
                $('.loading').hideLoading();
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','编辑失败！', '');
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $('.loading').hideLoading();
              console.log(jqXHR.responseText);
            }
          })
        }
      })
      //查看图片
      .on('click', '.viewImage', function () {
        $('.loading').showLoading();
        if (_imgNum) {
          $('.loading').hideLoading();
          var str = '';
          for(var i=0;i<_imgNum;i++){
            str += '<img class="viewIMG" src="' +
                replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + i +
                '">'
          }
          $('.showImage').html('');
          $('.showImage').append(str);
          $('.showImage').show();
        } else {
          $('.loading').hideLoading();
          $('.showImage').html('没有图片');
          $('.showImage').show();
        }
      })
      //图片详情
      .on('click', '.viewIMG', function () {
        _moTaiKuang($('#myModal3'), '图片详情', 'flag','','');
        var imgSrc = $(this).attr('src')
        $('#myModal3').find('img').attr('src', imgSrc);
      })

  $('.quickDengji').click(function () {
    if (quickWork.telephone == '' || quickWork.person == '' || quickWork.place == ''  || quickWork.section == '' || quickWork.matter == '' || quickWork.weixiukeshis == '' || $('.weixiuBZ').val() == '') {
      _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','请填写红色必填项!', '')
    } else {
      $('.loading').showLoading();
      var gdInfo1 = {
        'gdJJ': quickWork.picked,
        'bxRen': quickWork.person,
        'bxDianhua': quickWork.telephone,
        'bxKeshi': $('.cjz1').children('option:selected').html(),
        'wxDidian': quickWork.place,
        'wxShiX': $('.xitong').eq(1).children('option:selected').html(),
        'wxKeshi': quickWork.weixiukeshis,
        'bxBeizhu': $('.remarkDes').eq(1).val(),
        'userID': _userIdNum,
        'gdLeixing': quickWork.rwlx,
        'dName': quickWork.sbMC,
        'gdSrc': 2,
        'wxShebei': quickWork.sbSelect,
        'dcName': quickWork.sbLX,
        'installAddress': quickWork.azAddress,
        'wxBeizhu': $('.weixiuBZ').val(),
        'gdCodeSrc': quickWork.gdly,
        'bxKeshiNum': quickWork.section,
        'wxShiXNum': quickWork.matter,
        'gdRange':quickWork.whether,
        'gdFsShij':$('.otimes').val()
      };
      if ($.isEmptyObject(_quickObj)) {
        _quickObj = {
          'gdJJ': quickWork.picked,
          'bxRen': quickWork.person,
          'bxDianhua': quickWork.telephone,
          'bxKeshi': $('.cjz1').children('option:selected').html(),
          'wxDidian': quickWork.place,
          'wxShiX': $('.xitong').eq(1).children('option:selected').html(),
          'wxKeshi': quickWork.weixiukeshis,
          'bxBeizhu': $('.remarkDes').eq(1).val(),
          'userID': _userIdNum,
          'gdLeixing': quickWork.rwlx,
          'dName': quickWork.sbMC,
          'gdSrc': 2,
          'wxShebei': quickWork.sbSelect,
          'dcName': quickWork.sbLX,
          'installAddress': quickWork.azAddress,
          'wxBeizhu': $('.weixiuBZ'),
          'gdCodeSrc': quickWork.gdly,
          'bxKeshiNum': quickWork.section,
          'wxShiXNum': quickWork.matter,
          'gdRange':quickWork.whether,
          'gdFsShij':$('.otimes').val()
        };
        QuickRegister();
      } else {
        if (isEqual(_quickObj, gdInfo1)) {
          //提示不能重复登记
          _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '不能重复登记！', '');
        } else {
          QuickRegister();
        }
      }
    }
  })

  $('.confirm').click(function () {
    $(this).parents('.modal').modal('hide');
  });

  /*---------------------------------表格绑定事件-------------------------------------*/
  //主表格事件
  $('#scrap-datatables tbody')
  //查看功能
      .on('click', '.option-see', function () {
        _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
        $('.loading').showLoading();
        //绑定数据
        ViewOrEdit($(this), 'flag');
        $('.seeBlock').show();
        //图片区域隐藏
        $('.showImage').hide();
      })
      //编辑功能
      .on('click', '.option-edit', function () {
        _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
        $('.loading').showLoading();
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('bianji').html('保存');
        //绑定数据
        ViewOrEdit($(this));
        //图片区域隐藏
        $('.showImage').hide();
      })

  /*-------------------------------方法----------------------------------------*/
  //获取到影响单位、用户分类
  function InfluencingUnit(){
    var prm = {
      "userID": _userIdNum,
      "userName": _userIdNum
    }
    $.ajax({
      type:'post',
      url:_urls + 'YWGD/ywGDGetWxBanzuStation',
      data:prm,
      success:function(result){
        _InfluencingArr.length = 0;
        _bzArr.length = 0;
        //判断session中的变量是在维保组还是在维修班组中，
        for(var i=0;i<result.stations.length;i++){
          if(_maintenanceTeam == result.stations[i].departNum){
            _isWBZ = true;
            _InfluencingArr.push(result.stations[i]);
            for(var j=0;j<result.stations[i].wxBanzus.length;j++){
              _bzArr.push(result.stations[i].wxBanzus[j]);
            }
          }
        }
        for(var i=0;i<result.wxBanzus.length;i++){
          if(_maintenanceTeam == result.wxBanzus[i].departNum){
            _isBZ = true;
            _bzArr.push(result.wxBanzus[i]);
          }
        }
        //按条件加载
        conditionSelect();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    })
  }
  //条件查询
  function conditionSelect() {
    //获取条件
    var filterInput = [];
    var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
    for (var i = 0; i < filterInputValue.length; i++) {
      filterInput.push(filterInputValue.eq(i).val());
    }
    realityStart = filterInput[2] + ' 00:00:00';
    realityEnd = moment(filterInput[3]).add(1, 'd').format('YYYY/MM/DD') + ' 00:00:00';
    var prm = {
      'gdCode2': filterInput[0],
      'gdSt': realityStart,
      'gdEt': realityEnd,
      'bxKeshi': filterInput[1],
      "gdZht": 1,
      'userID': _userIdNum,
      'userName': _userIdName,
    };
    var wbzArr = [];
    if(_isWBZ){
      for(var i=0;i<_bzArr.length;i++){
        wbzArr.push(_bzArr[i].departNum);
      }
      prm.wxKeshis = wbzArr;
    }else if(_isBZ){
      prm.wxKeshi = _maintenanceTeam;
    }
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDGetDJ',
      timeout:30000,
      data: prm,
      success: function (result) {
        $('.loading').hideLoading();
        datasTable($("#scrap-datatables"), result);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    })
  }

  //dataTables表格填数据
  function datasTable(tableId, arr) {
    if (arr.length == 0) {
      var table = tableId.dataTable();
      table.fnClearTable();
      table.fnDraw();
    } else {
      var table = tableId.dataTable();
      table.fnClearTable();
      table.fnAddData(arr);
      table.fnDraw();
    }
  }

  //ajaxFun（select的值）
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
        //给select赋值
        var str = '<option value="">请选择</option>';
        for (var i = 0; i < result.length; i++) {
          str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
          allArr.push(result[i]);
        }
        select.empty().append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    })
  }

  //表格初始化方法
  function tableInit(tableID, col, fun) {
    tableID.DataTable({
      'autoWidth': false,  //用来启用或禁用自动列的宽度计算
      'paging': true,   //是否分页
      'destroy': true,//还原初始化了的datatable
      'searching': true,
      'ordering': false,
      "iDisplayLength":50,//默认每页显示的条数
      'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 条',
        'zeroRecords': '没有数据',
        'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
        'infoEmpty': '没有数据',
        'sSearch': '查询',
        'paginate': {
          "previous": "上一页",
          "next": "下一页",
          "first": "首页",
          "last": "尾页"
        }
      },
      "dom": 't<"F"lip>',
      'buttons': [
        {
          extend: 'excelHtml5',
          text: '保存为excel格式',
        },
      ],
      'columns': col,
      'rowCallback': fun
    })
  }

  //判断两个对象是否相同
  function isEqual(obj1, obj2) {
    for (var name in obj1) {
      if (obj1[name] !== obj2[name]) return false;
    }
    for (var name in obj2) {
      if (obj1[name] !== obj2[name]) return false;
    }
    return true;
  }

  //登记方法
  function register() {
    var gdInfo = {
      'gdJJ': app33.picked,
      'bxRen': app33.person,
      'bxDianhua': app33.telephone,
      'bxKeshi': $('.cjz').eq(0).children('option:selected').html(),
      'wxDidian': app33.place,
      'wxShiX': $('.xitong').eq(0).children('option:selected').html(),
      'wxKeshi': '',
      'bxBeizhu': $('.remarkDes').eq(0).val(),
      'userID': _userIdNum,
      'gdLeixing': app33.rwlx,
      'dName': app33.sbMC,
      'gdSrc': 2,
      'wxShebei': app33.sbLX,
      'dcName': app33.sbSelect,
      'installAddress': app33.azAddress,
      'userName': _userIdName,
      'gdCodeSrc': app33.gdly,
      'bxKeshiNum': app33.section,
      'wxShiXNum': app33.matter,
      'gdRange':app33.whether,
      'gdFsShij':$('.otime').val()
    };
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDCreDJ',
      data: gdInfo,
      success: function (result) {
        if (result == 99) {
          $('.loading').hideLoading();
          _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加成功', '');
          $('#myModal').modal('hide');
          //刷新表格
          conditionSelect();
        } else {
          $('.loading').hideLoading();
          _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加失败', '');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    })
  }

  //快速报障
  function QuickRegister() {
    var weixiuRen = [
      {
        wxRen: _userIdNum,
        wxRName: _userIdNum,
        wxRDh: ''
      }
    ];
    var gdInfo = {
      'gdJJ': quickWork.picked,
      'bxRen': quickWork.person,
      'bxDianhua': quickWork.telephone,
      'bxKeshi': $('.cjz1').children('option:selected').html(),
      'wxDidian': quickWork.place,
      'wxShiX': $('.xitong').eq(1).children('option:selected').html(),
      'wxKeshi': quickWork.weixiukeshis,
      'bxBeizhu': $('.remarkDes').eq(1).val(),
      'userID': _userIdNum,
      'gdLeixing': quickWork.rwlx,
      'dName': quickWork.sbMC,
      'gdSrc': 2,
      'wxShebei': quickWork.sbSelect,
      'dcName': quickWork.sbLX,
      'installAddress': quickWork.azAddress,
      'gdWxRs': weixiuRen,
      'wxBeizhu': $('.weixiuBZ').val(),
      'userName': _userIdName,
      'gdCodeSrc': app33.gdly,
      'bxKeshiNum': quickWork.section,
      'wxShiXNum': quickWork.matter,
      'gdRange':quickWork.whether,
      'gdFsShij':$('.otimes').val()
    };
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDCreQuickDJ',
      data: gdInfo,
      success: function (result) {
        if (result == 99) {
          $('.loading').hideLoading();
          _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加成功!', '');
          $('#myModal4').modal('hide');
          //刷新表格
          conditionSelect();
        } else {
          $('.loading').hideLoading();
          _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加失败!', '');

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    })
  }

  //编辑、查看详情的时候绑定数据
  function ViewOrEdit(el, flag) {
    //确定按钮消失；
    var $this = el.parents('tr');
    currentTr = $this;
    currentFlat = true;
    $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
    $this.addClass('tables-hover');
    if (flag) {
      _moTaiKuang($('#myModal'), '工单详情', 'flag', '','', '');
    } else {
      _moTaiKuang($('#myModal'), '编辑工单', '', '','', '保存');
    }
    //获取详情
    var gongDanState = $this.children('.ztz').html();
    var gongDanCode = $this.children('.gongdanId').children('span').attr('gdCode');
    _gdCode = gongDanCode;
    var prm = {
      'gdCode': gongDanCode,
      'gdZht': gongDanState,
      'userID': _userIdNum,
      'userName': _userIdName,
      'gdCircle': _gdCircle
    }
    //每次获取弹出框中执行人员的数量
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDGetDetail',
      timeout:30000,
      data: prm,
      success: function (result) {
        $('.loading').hideLoading();
        //设置单选按钮
        if (result.gdJJ == 1) {
          $('#myApp33').find('.inpus').parent('span').removeClass('checked');
          $('#myApp33').find('#ones').parent('span').addClass('checked');
        } else {
          $('#myApp33').find('.inpus').parent('span').removeClass('checked');
          $('#myApp33').find('#twos').parent('span').addClass('checked');
        }
        //selecrt绑定值
        if (result.bxKeshiNum == '') {
          app33.section = 0;
        } else {
          app33.section = result.bxKeshiNum;
        }
        if (result.wxShiXNum == '') {
          app33.matter = 0;
        } else {
          app33.matter = result.wxShiXNum;
        }
        //绑定弹窗数据
        app33.telephone = result.bxDianhua;
        app33.person = result.bxRen;
        app33.place = result.wxDidian;
        $('.remarkDes').eq(0).val(result.bxBeizhu),
        app33.sbSelect = result.wxShebei;
        app33.sbLX = result.dcName;
        app33.sbMC = result.dName;
        app33.azAddress = result.installAddress;
        app33.rwlx = result.gdLeixing;
        _imgNum = result.hasImage;
        app33.gdCode = result.gdCode2;
        app33.state = result.gdZht;
        app33.state = stateTransform(result.gdZht);
        $('.otime').val(result.gdFsShij);
        $('.dtime').val(result.gdShij);
        //所有input不可操作
        if (flag) {
          $('#myApp33').find('input').attr('disabled', true).addClass('disabled-block');
          $('#myApp33').find('select').attr('disabled', true).addClass('disabled-block');
          $('#myApp33').find('textarea').attr('disabled', true).addClass('disabled-block');
        } else {
          $('#myApp33').find('input').attr('disabled', false).removeClass('disabled-block');
          $('#myApp33').find('select').attr('disabled', false).removeClass('disabled-block');
          $('#myApp33').find('textarea').attr('disabled', false).removeClass('disabled-block');
          $('#myApp33').find('.inpus').attr('disabled', true);
          $('.seeBlock').children('.input-blockeds').children('input').attr('disabled',true).addClass('disabled-block');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    });
  }

  //不打印部分
  function noPrint(el) {
    el.addClass('noprint')
  }

  //线路数据,所有车站
  function lineRouteData(arr){
    var prm = {
      'userID':_userIdNum,
      'userName':_userIdName
    }
    $.ajax({
      type:'post',
      url:_urls + 'YWGD/ywGetDLines',
      data:prm,
      timeout:_theTimes,
      success:function(result){
        _lineArr.length = 0;
        for(var i=0;i<result.length;i++){
          _lineArr.push(result[i]);
        }
        var str = '<option value="">请选择</option>';
        for(var i=0;i<result.length;i++){
          str += '<option value="' + result[i].dlNum + '">' + result[i].dlName + '</option>';
        }
        $('#line-route').empty().append(str);
        $('#line-route1').empty().append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('.loading').hideLoading();
        console.log(jqXHR.responseText);
      }
    })
  }

  //vue单选框
  function selectRadio(el,classname,$this){
    el.find(classname).click(function (a) {
      el.find(classname).parent('span').removeClass('checked');
      $this.parent('span').addClass('checked');
    })
  }

  //IP替换
  function replaceIP(str,str1){
    var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
    var res = ip.exec(str1);  /*211.100.28.180*/
    str = str.replace(ip,res);
    return str;
  }

  //状态值转换
  function stateTransform(ztz){
    if (ztz == 1) {
      return '待下发'
    }
    if (ztz == 2) {
      return '待分派'
    }
    if (ztz == 3) {
      return '待执行'
    }
    if (ztz == 4) {
      return '执行中'
    }
    if (ztz == 5) {
      return '等待资源'
    }
    if (ztz == 6) {
      return '待关单'
    }
    if (ztz == 7) {
      return '任务关闭'
    }
    if (ztz == 999) {
      return '任务取消'
    }
  }
})