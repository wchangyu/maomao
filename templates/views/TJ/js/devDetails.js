$(function(){

	/*--------------------------------------表格初始化------------------------------*/

	//备件
	var BJCol=[

		{
			title:'类别',
			data:'LB'
		},
		{
			title:'物品编号',
			data:'WPBH'
		},
		{
			title:'物品名称',
			data:'WPMC'
		},
		{
			title:'品牌',
			data:'PP'
		},
		{
			title:'规格',
			data:'GG'
		},
		{
			title:'物品序列号',
			data:'WPXLH'
		},
		{
			title:'是否耐用',
			data:'SFNY'
		},
		{
			title:'仓库',
			data:'CK'
		},
		{
			title:'库区',
			data:'KQ'
		},
		{
			title:'库存数',
			data:'KCS'
		},
		{
			title:'单价',
			data:'DJ'
		},
		{
			title:'金额',
			data:'JE'
		},
		{
			title:'品质',
			data:'PZ'
		},
		{
			title:'预警上限',
			data:'YJSX'
		},
		{
			title:'预警下限',
			data:'YJXX'
		}

	]

	_tableInit($('#BJTable'),BJCol,1,true,'','',true,'');

	//获取备件数据
	BJData();

	//设备
	var SBCol=[

		{
			title:'设备名称',
			data:'SBMC'
		},
		{
			title:'设备编码',
			data:'SBBM'
		},
		{
			title:'规格型号',
			data:'GGXH'
		},
		{
			title:'所属部门',
			data:'SSBM'
		},
		{
			title:'安装位置',
			data:'AZWZ'
		},
		{
			title:'设备系统',
			data:'SBXT'
		},
		{
			title:'设备类别',
			data:'SBLB'
		},
		{
			title:'安装时间',
			data:'AZSJ'
		},
		{
			title:'保修年限',
			data:'BXNX'
		}

	]

	_tableInit($('#SBTable'),SBCol,1,true,'','',true,'');

	//获取设备数据
	SBData();

	//报警预警
	var YJCol=[

		{
			title:'工单号',
			data:'GDH'
		},
		{
			title:'工单类型',
			data:'GDLX'
		},
		{
			title:'工单状态',
			data:'GDZT'
		},
		{
			title:'任务级别',
			data:'RWJB'
		},
		{
			title:'工单来源',
			data:'GDLY'
		},
		{
			title:'系统类型',
			data:'XTLX'
		},
		{
			title:'设备名称',
			data:'SBMC'
		},
		{
			title:'项目',
			data:'XM'
		},
		{
			title:'故障位置',
			data:'GZWZ'
		},
		{
			title:'故障描述',
			data:'GZMS'
		},
		{
			title:'最新处理情况',
			data:'ZXCLQK'
		},
		{
			title:'备件信息',
			data:'BJCLXX'
		},
		{
			title:'班组',
			data:'BZ'
		},
		{
			title:'受理时间',
			data:'SLSJ'
		}

	];

	_tableInit($('#YJTable'),YJCol,1,true,'','',true,'');

	YJData();

	/*---------------------------------------按钮事件-------------------------------*/

	//备件
	$('#beijian').click(function(){

		$('#theLoading').modal('show');

		_moTaiKuang($('#beijian-myModal'),'备品备件',true,'','','','');

		$('#theLoading').modal('hide');

	})

	//设备
	$('#shebei').click(function(){

		$('#theLoading').modal('show');

		_moTaiKuang($('#shebei-myModal'),'设备',true,'','','','');

		$('#theLoading').modal('hide');

	})

	//综合
	$('#quxian').click(function(){

		$('#theLoading').modal('show');

		_moTaiKuang($('#quxian-myModal'),'曲线',true,'','','','');

		$('#theLoading').modal('hide');

	})

	//报警
	$('#baojing').click(function(){

		$('#theLoading').modal('show');

		_moTaiKuang($('#yujing-myModal'),'报警',true,'','','','');

		$('#theLoading').modal('hide');

	})

	/*---------------------------------------其他方法-------------------------------*/

	//获取备件数据
	function BJData(){

		$.ajax({

			type:'get',

			url:'data/BJ.json',

			success:function(result){

				_datasTable($('#BJTable'),result);

			}

		})

	}

	//获取设备数据
	function SBData(){

		$.ajax({

			type:'get',

			url:'data/SB.json',

			success:function(result){

				_datasTable($('#SBTable'),result);

			}

		})

	}

	//获取报警数据
	function YJData(){

		$.ajax({

			type:'get',

			url:'data/YJ.json',

			success:function(result){

				_datasTable($('#YJTable'),result);

			}

		})

	}

})