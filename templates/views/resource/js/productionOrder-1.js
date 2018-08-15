//记录当前工单号
var _gdCode = '';

$(function(){

  /*-----------------------------------------------------变量-----------------------------------------*/

  _timeYMDComponentsFun($('.condition-query').eq(0).find('.datatimeblock'));

  //datatimepicker故障发生时间；

  _timeHMSComponentsFun($('.otime'),1);

  _timeHMSComponentsFun($('.otimes'),1);

  //设置初始时间(主表格时间)
  var now = moment().format('YYYY/MM/DD');

  var st = moment(now).subtract(6,'months').format('YYYY/MM/DD');

  //显示时间
  $('.min').val(st);

  $('.max').val(now);

  //登记Vue对象
  var detaileVue = new Vue({

    el:'#myApp33',
    data:{

      //工单号
      gdCode:'',
      //工单状态
      state:'',
      //工单类型
      picked:0,
      //工单来源
      gdly:1,
      //任务级别
      rwlx:4,
      //报修电话
      telephone:'',
      //报修人信息
      person:'',
      //故障位置
      place:'',
      //线路
      lineRoute:'',
      //车站
      section:'',
      //系统类型
      matter:'',
      //设备编码
      sbSelect:'',
      //设备名称
      sbMC:''
    }

  })

  //快速Vue对象
  var quickVue = new Vue({

    el:'#quickWork',
    data:{

      //工单类型
      picked:1,
      //工单来源
      gdly:1,
      //任务级别
      rwlx:4,
      //报修电话
      telephone:'',
      //报修人信息
      person:'',
      //故障位置
      place:'',
      //线路
      lineRoute:'',
      //车站
      section:'',
      //系统类型
      matter:'',
      //维修班组
      weixiukeshis:'',
      //维修设备
      sbSelect:'',
      //设备编码
      sbLX:'',
      //设备名称
      sbMC:''
    }

  })

  //vue验证
  Vue.validator('telephones', function (val) {

    return /^[0-9]*$/.test(val)

  })

  //验证必填项（非空）
  Vue.validator('required', function (val) {
    //获取内容的时候先将首尾空格删除掉；
    val = val.replace(/^\s+|\s+$/g, '');

    return /[^.\s]{1,500}$/.test(val);

  })

  //系统类型
  _getProfession('YWDev/ywDMGetDSs', $('.xitong'),false, 'dsNum' ,'dsName');

  //线路数组
  var _lineArr = [];

  //线路
  _ajaxFun('YWGD/ywGetDLines', _lineArr, $('.line-route'), 'dlName', 'dlNum' );

  var _stationArr = [];

  //车站
  _ajaxFun('YWDev/ywDMGetDDs', _stationArr, $('.cjz'), 'ddName', 'ddNum' )

  //条件查询车站
  addStationDom($('#bumen').parent());

  //当前部门下的车站
  _stationData();

  //判断当前是普通报障还是快速报障
  var _commonFlag = false;

  //判断当前是普通报障还是快速报障
  var _quickFlag = false;

  /*-----------------------------------------------------表格初始化------------------------------------------*/
  var col = [

    {
      title: '工单号',
      data: 'gdCode2',
      className: 'gongdanId',
      render: function (data, type, row, meta) {
        return '<span gdCode="' + row.gdCode +
            '" gdCircle="' + row.gdCircle +
            '" gdZtz="' + row.gdZht +
            '">' + data +
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
      title:  __names.department,
      data: 'bxKeshi'
    },
    {
      title: '设备类型',
      data: 'dcName'
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

  //导出列
  var _exportCol = [0,1,2,3,4,5,6];

  _tableInit($('#scrap-datatables'),col,1,true,'','','',_exportCol);

  _WxBanzuStationData(conditionSelect);

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
  _tableInit($('#personTable1'), col2,2,false,'','',true);

  /*-------------------------------------------------------按钮事件------------------------------------------*/

  //【查询】
  $('#selected').click(function(){

    conditionSelect();

  })

  //【重置】
  $('.resites').click(function(){

    //input，select，textarea清空
    $('.condition-query').eq(0).find('input').val('');

    //时间初始化
    $('.condition-query').eq(0).find('.datatimeblock').eq(0).val(st);

    $('.condition-query').eq(0).find('.datatimeblock').eq(1).val(now);

    //车站初始化
    $('#bumen').parent().next().find('span').removeAttr('values').html('全部');

  })

  //【登记】
  $('.creatButton').click(function(){

    //普通标识
    _commonFlag = true;

    $('#theLoading').modal('show');

    //初始化
    detailedInit();

    //模态框
    _moTaiKuang($('#myModal'),'登记','','','','登记');

    //是否可操作
    abledOption();

    //添加类
    $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('bianji').addClass('dengji');

    //隐藏不显示项
    $('#myApp33').find('.seeBlock').hide();

    //线路显示
    if( __routeShow){

      $('.routeShow').show();

    }else{

      $('.routeShow').hide();

    }

    $('#theLoading').modal('hide');

  })

  //【快速登记】
  $('.quickCreat').click(function(){

    _quickFlag = true;

    $('#theLoading').modal('show');

    //初始化
    quickInit();

    //模态框
    _moTaiKuang($('#myModal4'),'快速报障','','','','快速报障');

    $('#theLoading').modal('hide');

    //获取用户所在的部门

    quickVue.weixiukeshis = _loginUser.departName;

    $('#wxbm').attr('data-num',_loginUser.departNum);


  })

  //模态框关闭的回调方法
  $('#myModal').on('hide.bs.modal',function(){

    _commonFlag = false;

    _quickFlag = false;

  })

  //模态框关闭的回调方法
  $('#myModal4').on('hide.bs.modal',function(){

    _commonFlag = false;

    _quickFlag = false;

  })

  //快速登记确定按钮
  $('#myModal4').on('click','.quickDengji',function(){

    //验证
    if( quickVue.telephone == '' || quickVue.person == '' || quickVue.place == '' || quickVue.section == '' || quickVue.matter == '' || $('#quickWork').find('.weixiuBZ').val() == ''){

      _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '请填写红色必填项!', '');

    }else{

      var cheName = '';

      if( quickVue.section == ' ' ){

        cheName = '';

      }else{

        cheName = $('#quickWork').find('.cjz').children('option:selected').html();

      }

      var xiName = '';

      if( quickVue.matter == '' ){

        xiName = '';

      }else{

        xiName = $('#quickWork').find('.xitong').children('option:selected').html();

      }

      var weixiuRen = [
        {
          wxRen: _userIdNum,
          wxRName: _userIdName,
          wxRDh: ''
        }
      ];

      var prm = {

        //工单类型
        gdJJ:quickVue.picked,
        //工单来源
        gdCodeSrc:quickVue.gdly,
        //任务级别
        gdLeixing:quickVue.rwlx,
        //报修电话
        bxDianhua:quickVue.telephone,
        //报修人
        bxRen:quickVue.person,
        //故障位置
        wxDidian:quickVue.place,
        //线路（不传）
        //车站编码
        bxKeshiNum:quickVue.section,
        //车站名称
        bxKeshi:cheName,
        //系统类型名称
        dcName:xiName,
        //系统类型编码
        dcNum:quickVue.matter,
        //维修班组名称
        wxKeshi:quickVue.weixiukeshis,
        //维修班组编码
        wxKeshiNum:$('#wxbm').attr('data-num'),
        //维修设备(设备编码)
        wxShebei:quickVue.sbSelect,
        //设备编码
        dNum:quickVue.sbLX,
        //设备名称
        dName:quickVue.sbMC,
        //发生时间
        gdFsShij:$('#quickWork').find('.otimes').val(),
        //故障描述
        bxBeizhu: $('#quickWork').find('.remarkDes').eq(0).val(),
        //维修内容
        wxBeizhu:$('#quickWork').find('.weixiuBZ').val(),
        //执行人
        gdWxRs: weixiuRen,
        //工单来源
        gdSrc: 2,
        //用户ID
        userID: _userIdNum,
        //用户名
        userName: _userIdName,
        //维修事项名称（不能为空,这里没用到）
        wxShiX: 1,
        //维修事项编码
        wxShiXNum: 1,
        //安装地点
        installAddress:''

      }

      $.ajax({
        type: 'post',
        url: _urls + 'YWGD/ywGDCreQuickDJ',
        data: prm,
        beforeSend:function(){
          $('#theLoading').modal('show');
        },
        complete: function () {
          $('#theLoading').modal('hide');
        },
        success: function (result) {
          if (result == 99) {

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加成功!', '');

            $('#myModal4').modal('hide');

            //刷新表格
            conditionSelect();
          } else {

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加失败!', '');

          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

          //清除loadding
          $('#theLoading').modal('hide');

          if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

          }else{

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

          }

        }
      })
    }

  })

  //登记【确定按钮】
  $('#myModal').on('click','.dengji',function(){

    editRegister('YWGD/ywGDCreDJ',false,'登记成功！','登记失败!');

  })

  //表格【查看按钮】
  $('#scrap-datatables').on('click','.option-see',function(){

    //初始化
    detailedInit();


    //模态框
    _moTaiKuang($('#myModal'),'工单详情',true,'','','');

    //数据绑定
    bindData($(this));


    //是否可操作
    disabledOption();

    //显示隐藏的模块
    $('#myApp33').find('.seeBlock').show();

  })

  //线路、车站联动
  $('.line-route').on('change',function(){

    var values = $(this).val();

    var about = $(this).parents('.floatLi').next().find('select');

    var str = '<option value="">请选择</option>';

    if(values == ''){

      //所有车站
      for(var i=0;i<_stationArr.length;i++){

        str += '<option value="' + _stationArr[i].ddNum +
            '">' + _stationArr[i].ddName + '</option>'

      }


    }else{

      for(var i=0;i<_lineArr.length;i++){

        if(values == _lineArr[i].dlNum){

          for(var j=0;j<_lineArr[i].deps.length;j++){

            str += '<option value="' + _lineArr[i].deps[j].ddNum + '">' + _lineArr[i].deps[j].ddName + '</option>'

          }
        }
      }
    }

    $(about).empty().append(str);

  })

  //表格【编辑按钮】
  $('#scrap-datatables').on('click','.option-edit',function(){

    //初始化
    detailedInit();

    //数据绑定
    bindData($(this));

    //模态框
    _moTaiKuang($('#myModal'),'编辑','','','','保存');

    //添加类
    $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('dengji').addClass('bianji');

    //可编辑
    abledOption();

    //隐藏不显示的
    $('#myApp33').find('.seeBlock').hide();

  })

  //编辑【确定按钮】
  $('#myModal').on('click','.bianji',function(){

    editRegister('YWGD/ywGDUpt',true,'编辑成功！','编辑失败!');

  })

  //确定选中的对象
  $('#DEV-Modal .modal-footer').on('click','.btn-primary',function(){

    $('#DEV-Modal').modal('hide');

    if(_commonFlag){

      detaileVue.sbSelect = $('#dev-table tbody').find('.tables-hover').children('.dNum').html();

      detaileVue.sbMC = $('#dev-table tbody').find('.tables-hover').children().eq(1).html();

    }

    if(_quickFlag){

      quickVue.sbSelect = $('#dev-table tbody').find('.tables-hover').children('.dNum').html();

      quickVue.sbMC = $('#dev-table tbody').find('.tables-hover').children().eq(1).html();

    }



  });

  /*-------------------------------------------------------其他方法------------------------------------------*/

  //条件查询
  function conditionSelect() {
    //获取条件
    var filterInput = [];

    var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');

    for (var i = 0; i < filterInputValue.length; i++) {

      filterInput.push(filterInputValue.eq(i).val());

    }

    var values = '';

    var flag = $('#bumen').parent('div').next().find('span').attr('values');

    if( typeof flag == 'undefined' ){

      values = '';

    }else{

      values = flag;

    }

    var prm = {
      //工单号
      'gdCode2': filterInput[0],
      //开始时间
      'gdSt': $('.min').val(),
      //结束时间
      'gdEt': moment($('.max').val()).add(1,'d').format('YYYY/MM/DD'),
      //车站
      'bxKeshiNum': values,
      //工单状态
      "gdZht": 1,
      //当前用户id
      'userID': _userIdNum,
      //当前用户姓名
      'userName': _userIdName,
    };

    var wbzArr = [];

    if(_AisWBZ){

      for(var i=0;i<_AWBZArr.length;i++){

        for(var j=0;j<_AWBZArr[i].wxBanzus.length;j++){

          wbzArr.push(_AWBZArr[i].wxBanzus[j].departNum);

        }

      }

      prm.wxKeshis = wbzArr;

    }else if(_AisBZ){

      prm.wxKeshi = _maintenanceTeam;

    }

    $.ajax({
      type: 'post',
      url: _urls + 'YWGD/ywGDGetDJ',
      timeout:30000,
      data: prm,
      success: function (result) {

        _datasTable($("#scrap-datatables"), result);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {

        //清除loadding
        $('#theLoading').modal('hide');

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

          _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

        }else{

          _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

        }

      }
    })
  }

  //登记模态框初始化
  function detailedInit(){

    //工单号
    detaileVue.gdCode = '';
    //工单状态
    detaileVue.state = '';
    //工单类型
    detaileVue.picked = 0;
    //工单来源
    detaileVue.gdly = 1;
    //任务级别
    detaileVue.rwlx = 4;
    //报修电话
    detaileVue.telephone = '';
    //报修人信息
    detaileVue.person = '';
    //故障位置
    detaileVue.place = '';
    //线路
    detaileVue.lineRoute = '';
    //车站
    detaileVue.section = '';
    //系统类型
    detaileVue.matter = '';
    //设备编码
    detaileVue.sbSelect = '';
    //设备名称
    detaileVue.sbMC = '';
    //故障发生时间
    $('#myApp33').find('.otime').val('');
    //工单登记时间
    $('#myApp33').find('.dtime').val('');
    //故障描述
    $('#myApp33').find('.remarkDes').val('');

    //radio初始化
    $('#uniform-ones,#uniform-twos').children().removeClass('checked');

    $('#uniform-twos').children().addClass('checked');

    //查看图片初始化
    _imgNum = 0;

    $('.showImage').html('没有图片').hide();

    $('.bxpicture').hide();

  }

  //可操作
  function abledOption(){

    $('#myApp33').find('input,select,textarea').attr('disabled',false).removeClass('disabled-block');

    $('#uniform-ones').parents('.input-blockeds').removeClass('disabled-block');

  }

  //不可操作
  function disabledOption(){

    $('#myApp33').find('input,select,textarea').attr('disabled',true).addClass('disabled-block');

    $('#uniform-ones').parents('.input-blockeds').addClass('disabled-block');

  }

  //登记、编辑方法
  function editRegister(url,flag,successMeg,errorMeg){

    //验证非空
    if(detaileVue.phone == '' || detaileVue.person == '' || detaileVue.place == '' || detaileVue.section == '' || detaileVue.matter == ''){

      _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '请填写红色必填项!', '');

    }else{

      //车站名称
      var cheStr = '';

      if($('#myApp33').find('.cjz').val() == ''){

        cheStr = '';

      }else{

        cheStr = $('#myApp33').find('.cjz').children('option:selected').html();

      }

      var xtStr = '';

      if($('#myApp33').find('.xitong').val() == ''){

        xtStr = ''

      }else{

        xtStr = $('#myApp33').find('.xitong').children('option:selected').html();

      }

      var prm = {
        //工单类型
        gdJJ: detaileVue.picked,
        //工单编号来源
        gdCodeSrc: detaileVue.gdly,
        //任务级别
        gdLeixing: detaileVue.rwlx,
        //报修电话
        bxDianhua: detaileVue.telephone,
        //报修人
        bxRen: detaileVue.person,
        //故障位置
        wxDidian: detaileVue.place,
        //线路（不传）
        //车站名称
        bxKeshi:cheStr,
        //车站编码
        bxKeshiNum: detaileVue.section,
        //系统类型名称
        dcName:xtStr,
        //系统类型编码
        dcNum:detaileVue.matter,
        //设备编码
        dNum: detaileVue.sbSelect,
        //维修设备（设备编码）
        wxShebei: detaileVue.sbSelect,
        //设备名称
        dName: detaileVue.sbMC,
        //故障发生时间
        gdFsShij:$('.otime').val(),
        //故障描述
        bxBeizhu: $('#myApp33').find('.remarkDes').eq(0).val(),
        //用户id
        userID: _userIdNum,
        //维修事项
        wxKeshi: '',
        //工单来源
        'gdSrc': 2,
        //维修事项
        wxShiX:xtStr,
        //维修事项编码
        wxShiXNum:detaileVue.matter,
        //安装地点
        installAddress:''

      };

      if(flag){

        prm.gdCode = _gdCode;

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

            _moTaiKuang($('#myModal2'),'提示',true,'istap',successMeg,'');

            $('#myModal').modal('hide');

            conditionSelect();

          }else{

            _moTaiKuang($('#myModal2'),'提示',true,'istap',errorMeg,'');

          }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

          //清除loadding
          $('#theLoading').modal('hide');

          if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

          }else{

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

          }

        }

      })

    }

  }

  //数据绑定
  function bindData($this){

    //样式
    $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

    $this.parents('tr').addClass('tables-hover');

    //获取工单号，工单状态，工单gdCircle

    var el = $this.parents('tr').children('.gongdanId').children();

    var gdCode = el.attr('gdcode');

    var gdStatus = el.attr('gdztz');

    var gdCircle = el.attr('gdcircle');

    _gdCode = gdCode;

    var prm = {
      //工单号
      gdCode: gdCode,
      //工单状态
      gdZht: gdStatus,
      //用户id
      userID: _userIdNum,
      //用户名
      userName: _userIdName,
      //工单重派值
      gdCircle: gdCircle

    }

    $.ajax({

      type:'post',
      url:_urls + 'YWGD/ywGDGetDetail',
      timeout:_theTimes,
      data:prm,
      beforeSend: function () {
        $('#theLoading').modal('show');
      },
      complete: function () {
        $('#theLoading').modal('hide');
      },
      success:function(result){

        if(result){
          //赋值
          //工单号
          detaileVue.gdCode = result.gdCode2;
          //工单状态
          detaileVue.state = stateTransform(result.gdZht);
          //工单类型
          detaileVue.picked = result.gdJJ;
          //工单类型样式设置
          $('#uniform-ones,#uniform-twos').children().removeClass('checked');

          if( detaileVue.picked == 0 ){

            $('#uniform-twos').children().addClass('checked');

          }else{

            $('#uniform-ones').children().addClass('checked');

          }
          //工单来源
          detaileVue.gdly = result.gdCodeSrc;
          //任务级别
          detaileVue.rwlx = result.gdLeixing;
          //报修电话
          detaileVue.telephone = result.bxDianhua;
          //报修人
          detaileVue.person = result.bxRen;
          //故障位置
          detaileVue.place = result.wxDidian;
          //线路消失
          $('#myApp33').find('.routeShow').hide();
          //车站
          detaileVue.section = result.bxKeshiNum;
          //系统类型
          detaileVue.matter = result.wxShiXNum;
          //设备编码
          detaileVue.sbSelect = result.wxShebei;
          //设备名称
          detaileVue.sbMC = result.dName;
          //故障发生时间
          $('#myApp33').find('.otime').val(result.gdFsShij);
          //工单登记时间
          $('#myApp33').find('.dtime').val(result.gdShij);
          //故障描述
          $('#myApp33').find('.remarkDes').val(result.bxBeizhu);
          //查看报修图片
          _imgNum = result.hasImage;
          //按钮显示隐藏
          if( _imgNum == 0 ){

            $('.bxpicture').hide();

          }else{

            $('.bxpicture').show();

          }
        }

      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {

        //清除loadding
        $('#theLoading').modal('hide');

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

          _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

        }else{

          _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

        }

      }

    })

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

  //快速登记初始化
  function quickInit(){

    //工单类型
    quickVue.picked = 1;
    //工单来源
    quickVue.gdly = 1;
    //任务级别
    quickVue.rwlx = 4;
    //报修电话
    quickVue.telephone = '';
    //报修人信息
    quickVue.person = '';
    //故障位置
    quickVue.place = '';
    //线路
    quickVue.lineRoute = '';
    //车站
    quickVue.section = '';
    //系统类型
    quickVue.matter = '';
    //维修班组
    quickVue.weixiukeshis = '';
    //维修班组编码
    $('#wxbm').removeAttr('data-num');
    //维修设备
    quickVue.sbSelect = '';
    //设备编码
    quickVue.sbLX = '';
    //设备名称
    quickVue.sbMC = '';
    //发生时间
    $('#quickWork').find('.otimes').val('');
    //故障描述
    $('#quickWork').find('.remarkDes').val('');
    //维修内容
    $('#quickWork').find('.weixiuBZ').val('');
    //执行人表格
    var personObject = {};

    personObject.wxRName = _userIdName;

    personObject.wxrID = _userIdNum;

    personObject.wxRDh = '';

    var _zhixingRens = [];

    _zhixingRens.push(personObject);

    _datasTable($('#personTable1'), _zhixingRens);

    //单选按钮
    $('#uniform-one1').parents('div').find('span').removeClass('checked');

    $('#uniform-one1').children('span').addClass('checked');

  }

})