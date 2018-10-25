//编辑项目
$('#xiangmubiaoge tbody').on('click','.option-edite',function(data, index){
    //获取当前项目在后台id
    var _postID = $(this).parents('tr').find('td').eq(0).html();
    var itemdata = getXiangmuInfoByID( _postID );
    if(itemdata){
    	hh.cache.itemdata = itemdata;
        $("#myModal-xiugai").modal('show');
    }else{
        myAlter("没有找到该条数据,请刷新后重试")
    }
});
$('#myModal-xiugai').on('shown.bs.modal', function () {
	xiugaireset()
})

function xiugaireset() {
	//修改项目初始化
    //单位类型
    $("#danweileixing-xiugai option:first").prop("selected", 'selected')
    //合作方式
    $("#hezuofangshi-xiugai option:first").prop("selected", 'selected');
    //项目实施进度
    $("#xiangmushishijindu-xiugai option:first").prop("selected", 'selected');


    //单位名称
    var danweimingchengXiugai = $('#danweimingcheng-xiugai').val("")
    //所属区域
    var suoshuquyuXiugai = $('#suoshuquyu-xiugai').val("")
    //单位类型
    var danweileixingXiugai = $('#danweileixing-xiugai').val("")
    //项目名称
    var xiangmumingchengXiugai = $('#xiangmumingcheng-xiugai').val("");
    //合作方式
    var hezuofangshiXiugai = $("#hezuofangshi-xiugai").val("");
    //项目类型
    var xiangmuleixingXiugai = $("#xiangmuleixing-xiugai").val("");
    //epc类型
    var epcleixingXiugai = $("#epcleixing-xiugai").val("");
    //改造面积
    var gaizaomianjiXiugai = $("#gaizaomianji-xiugai").val("");
    //获取投资额度
    var touzieXiugai = $("#touzie-xiugai").val("");
    //获取实施单位
    var shishidanweiXiugai = $("#shishidanwei-xiugai").val("");
    //获取签约节能率
    var qianyuejienenglvXiugai = $("#qianyuejienenglv-xiugai").val("");

    //获取采购计划下达时间
    var caigoujihuaxiadashijianXiugai = $("#caigoujihuaxiadashijian").val("");
    //获取招标时间
    var zhaobiaoshijian = $("#zhaobiaoshijian").val("");
    //获取合同时间
    var hetongshijian = $("#hetongshijian").val("");
    //获取验收时间
    var yanshoushijian = $("#yanshoushijian").val("");
    //获取关联建筑
    var guanlianjianzhu = $("#guanlianjianzhu").val("");
    //获取备注
    var beizhu = $("#beizhu").val("");
    //获取附件
    _my_postKnowLedgeFileArr = [];

    //单位名称
    var danweimingcheng = resetObj.eprName;
    $('.danweimingcheng').val(danweimingcheng)
    //区域名称
    var quyumingcheng = resetObj.districtName;
    $('.suoshuquyu').val(quyumingcheng)
}