/**
 * Created by admin on 2018/10/18.
 */
$(function(){

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //表格赋值
    drawTable(personMessageArr);

});

//人员信息列表
var personMessageArr = [
    {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/10/13 17:24:58',
        state:'出'
    },
    {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/10/08 13:10:05',
        state:'出'
    },
    {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/09/27 08:06:13',
        state:'出'
    },
    {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/09/20 21:10:48',
        state:'出'
    },
    {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/09/03 18:40:33',
        state:'出'
    },
    {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/08/29 12:05:32',
        state:'出'
    }, {
        number:'门禁1',
        name:'雷杰',
        department:'科技发展部',
        post:'经理',
        doorName:'主机房门',
        time:'2018/08/26 10:18:12',
        state:'出'
    }

];

//表格赋值
function drawTable(dataArr){

    //定义表格中数据串
    var tableHtml = '';

    $(dataArr).each(function(i,o){


        tableHtml += '<tr>' +

                        '<td>'+ o.number+'</td>' +
                        '<td>'+ o.name+'</td>' +
                        '<td>'+ o.department+'</td>' +
                        '<td>'+ o.post+'</td>' +
                        '<td>'+ o.doorName+'</td>' +
                        '<td>'+ o.time+'</td>' +
                        '<td>'+ o.state+'</td>' +

                      '</tr>'
    });

    //页面赋值
    $('#scrap-datatables tbody').html(tableHtml);
}

