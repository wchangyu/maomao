$(function () {
  /*--------------------------全局变量初始化设置----------------------------------*/
  //页面列表加载
  $('.loading').showLoading();

  //获得用户ID
  var _userIdNum = sessionStorage.getItem('userName');

  //获得用户名

  var _userIdName = sessionStorage.getItem('realUserName');

  //获取本地url
  var _urls = sessionStorage.getItem("apiUrlPrefixYW");

  //开始/结束时间插件
  $('.datatimeblock').datepicker({
    language: 'zh-CN',
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
    val = val.replace(/^\s+|\s+$/g, '');
    return /[^.\s]{1,500}$/.test(val)
  })

  //登记信息绑定
  var app33 = new Vue({
    el: '#myApp33',
    data: {
      picked: '1',
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
      remarks: '',
      gdly: 1,
      lineRoute: ''
    },
    methods: {
      radios: function () {
        $('#myApp33').find('.inpus').click(function (a) {
          $('#myApp33').find('.inpus').parent('span').removeClass('checked');
          $(this).parent('span').addClass('checked');
        })
      },
      selectLine:function(){
        //首先将select子元素清空；
         $('.cjz').empty();
         //获得选中的线路的value
         var values = $('#line-route').val();
         if(values == ''){
         //所有车站
           ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('.cjz'), 'ddName', 'ddNum');
         }else{
           for(var i=0;i<_lineArr.length;i++){
             if(values == _lineArr[i].dlNum){
               //创建对应的车站
               var str = '<option value="">请选择</option>';
               for(var j=0;j<_lineArr[i].deps.length;j++){
                 str += '<option value="' + _lineArr[i].deps[j].ddNum +
                 '">'+ _lineArr[i].deps[j].ddName + '</option>';
               }
               $('.cjz').append(str);
             }
           }
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
      beizhus: '',
      weixiuBZ: '',
      gdly: '1',
      lineRoute: ''
    },
    methods: {
      radios: function () {
        $('#quickWork').find('.inpus').click(function (a) {
          $('#quickWork').find('.inpus').parent('span').removeClass('checked');
          $(this).parent('span').addClass('checked');
        })
      },
      selectLine:function(){
        //首先将select子元素清空；
        $('.cjz1').empty();
        //获得选中的线路的value
        var values = $('#line-route1').val();
        if(values == ''){
          //所有车站
          ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('.cjz1'), 'ddName', 'ddNum');
        }else{
          for(var i=0;i<_lineArr.length;i++){
            if(values == _lineArr[i].dlNum){
              //创建对应的车站
              var str = '<option value="">请选择</option>';
              for(var j=0;j<_lineArr[i].deps.length;j++){
                str += '<option value="' + _lineArr[i].deps[j].ddNum +
                    '">'+ _lineArr[i].deps[j].ddName + '</option>'
              }
              $('.cjz1').append(str);
            }
          }
        }
      }
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

  /*-----------------------------表格初始化----------------------------------------*/
  //页面表格
  var table = $('#scrap-datatables').DataTable({
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    "paging": true,   //是否分页
    "destroy": true,//还原初始化了的datatable
    "searching": true,
    "ordering": false,
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
        title: '车站',
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
        text: '导出',
        className: 'saveAs btn btn-success'
      }
    ],
    "columns": [
      {
        title: '编号',
        data: 'id',
        visible: false,
        className: 'ids'
      },
      {
        title: '设备编号',
        data: 'dNum',
        className: 'dNum'
      },
      {
        title: '设备名称',
        data: 'dName',
        className: 'dName'
      },
      {
        title: '规格型号',
        data: 'spec',
      },
      {
        title: '设备类型',
        data: 'dcName',
        className: 'dcName'
      },
      {
        title: '购置日期',
        data: 'purDate',
        render: function timeForma(data) {
          return data.split(' ')[0].replace(/-/g, '/');
        }
      },
      {
        title: '保修年限',
        data: 'maintain',
      },
      {
        title: '安装时间',
        data: 'installDate',
        render: function timeForma(data) {
          return data.split(' ')[0].replace(/-/g, '/');
        }
      },
      {
        title: '使用年限',
        data: 'life',
      },
      {
        title: '状态',
        data: 'status',
        render: function (data, type, full, meta) {
          if (data == 1) {
            return '正常'
          } else if (data == 2) {
            return '维修'
          } else if (data == 3) {
            return '报废'
          }
        }
      },
      {
        title: '设备部门',
        data: 'ddName',
        className: 'ddName'
      },
      {
        title: '设备系统',
        data: 'dsName',
      }
    ],
    "aoColumnDefs": [
      {
        sDefaultContent: '',
        aTargets: ['_all']
      }
    ]
  });

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
  conditionSelect();

  //线路数据
  lineRouteData($('#line-route'));

  //线路数据（快速）
  lineRouteData($('#line-route1'));

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
      var myModal = $('#myModal2')
      myModal.find('.modal-body').html('起止时间不能为空!');
      moTaiKuang(myModal, '提示', 'flag');
    } else {
      //结束时间不能小于开始时间
      if ($('.min').val() > $('.max').val()) {
        var myModal = $('#myModal2');
        //提示框
        myModal.find('.modal-body').html('起止时间不能大于结束时间!');
        moTaiKuang(myModal, '提示', 'flag');
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
    app33.remarks = '';
    app33.sbSelect = '';
    app33.sbLX = '';
    app33.sbMC = '';
    app33.azAddress = '';
    app33.gdly = 1;
    moTaiKuang($('#myModal'), '登记');
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
    quickWork.beizhus = '';
    quickWork.weixiuBZ = '';
    quickWork.gdly = '1';
    moTaiKuang($('#myModal4'), '快速报障');
    //将执行人默认为本人
    var personObject = {};
    personObject.wxRName = _userIdNum;
    personObject.wxrID = _userIdNum;
    personObject.wxRDh = '';
    _zhixingRens = [];
    _zhixingRens.push(personObject);
    datasTable($('#personTable1'), _zhixingRens);
  })

  //确定按钮
  $('#myModal')
  //登记
      .on('click', '.dengji', function () {
        if (app33.telephone == '' || app33.person == '' || app33.place == ''  || app33.section == '' || app33.matter == '') {
          var myModal = $('#myModal2');
          myModal.find('.modal-body').html('请填写红色必填项!');
          moTaiKuang(myModal, '提示', 'flag');
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
            'bxBeizhu': app33.remarks,
            'userID': _userIdNum,
            'gdLeixing': app33.rwlx,
            'dName': app33.sbMC,
            'gdSrc': 2,
            'wxShebei': app33.sbSelect,
            'dcName': app33.sbLX,
            'installAddress': app33.azAddress,
            'gdCodeSrc': app33.gdly,
            'bxKeshiNum': app33.section,
            'wxShiXNum': app33.matter
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
              'bxBeizhu': app33.remarks,
              'userID': _userIdNum,
              'gdLeixing': app33.rwlx,
              'dName': app33.sbMC,
              'gdSrc': 2,
              'wxShebei': app33.sbSelect,
              'dcName': app33.sbLX,
              'installAddress': app33.azAddress,
              'gdCodeSrc': app33.gdly,
              'bxKeshiNum': app33.section,
              'wxShiXNum': app33.matter
            };
            register();
          } else {
            if (isEqual(_obj, gdInfo)) {
              //提示不能重复登记
              moTaiKuang($('#myModal2'), '提示', 'flag');
              $('#myModal2').find('.modal-body').html('不能重复登记！');
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
          var myModal = $('#myModal2');
          myModal.find('.modal-body').html('请填写红色必填项！');
          moTaiKuang(myModal, '提示', 'flag');
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
            'bxBeizhu': app33.remarks,
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
            'wxShiXNum': app33.matter
          };
          $.ajax({
            type: 'post',
            url: _urls + 'YWGD/ywGDUpt',
            data: gdInfo,
            success: function (result) {
              if (result == 99) {
                $('.loading').hideLoading();
                var myModal = $('#myModal2');
                myModal.find('.modal-body').html('编辑成功！');
                moTaiKuang(myModal, '提示', 'flag');
                $('#myModal').modal('hide');
                //刷新数据
                conditionSelect();
              } else {
                $('.loading').hideLoading();
                var myModal = $('#myModal2');
                myModal.find('.modal-body').html('编辑失败！');
                moTaiKuang(myModal, '提示', 'flag');
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
          for (var i = 0; i < _imgNum; i++) {
            str += '<img class="viewIMG" src="http://211.100.28.180/ApService/dimg.aspx?gdcode=' + _gdCode + '&no=' + i +
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
        moTaiKuang($('#myModal3'), '图片详情', 'flag');
        var imgSrc = $(this).attr('src')
        $('#myModal3').find('img').attr('src', imgSrc);
      })

  $('.quickDengji').click(function () {
    if (quickWork.telephone == '' || quickWork.person == '' || quickWork.place == ''  || quickWork.section == '' || quickWork.matter == '' || quickWork.weixiukeshis == '') {
      var myModal = $('#myModal2');
      myModal.find('.modal-body').html('请填写红色必填项');
      moTaiKuang(myModal, '提示', 'flag');
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
        'bxBeizhu': quickWork.beizhus,
        'userID': _userIdNum,
        'gdLeixing': quickWork.rwlx,
        'dName': quickWork.sbMC,
        'gdSrc': 2,
        'wxShebei': quickWork.sbSelect,
        'dcName': quickWork.sbLX,
        'installAddress': quickWork.azAddress,
        'wxBeizhu': quickWork.weixiuBZ,
        'gdCodeSrc': quickWork.gdly,
        'bxKeshiNum': quickWork.section,
        'wxShiXNum': quickWork.matter
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
          'bxBeizhu': quickWork.beizhus,
          'userID': _userIdNum,
          'gdLeixing': quickWork.rwlx,
          'dName': quickWork.sbMC,
          'gdSrc': 2,
          'wxShebei': quickWork.sbSelect,
          'dcName': quickWork.sbLX,
          'installAddress': quickWork.azAddress,
          'wxBeizhu': quickWork.weixiuBZ,
          'gdCodeSrc': quickWork.gdly,
          'bxKeshiNum': quickWork.section,
          'wxShiXNum': quickWork.matter
        };
        QuickRegister();
      } else {
        if (isEqual(_quickObj, gdInfo1)) {
          //提示不能重复登记
          moTaiKuang($('#myModal2'), '提示', 'flag');
          $('#myModal2').find('.modal-body').html('不能重复登记！');
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
        //工单来源隐藏
        $('.gdly').parents('li').hide();
        //绑定数据
        ViewOrEdit($(this), 'flag');
        //图片区域隐藏
        $('.showImage').hide();
      })
      //编辑功能
      .on('click', '.option-edit', function () {
        _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
        $('.loading').showLoading();
        //工单来源隐藏
        $('.gdly').parents('li').hide();
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('bianji').html('编辑');
        //绑定数据
        ViewOrEdit($(this));
        //图片区域隐藏
        $('.showImage').hide();
      })

  /*-------------------------------方法----------------------------------------*/
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
      'wxKeshi': '',
      "gdZht": 1,
      'userID': _userIdNum,
      'userName': _userIdName,
    }
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDGetDJ',
      async: false,
      data: prm,
      success: function (result) {
        console.log(result);
        $('.loading').hideLoading();
        datasTable($("#scrap-datatables"), result);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    })
  }

  //模态框自适应
  function moTaiKuang(who, title, flag) {
    who.modal({
      show: false,
      backdrop: 'static'
    })
    who.find('.modal-title').html(title);
    who.modal('show');
    var markHeight = document.documentElement.clientHeight;
    var markBlockHeight = who.find('.modal-dialog').height();
    var markBlockTop = (markHeight - markBlockHeight) / 2;
    who.find('.modal-dialog').css({'margin-top': markBlockTop});
    if (flag) {
      who.find('.btn-primary').hide();
    } else {
      who.find('.btn-primary').show();
    }
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
      async: false,
      data: prm,
      success: function (result) {
        //给select赋值
        var str = '<option value="">请选择</option>';
        for (var i = 0; i < result.length; i++) {
          str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
          allArr.push(result[i]);
        }
        select.append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
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
      'bxBeizhu': app33.remarks,
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
      'wxShiXNum': app33.matter
    };
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDCreDJ',
      data: gdInfo,
      success: function (result) {
        if (result == 99) {
          $('.loading').hideLoading();
          var myModal = $('#myModal2');
          myModal.find('.modal-body').html('添加成功!');
          moTaiKuang(myModal, '提示');
          $('#myModal').modal('hide');
          //刷新表格
          conditionSelect();
        } else {
          $('.loading').hideLoading();
          var myModal = $('#myModal2');
          myModal.find('.modal-body').html('添加失败!');
          moTaiKuang(myModal, '提示');
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
      'bxBeizhu': quickWork.beizhus,
      'userID': _userIdNum,
      'gdLeixing': quickWork.rwlx,
      'dName': quickWork.sbMC,
      'gdSrc': 2,
      'wxShebei': quickWork.sbSelect,
      'dcName': quickWork.sbLX,
      'installAddress': quickWork.azAddress,
      'gdWxRs': weixiuRen,
      'wxBeizhu': quickWork.weixiuBZ,
      'userName': _userIdName,
      'gdCodeSrc': app33.gdly,
      'bxKeshiNum': quickWork.section,
      'wxShiXNum': quickWork.matter
    };
    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDCreQuickDJ',
      data: gdInfo,
      success: function (result) {
        if (result == 99) {
          $('.loading').hideLoading();
          $('#myModal4').modal('hide');
          var myModal = $('#myModal2');
          myModal.find('.modal-body').html('添加成功!');
          moTaiKuang(myModal, '提示', 'flag');
          //刷新表格
          conditionSelect();
        } else {
          $('.loading').hideLoading();
          var myModal = $('#myModal2');
          myModal.find('.modal-body').html('添加失败!');
          moTaiKuang(myModal, '提示', 'flag');
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
      moTaiKuang($('#myModal'), '工单详情', 'flag');
    } else {
      moTaiKuang($('#myModal'), '编辑工单');
    }
    //获取详情
    var gongDanState = $this.children('.ztz').html();
    var gongDanCode = $this.children('.gongdanId').children('span').attr('gdCode');
    _gdCode = gongDanCode;
    console.log(_gdCircle);
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
      async: false,
      data: prm,
      success: function (result) {
        $('.loading').hideLoading();
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
        app33.remarks = result.bxBeizhu;
        app33.sbSelect = result.wxShebei;
        app33.sbLX = result.dcName;
        app33.sbMC = result.dName;
        app33.azAddress = result.installAddress;
        app33.rwlx = result.gdLeixing;
        _imgNum = result.hasImage;
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

  //线路数据
  function lineRouteData(el) {
    var prm = {
      'userID':_userIdNum
    }
    $.ajax({
      type:'post',
      url:_urls + 'YWGD/ywGetDLines',
      data:prm,
      success:function(result){
        _lineArr = [];
        var str = '<option value="">请选择</option>';
        for(var i=0;i<result.length;i++){
          _lineArr.push(result[i]);
          str += '<option value="' + result[i].dlNum +
              '">' + result[i].dlName +'</option>'
        }
        el.append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    })
  }
})