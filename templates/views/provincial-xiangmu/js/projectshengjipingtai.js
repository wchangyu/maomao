var quyuid = window.sessionStorage.enterpriseID;
var resetObj = resetData(quyuid);
var flagtype = null;
var flagtypeid = null

function resetData(id) {
    var alldata = JSON.parse(window.sessionStorage.pointers);
    var len = alldata.length;
    for (var i = 0; i < len; i++) {
        var item = alldata[i];
        if (item.enterpriseID == id) {
            return item;
        }
    }
    return null;
}
//初始化alert
function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}
var allMyclod = null;
var endData = null;
var oTable;
var shengshilist = null;

$(function () {
	
	qingqiuData()
	validformzuixiaozhi()

// _my_creatTableData(dddd.projRemouldModes, dddd.provincProjStatists)



})

function qingqiuData(){
	// api/ProvincialProject/GetProvincProjStatist
	var url = _urls + "ProvincialProject/GetProvincProjStatist?subDisID="+  630000 //630126 // "630101" // "630000" //+resetObj.subDisID;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                if(data == ""){
                     myAlter("数据为空")
                }else{
                	_my_creatTableData(data.projRemouldModes, data.provincProjStatists, data)
                }
            }

        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            myAlter("Could not load the requested content.")
        }
    })
}



//手动生成表格
function _my_creatTableData( datatitle, datalist, data ){
	var falgdata = data;
	flagtype = data.returnType;
	flagtypeid = data.curDistrictID;
	var title = datatitle;
	var list = []
	for (var i = 0; i < title.length; i++) {
		var item = title[i];
		var obj = {
			col: item.projRemouldModes.length,
			name: item.f_RemouldName,
			data: item.projRemouldModes
		}
		list.push(obj)
	}
	endData = list;
	shengshilist = datalist;
	var myclod = [];
	//第一行
	for (var i = 0; i < list.length; i++) {
		var item = list[i]
	}
	//第二行
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if(item.data.length == 0){
			var mod = {};
			myclod.push(mod)
		}
		for (var d = 0; d < item.data.length; d++) {
			var mod = item.data[d];
			myclod.push(mod)
		}
	}

	allMyclod = myclod;

	var columns = [
		{
			title: item.f_RemouldName,
	        data: 'f_DistrictID',
	        class: 'hidden',
	        render: function(data, index, row, meta) {
	            return data
	        }
		},{
			title: '',
	        data: 'districtName',
	        render: function(data, index, row, meta) {
	        	if(flagtype == 1){
	        		return "<a class='clickme glyphicon glyphicon-plus'>" + data + "</a>"
	        	}
	        	if(meta.row == 0 ){
	        		return data;
	        	}
	        	if(row.provincProjStatists&&row.provincProjStatists.length>0&&row.projInfoSumNum>0){
	        		return "<a class='clickme glyphicon glyphicon-plus'>" + data + "</a>"
	        	}
	            return data
	        }
		}
	];


	for (var i = 0; i < myclod.length; i++) {
		var item = myclod[i];
		var obj = {
			title: item.f_RemouldName,
			'testid': item.f_ParentRemould,
	        data: 'f_DistrictID',
	        render: function(data, index, row, meta) {

	        	var type = meta.col-2;
	        	var typeid = allMyclod[type].pK_ProjRemouldMode;
	        	var titid = allMyclod[type].f_ParentRemould;
	        	if(!allMyclod[type].f_ParentRemould){
	        		return ""
	        	}
	        	// if(flagtype == 1){
	        	// 	return "<a class='clickme'>" + data + "</a>"
	        	// }
				var num = 0;	        	
	        	var child = row.projInfoNums
	        	for (var i = 0; i < child.length; i++) {
	        		var item = child[i];
	        		if(item.pK_ProjRemouldMode == typeid){
	        			if(item.projNum == ""){
	        				return item.projNum
	        			}
	        			if(flagtype == 1){
			        		return item.projNum
			        	}
			        	if(flagtype == 0){
			        		if(row.f_DistrictID == ""){
			        			return item.projNum
			        		}
			        		var chengshiid = row.f_DistrictID;
			        		if(chengshiid == flagtypeid){
			        			var typeid = item.pK_ProjRemouldMode;
			        			var parentid = getParentidByid(typeid);
		        				return "<a class='xiangmuid' atrtype='" + item.pK_ProjRemouldMode 
		        					+ "' href='./projectshengjipingtaiinfo.html?csid="+ chengshiid 
		        					+ "&&typeid="+ typeid 
		        					+ "&&parentid="+ parentid +"'" 
		        					+">"+ item.projNum +"</a>"
			        		}
			        		return item.projNum
		        			
			        	}

	        			if(meta.row == 0){
	        				return item.projNum
	        			}
	        			var chengshiid = row.f_DistrictID;
	        			var typeid = item.pK_ProjRemouldMode;
	        			var parentid = getParentidByid(typeid);
        				return "<a class='xiangmuid' atrtype='" + item.pK_ProjRemouldMode 
        					+ "' href='./projectshengjipingtaiinfo.html?csid="+ chengshiid 
        					+ "&&typeid="+ typeid 
        					+ "&&parentid="+ parentid +"'" 
        					+">"+ item.projNum +"</a>"
	        			
	        		}
	        	}
	            return data
	        }
		};
		columns.push(obj)

	}
	columns.push({
		title: '一级排名',
        data: 'projNumRank',
        render: function(data, index, row, meta) {
            return data
        }
	})



	oTable = $('#shengjipingtai').DataTable({
        "autoWidth": false, //用来启用或禁用自动列的宽度计算
        "paging": false, //是否分页
        "destroy": true, //还原初始化了的datatable
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
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        // "dom":'B<"clear">lfrtip',
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [],
        "columns": columns,
        data: datalist,
        initComplete:initComplete
	});


	var test = $('#testtable').DataTable({
        "autoWidth": false, //用来启用或禁用自动列的宽度计算
        "paging": false, //是否分页
        "destroy": true, //还原初始化了的datatable
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
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        // "dom":'B<"clear">lfrtip',
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [],
        "columns": columns,
        data: datalist,
        initComplete:initComplete
	});

}

