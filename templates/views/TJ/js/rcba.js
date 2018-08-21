$(function(){

    var col = [

        {
            title:'用户名',
            data:'YHM'
        },
        {
            title:'工号',
            data:'GH'
        },
        {
            title:'部门',
            data:'BM'
        },
        {
            title:'角色',
            data:'JS'
        },
        {
            title:'已有权限',
            data:'YYQX'
        },
        {
            title:'备注',
            data:'BZ'
        },
        {
            title:'权限',
            render:function(data, type, full, meta){

                return '<span class="data-option option-see btn default btn-xs green-stripe">操作权限</span>'

            }

        }

    ]

    _tableInit($('#table'),col,1,true,'','','','');

    var arr = [

        {
            "YHM":"游久云",
            "GH":"AK0015",
            "BM":"爱玛客",
            "JS":"维修工",
            "YYQX":"",
            "BZ":""
        },
        {
            "YHM":"廖红",
            "GH":"AK0014",
            "BM":"爱玛客",
            "JS":"班长",
            "YYQX":"",
            "BZ":""
        },
        {
            "YHM":"李佼",
            "GH":"480979",
            "BM":"泌尿外科",
            "JS":"报修人",
            "YYQX":"",
            "BZ":""
        },
        {
            "YHM":"高馨",
            "GH":"483242",
            "BM":"院办",
            "JS":"报修人",
            "YYQX":"",
            "BZ":""
        },
        {
            "YHM":"韩姗姗",
            "GH":"483221",
            "BM":"手麻科",
            "JS":"报修人",
            "YYQX":"",
            "BZ":""
        },
        {
            "YHM":"朱小川",
            "GH":"483222",
            "BM":"新生儿一病房",
            "JS":"报修人",
            "YYQX":"",
            "BZ":""
        }

    ]

    _datasTable($('#table'),arr);

})