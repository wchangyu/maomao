/**
 * Created by admin on 2017/7/4.
 */
//获取得地图数据
var markerArr = [
    { title: "广州火车站", point: "113.264531,23.157003", address: "广东省广州市广州火车站", tel:"12306", online: 0,data:0.15 },
    { title: "广州塔（赤岗塔）", point: "113.330934,23.113401", address: "广东省广州市广州塔（赤岗塔） ", tel: "18500000000", online: 1 ,data:0.38 },
    { title: "广州动物园", point: "113.312213,23.147267", address: "广东省广州市广州动物园", tel:"18500000000", online: 2 ,data:0.60 },
    { title: "天河公园", point: "113.372867,23.134274", address: "广东省广州市天河公园", tel: "18500000000", online: 3  ,data:0.74}
];
//新建百度地图
var map = new BMap.Map("container");
map.centerAndZoom(new BMap.Point(113.312213, 23.147267), 13);
//可以进行缩放
map.enableScrollWheelZoom();
map.addControl(new BMap.NavigationControl());


addWords();

//地点得文字标注与事件绑定
function addWords(){
    var arr = [];
    var points = [];
    for (var i = 0; i < markerArr.length; i++) {
        var p0 = markerArr[i].point.split(",")[0];
        var p1 = markerArr[i].point.split(",")[1];
        var words = markerArr[i].title;
        var address = markerArr[i].address;
        var online = markerArr[i].online;
        //判断是否在线
        if(online == 0){
            //这个是你要显示坐标的图片的相对路径
            var icons = "img/red.png";
        }else  if(online == 1){
            var icons = "img/blue.png";
        }else  if(online == 2){
            var icons = "img/greenLabel.png";
        }else  if(online == 3){
            var icons = "img/yellowLabel.png";
        }

        points[i]= new BMap.Point(p0,p1);
        var marker=new BMap.Marker(new BMap.Point(p0, p1));

        var icon = new BMap.Icon(icons, new BMap.Size(55, 55)); //显示图标大小
        marker.setIcon(icon);//设置标签的图标为自定义图标

        map.addOverlay(marker);//将标签添加到地图中去
        //添加文字标注

        var label = new BMap.Label(words,{offset:new BMap.Size(30,-10)});
        arr.push(label);
        marker.setLabel(label);
        //给每个被选中地点添加事件

        // map.setViewport(points);

    }



}

//给表格加入数据
function setDatas(arr){
    if(arr && arr.length>0){
        _table.fnAddData(arr);
        _table.fnDraw();
    }

}

//右侧数据展示表格
var table = $('#dateTables').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": true,
    'searching':true,
    "sScrollY": '215px',
    "scrollCollapse": true,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        "sProcessing" : "加载中...",
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
        'search':'搜索:',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'项目列表',
            data:"title",
            orderable: false,
            render:function(data, type, row, meta) {

                return data;
            }
        },
        {
            title:'KW/RT',
            data:"data",
            targets: [ 1 ],
            render:function(data, type, row, meta) {

                if(row.online == 0){
                    return '<span class="green">'+data.toFixed(2)+'</span>'
                }else  if(row.online == 1){
                    return '<span class="blue">'+data.toFixed(2)+'</span>'
                }else  if(row.online == 2){
                    return '<span class="yellow">'+data.toFixed(2)+'</span>'
                }else  if(row.online == 3){
                    return '<span class="red">'+data.toFixed(2)+'</span>'
                }
            }
        }

    ]
});

_table = $('#dateTables').dataTable();


_table.fnClearTable();

setDatas(markerArr);

$('#dateTables_filter input').attr('placeHolder',' 请输入搜索内容');