function initComplete(data, index){
	var str = "<tr role='row'>";
	if(endData){
		str+="<th></th>"
		for (var i = 0; i < endData.length; i++) {
			var item = endData[i];
			if(item.col == 0){
				str+="<th colspan='"+ "1" +"' class='sorting_disabled' rowspan='1'>" + item.name + "</th>"
			}else{
				str+="<th colspan='"+item.col+"' class='sorting_disabled' rowspan='1'>" + item.name + "</th>"
			}
			
		}
		str+="<th rowspan='1' class='sorting_disabled'></th>";
		str+="</tr>"
	}
	$('#sjptthd').prepend( str);	
}

$('#shengjipingtai tbody').on('click', '.clickme', function () {
	var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
	var row = oTable.row( tr );
	var id = $(this).parent().prev().html();
	var datalist = getshengshilistitem(id)
	if ( row.child.isShown() ) {
        row.child.hide();
        tr.removeClass('shown');
        $(this).addClass('glyphicon-plus').removeClass('glyphicon-minus')
    }	
    else {
        // Open this row
        row.child( format( id ) ).show();
        tr.addClass('shown');
        $('.shown').next('tr').addClass('on-show');
        $(this).addClass('glyphicon-minus').removeClass('glyphicon-plus')
    }
    creatIdTable(id, datalist)
} );

$('#shengjipingtai tbody').on('click', '.xiangmuid', function () {
	//找到项目id
	var id = $(this).parent().parent().children('td:first');
	var typeid = $(this).attr("atrtype");

	// location.search
	//找到了项目id

} );




function format ( id ) {
	var list = getshengshilistitem(id)
    var table = '<table class="table" id="'+'test'+id+'">' +
        			'<thead></thead>'+
        			'<tbody></tbody>'+
        		'</table>';
    return table;
}


function getshengshilistitem(id){
	if(shengshilist){
		for (var i = 0; i < shengshilist.length; i++) {
			var item = shengshilist[i];
			if(item.f_DistrictID == id){
				return item.provincProjStatists
			}
		}
	}
	return [];
}


function creatIdTable(id, datalist){
	// allMyclod;生成子表格
	var columns = [
		{
			title: '',
	        data: 'f_DistrictID',
	        class: 'hidden',
	        render: function(data, index, row, meta) {
	            return data
	        }
		},{
			title: '',
	        data: 'districtName',
	        render: function(data, index, row, meta) {
	            return data
	        }
		}
	];
	for (var i = 0; i < allMyclod.length; i++) {
		var item = allMyclod[i];
		var obj = {
			title: item.f_RemouldName,
	        data: 'f_DistrictID',
	        render: function(data, index, row, meta) {

	        	var type = meta.col-2;
	        	var typeid = allMyclod[type].pK_ProjRemouldMode;

	        	if(!typeid){
	        		return ""
	        	}

				var num = 0;	        	
	        	var child = row.projInfoNums
	        	for (var i = 0; i < child.length; i++) {
	        		var item = child[i];
	        		if(item.pK_ProjRemouldMode == typeid){
	        			if(item.projNum == ""){
	        				return item.projNum
	        			}
	        			if(flagtype == 1){
	        				if(row.f_DistrictID!= flagtypeid){
	        					return item.projNum
	        				}
			        		// return item.projNum;
			        		//判断id是否和返回的id相同 相同就链接 否则直接数字
			        	}
	        			if(meta.row == 0){
	        				return item.projNum
	        			}
	        			var chengshiid = row.f_DistrictID;
	        			var typeid = item.pK_ProjRemouldMode;
	        			var parentid = getParentidByid(typeid)
	        			return "<a class='xiangmuid' atrtype='" + item.pK_ProjRemouldMode 
	        					+ "' href='./projectjindu.html?csid="+ chengshiid 
	        					+ "&&typeid="+ typeid 
	        					+ "&&parentid="+ parentid +"'" 
	        					+">"+ item.projNum +"</a>"
	        			return item.projNum
	        		}
	        	}
	            return data
	        }
		};
		columns.push(obj)
	}
	columns.push({
		title: '二级排名',
        data: 'projNumRank',
        render: function(data, index, row, meta) {
            return data
        }
	})

	$('#test'+id).DataTable({
        "autoWidth": false, //用来启用或禁用自动列的宽度计算
        "paging": false, //是否分页
        "destroy": true, //还原初始化了的datatable
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
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [],
        "columns": columns,
        data: datalist
	});
}


function getParentidByid( id ){
	if(allMyclod){
		for (var i = 0; i < allMyclod.length; i++) {
			var item = allMyclod[i];
			if(item.pK_ProjRemouldMode == id){
				return item.f_ParentRemould;
			}
		}
	}
	return id
}

function validformzuixiaozhi(){
    return $('#touzimin').validate({
        onfocusout: function(element) { $(element).valid()},
        rules:{
            //单位名称
            'pingtai':{
                required: true,
            },
        },
        messages:{
            'pingtai':{
                required: '请输入数字'
            },
        }
    });
}

