//记录当前工单号
var _gdCode = '';

$(function(){

  /*-----------------------------------------------------变量-----------------------------------------*/
  //datatimepicker故障发生时间；

  //普通工单
  _timeHMSComponentsFun($('.otime'),1);

  //_timeHMSComponentsFun($('.otimes'),1);

  //设置初始时间(主表格时间)
  var now = moment().format('YYYY-MM-DD');

  var st = moment(now).subtract(6,'months').format('YYYY-MM-DD');

  //显示时间
  $('.min').val(st);

  $('.max').val(now);

  //时间初始化
  _timeYMDComponentsFun11($('.abbrDT'));

  //系统类型
  getSysType();

  //线路数组
  var _lineArr = [];

  //线路
  getLine();

  var _stationArr = [];

  //车站
  getStation();

  //条件查询车站
  addStationDom($('#bumen'));

  //当前部门下的车站
  _stationData();

  //判断当前是普通报障还是快速报障
  var _commonFlag = false;

  //判断当前是普通报障还是快速报障
  var _quickFlag = false;

  /*-----------------------------------------------------表单验证--------------------------------------------*/

  //普通报修
  function validform(){

    return $('#commentForm').validate({

      rules:{
        //报修电话
        'gdTel':{

          required: true,

          phoneNumFormat:true

        },
        //报修人
        'gdBXRen':{

          required: true

        },
        //故障位置
        'gdPlace':{

          required: true

        },
        //车站
        'gdSection':{

          required: true

        },
        //系统类型
        'gdMatter':{

          required: true

        },
      },
      messages:{

        //报修电话
        'gdTel':{

          required: '请输入报修电话',

          phoneNumFormat:'请输入电话格式'

        },
        //报修人
        'gdBXRen':{

          required: '请输入报修人信息'

        },
        //故障位置
        'gdPlace':{

          required: '请输入故障位置'

        },
        //车站
        'gdSection':{

          required: '请选择' + __names.department

        },
        //系统类型
        'gdMatter':{

          required: '请选择系统类型'

        },
      }

    });

  }

  //快速报修
  function validformQ(){

    return $('#commentFormQ').validate({

      rules:{
        //报修电话
        'gdTelQ':{

          required: true,

          phoneNumFormat:true

        },
        //报修人
        'gdBXRenQ':{

          required: true

        },
        //故障位置
        'gdPlaceQ':{

          required: true

        },
        //车站
        'gdSectionQ':{

          required: true

        },
        //系统类型
        'gdMatterQ':{

          required: true

        },
        //维修内容
        'weixiuBZQ':{

          required: true

        }
      },
      messages:{

        //报修电话
        'gdTelQ':{

          required: '请输入报修电话',

          phoneNumFormat:'请输入电话格式'

        },
        //报修人
        'gdBXRenQ':{

          required: '请输入报修人信息'

        },
        //故障位置
        'gdPlaceQ':{

          required: '请输入故障位置'

        },
        //车站
        'gdSectionQ':{

          required: '请选择' + __names.department

        },
        //系统类型
        'gdMatterQ':{

          required: '请选择系统类型'

        },
        //维修内容
        'weixiuBZQ':{

          required: '请输入维修内容'

        }
      }

    });

  }

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

      render: function (data, type, row, meta) {

        return "<span class='data-option option-see btn default btn-xs green-stripe' data-gdcode='" + row.gdCode + "' data-status='" + row.gdZht + "' data-circle='" + row.gdCircle + "'>查看</span>" +

            "<span class='data-option option-edit btn default btn-xs green-stripe' data-gdcode='" + row.gdCode + "' data-status='" + row.gdZht + "' data-circle='" + row.gdCircle + "'>编辑</span>"


      }
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
    $('.condition-query').eq(0).find('.min').val(st);

    $('.condition-query').eq(0).find('.max').val(now);

    //车站初始化
    $('#bumen').next().find('span').removeAttr('values').html('全部');

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
    $('#myModal').find('.default-filling').hide();

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

    //初始化
    quickInit();

    //模态框
    _moTaiKuang($('#quick-Modal'),'快速报障','','','','快速报障');

    //获取用户所在的部门

    $('#gdWXSection').val(_loginUser.departName);

    $('#gdWXSection').attr('data-num',_loginUser.departNum);

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
  $('#quick-Modal').on('click','.quickDengji',function(){

    if(validformQ().form()){

      var prm = {

        //工单类型
        gdJJ:1,
        //工单来源
        gdCodeSrc:$('#gdResourceQ').val(),
        //任务级别
        gdLeixing:$('#gdGradeQ').val(),
        //报修电话
        bxDianhua:$('#gdTelQ').val(),
        //报修人
        bxRen:$('#gdBXRenQ').val(),
        //故障位置
        wxDidian:$('#gdPlaceQ').val(),
        //线路（不传）
        //车站编码
        bxKeshiNum:$('#gdSectionQ').val(),
        //车站名称
        bxKeshi:$('#gdSectionQ').children('option:selected').html(),
        //系统类型名称
        dcName:$('#gdMatterQ').children('option:selected').html(),
        //系统类型编码
        dcNum:$('#gdMatterQ').val(),
        //维修班组名称
        wxKeshi:$('#gdWXSection').val(),
        //维修班组编码
        wxKeshiNum:$('#gdWXSection').attr('data-num'),
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

    }

    return false;

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
    $('#myModal').find('.default-filling').show();

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
    $('#myModal').find('.default-filling').hide();

  })

  //编辑【确定按钮】
  $('#myModal').on('click','.bianji',function(){

    editRegister('YWGD/ywGDUpt',true,'编辑成功！','编辑失败!');

  })

  //确定选中的对象
  $('#DEV-Modal .modal-footer').on('click','.btn-primary',function(){

    $('#DEV-Modal').modal('hide');

    var currentTr = $('#dev-table tbody').find('.tables-hover');

    if(_commonFlag){

      $('#sbSelect').val(currentTr.children('.dNum').html());

      $('#sbMC').val(currentTr.children().eq(2).html());

    }

    if(_quickFlag){

      quickVue.sbSelect = currentTr.children('.dNum').html();

      quickVue.sbMC = currentTr.children().eq(1).html();

    }



  });

  /*-------------------------------------------------------其他方法------------------------------------------*/

  //条件查询
  function conditionSelect() {
    var values = '';

    var flag = $('#bumen').next().find('span').attr('values');

    if( typeof flag == 'undefined' ){

      values = '';

    }else{

      values = flag;

    }

    var prm = {
      //工单号
      'gdCode2': $('.gdCodeCon').val(),
      //开始时间
      'gdSt': $('.min').val(),
      //结束时间
      'gdEt': moment($('.max').val()).add(1,'d').format('YYYY-MM-DD'),
      //车站
      'bxKeshiNum': values,
      //工单状态
      "gdZht": 1,
      //当前用户id
      'userID': _userIdNum,
      //当前用户姓名
      'userName': _userIdName
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

    _mainAjaxFunCompleteNew('post','YWGD/ywGDGetDJ',prm,$('.L-container'),function(result){

      _datasTable($("#scrap-datatables"), result);

    })
  }

  //登记模态框初始化
  function detailedInit(){

    $('.modal-block').find('input').val('');

    $('.modal-block').find('select').val('');

    $('.modal-block').find('textarea').val('');

    //radio初始化
    $('#uniform-ones,#uniform-twos').children().removeClass('checked');

    $('#uniform-twos').children().addClass('checked');

    //工单来源
    $('#gdResource').val(1);

    //任务级别
    $('#gdGrade').val(4);

    //查看图片初始化
    _imgNum = 0;

    $('.showImage').html('没有图片').hide();

    $('.bxpicture').hide();

  }

  //可操作
  function abledOption(){

    $('#myModal').find('input,select,textarea').attr('disabled',false);

    $('.inpus').attr('disabled',true);

    //工单号、工单状态、依然不能改
    $('#gdCode').attr('disabled',true);

    $('#gdState').attr('disabled',true);

    $('.modal-select').show();

  }

  //不可操作
  function disabledOption(){

    $('#myModal').find('input,select,textarea').attr('disabled',true);

    $('.radio').attr('disabled',true);

    $('.modal-select').hide();

  }

  //登记、编辑方法
  function editRegister(url,flag,successMeg,errorMeg){

    //验证通过
    if(validform().form()){

      var prm = {
        //工单类型
        gdJJ: 0,
        //工单编号来源
        gdCodeSrc: $('#gdResource').val(),
        //任务级别
        gdLeixing: $('#gdGrade').val(),
        //报修电话
        bxDianhua: $('#gdTel').val(),
        //报修人
        bxRen: $('#gdBXRen').val(),
        //故障位置
        wxDidian: $('#gdPlace').val(),
        //线路（不传）
        //车站名称
        bxKeshi:$('#gdSection').val() == ''?'':$('#gdSection').children('option:selected').html(),
        //车站编码
        bxKeshiNum: $('#gdSection').val(),
        //系统类型名称
        dcName:$('#gdMatter').val() == ''?'':$('#gdMatter').children('option:selected').html(),
        //系统类型编码
        dcNum:$('#gdMatter').val(),
        //设备编码
        dNum: $('#sbSelect').val(),
        //维修设备（设备编码）
        wxShebei: $('#sbSelect').val(),
        //设备名称
        dName: $('#sbMC').val(),
        //故障发生时间
        gdFsShij:$('#otime').val(),
        //故障描述
        bxBeizhu: $('#myModal').find('.remarkDes').val(),
        //用户id
        userID: _userIdNum,
        //维修事项
        wxKeshi: '',
        //工单来源
        'gdSrc': 2,
        //维修事项
        wxShiX:$('#gdMatter').val() == ''?'':$('#gdMatter').children('option:selected').html(),
        //维修事项编码
        wxShiXNum:$('#gdMatter').val(),
        //安装地点
        installAddress:''

      };

      if(flag){

        prm.gdCode = _gdCode;

      }

      _mainAjaxFunCompleteNew('post',url,prm,$('#myModal').children(),function(result){

        if(result == 99){

          _moTaiKuang($('#myModal2'),'提示',true,'istap',successMeg,'');

          $('#myModal').modal('hide');

          conditionSelect();

        }else{

          _moTaiKuang($('#myModal2'),'提示',true,'istap',errorMeg,'');

        }

      })

    }

  }

  //数据绑定
  function bindData($this){

    //获取工单号，工单状态，工单gdCircle

    var el = $this;

    var gdCode = el.attr('data-gdcode');

    var gdStatus = el.attr('data-status');

    var gdCircle = el.attr('data-circle');

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

    _mainAjaxFunCompleteNew('post','YWGD/ywGDGetDetail',prm,$('.main-contents-table'),function(result){

      if(result){
        //赋值
        //工单号
        $('#gdCode').val(result.gdCode2);
        //工单状态
        $('#gdState').val(stateTransform(result.gdZht));
        //工单类型(不处理)
        //工单来源
        $('#gdResource').val(result.gdCodeSrc);
        //任务级别
        $('#gdGrade').val(result.gdLeixing);
        //报修电话
        $('#gdTel').val(result.bxDianhua);
        //报修人
        $('#gdBXRen').val(result.bxRen);
        //故障位置
        $('#gdPlace').val(result.wxDidian);
        //线路消失
        $('#myModal').find('.routeShow').hide();
        //车站(报修科室)
        $('#gdSection').val(result.bxKeshiNum);
        //系统类型
        $('#gdMatter').val(result.wxShiXNum);
        //设备编码
        $('#sbSelect').val(result.wxShebei);
        //设备名称
        $('#sbMC').val(result.dName);
        //故障发生时间

        $('#otime').val(result.gdFsShij);
        //工单登记时间
        $('#dtime').val(result.gdShij);
        //故障描述
        $('#myModal').find('.remarkDes').val(result.bxBeizhu);
        //查看报修图片
        _imgNum = result.hasImage;
        //按钮显示隐藏
        if( _imgNum == 0 ){

          $('.bxpicture').hide();

        }else{

          $('.bxpicture').show();

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

    $('.modal-block').find('input').val('');

    $('.modal-block').find('select').val('');

    $('.modal-block').find('textarea').val('');

    //radio初始化
    $('#uniform-one1,#uniform-two1').children().removeClass('checked');

    $('#uniform-one1').children().addClass('checked');

    //工单来源
    $('#gdResourceQ').val(1);

    //任务级别
    $('#gdGradeQ').val(4);

    //执行人表格
    var personObject = {};

    personObject.wxRName = _userIdName;

    personObject.wxrID = _userIdNum;

    personObject.wxRDh = '';

    var _zhixingRens = [];

    _zhixingRens.push(personObject);

    _datasTable($('#personTable1'), _zhixingRens);

  }

  //获取车站
  function getStation(){

    _stationArr.length = 0;

    var prm = {

      //车站名称
      ddName:'',
      //车站编码
      ddNum:'',
      //登录id
      userID:_userIdNum
    }

    _mainAjaxFunCompleteOnly('post','YWDev/ywDMGetDDs',prm,false,function(result){

      _stationArr = result;

      var str = '<option  value="">请选择，且必选</option>';

      for(var i=0;i<result.length;i++){

        str += '<option value="' + result[i].ddNum + '">' + result[i].ddName + '</option>'

      }

      $('#gdSection').empty().append(str);

      $('#gdSectionQ').empty().append(str);

    })

  }

  //获取线路
  function getLine(){

    _lineArr.length = 0;

    var prm = {

      //线路名称
      dlName:'',
      //线路编码
      dlNum:'',
      //登录id
      userID:_userIdNum
    }

    _mainAjaxFunCompleteOnly('post','YWGD/ywGetDLines',prm,false,function(result){

      _lineArr = result;

      var str = '<option  value="">请选择</option>';

      for(var i=0;i<result.length;i++){

        str += '<option value="' + result[i].dlNum + '">' + result[i].dlName + '</option>'

      }

      $('#line-route').empty().append(str);

    })

  }

  //系统类型
  function getSysType(){

    var prm = {

      //线路名称
      dsName:'',
      //线路编码
      dsNum:'',
      //登录id
      userID:_userIdNum
    }

    _mainAjaxFunCompleteOnly('post','YWDev/ywDMGetDSs',prm,false,function(result){

      var str = '<option  value="">请选择,且必选</option>';

      for(var i=0;i<result.length;i++){

        str += '<option value="' + result[i].dsNum + '">' + result[i].dsName + '</option>'

      }

      $('#gdMatter').empty().append(str);

      $('#gdMatterQ').empty().append(str);

    })

  }

})