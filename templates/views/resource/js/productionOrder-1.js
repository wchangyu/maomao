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
  //设置初始时间
  var _initStart = moment().format('YYYY/MM/DD');
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
    val=val.replace(/^\s+|\s+$/g,'');
    return /[^.\s]{1,500}$/.test(val)
  })
  //登记信息绑定
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
  //查看详细信息的Vue形式
  var workDones = new Vue({
    el:'#workDone',
    data:{
      weixiukeshis:'',
      baoxiukeshis:'',
      baoxiudidians:'',
      weixiushixiangs:'',
      baoxiudianhua:'',
      baoxiuren:'',
      weixiushebei:'',
      beizhus:''
    }
  })
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
        text: '保存为excel格式',
        className:'saveAs',
        header:true
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
        title:'紧急',
        data:'gdJJ',
        render:function(data, type, full, meta){
          if(data == 0){
            return '否'
          }if(data == 1){
            return '是'
          }
        }
      },
      {
        title:'工单状态',
        data:'gdZht',
        className:'gongdanZt',
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
      },
    ],
    "columnDefs": [{
      "visible": true,
      "targets": -1
    }]
  });
  //报错时不弹出弹框
  $.fn.dataTable.ext.errMode = function(s,h,m){
    console.log('')
  }
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
    //所有登记页面的输入框清空
    app33.telephone = '';
    app33.person = '';
    app33.place = '';
    app33.matter = '';
    app33.sections = '';
    app33.remarks = '';
    app33.section = '';
    moTaiKuang($('#myModal'));
  });
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
        'gdSrc':2
      }
      $.ajax({
        type:'post',
        url: _urls + 'YWGD/ywGDCreDJ',
        data:gdInfo,
        success:function(result){
          if(result == 99){
            var myModal = $('#myModal2');
            myModal.find('.modal-body').html('添加成功');
            moTaiKuang(myModal)
          }
          //刷新表格
          conditionSelect();
        }
      })
    }
  });
  $('.confirm').click(function(){
      $(this).parents('.modal').modal('hide');
  })
  /*---------------------------------表格绑定事件-------------------------------------*/
  var lastIdx = null;
  $('#scrap-datatables tbody')
  //鼠标略过行变色
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
      //双击背景色改变，查看详情
      .on('dblclick','tr',function(){
        //当前行变色
        var $this = $(this);
        currentTr = $this;
        currentFlat = true;
        $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
        $(this).css({'background':'#FBEC88'});
        moTaiKuang($('#myModal1'));
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
            //绑定弹窗数据
            workDones.weixiukeshis = result.wxKeshi;
            workDones.baoxiukeshis = result.bxKeshi;
            workDones.baoxiudidians = result.wxDidian;
            workDones.weixiushixiangs = result.wxShiX;
            workDones.beizhus = result.bxBeizhu;
            workDones.baoxiudianhua = result.bxDianhua;
            workDones.baoxiuren = result.bxRen;
            workDones.weixiushebei = result.wxShebei;
          }
        });
      });
  /*-------------------------------方法----------------------------------------*/
  //条件查询
  function conditionSelect(){
    //获取条件
    var filterInput = [];
    var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
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
})