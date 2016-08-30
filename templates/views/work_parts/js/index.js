$(function(){

	//对象选择
	$(".left-middle-tab_aa_0").click(function(){
        $(".left-middle-tab").css({
            "border":"2px solid #7f7f7f",
            "background":"#f1f3fa",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
        $(".tree-1").css({
            display:"none"
        }),
            //alert($(this).index()-1)
        $(".tree-1")[$(this).index()-1].style.display="block";
    })
    //上月分类能耗hover
    $(".main-one-1").hover(function(){
       $(this).animate({
                "background-size":"75px"
            },300)
    },function(){
        $(this).animate({
                "background-size":"60px"
            },10)
    })
	//同比环比marks
	 $(".main-mark").hover(function(){
        $(this).children().css({
            "color":"#fff"
        })
    },function(){
         $(this).children().css({
            "color":"#333"
        })
    }) 

	 //数据交互部分
    //页面加载时的当前时间
     timeCurrent();
    //默认开始时间为上日；
     timeYesterday();
     //获取事件：
     GetAllPointersId();
     GetOfficesId();
     GetAllPointers();
     GetAllOffices();
     getEneryItemDatas();
     powerConsumption();
     theDashboard();
     charge();
    //getWidth();
     //获取点击的楼宇ID
        $('.tree-1:eq(0)').delegate('span','click',function(){
            //改变颜色
            //console.log($('.tree-1:eq(0) span'))
            $('.tree-1:eq(0) span').removeClass('active');
            $('.tree-1:eq(1) span').removeClass('active');
            $(this).addClass('active');
            GetAllPointersId();  //得到包含id值得数组；
            getPointersId =arr[$('.tree-1:eq(0) span').index(this)];
            //small的内容
            small = $(this).html();
            //console.log(small)
        })
        //获取点击的科室单位ID;
        $('.allOffices').delegate('span','click',function(){
            $('.tree-1:eq(0) span').removeClass('active');
            $('.tree-1:eq(1) span').removeClass('active');
           $(this).addClass('active');
            //small的内容控制;
            small = $(this).html();
           // console.log(small);
            GetOfficesId();
            arr_1[0]=8909180140001;
            //alert($(this).index())
           getOfficesId =arr_1[$('.tree-1:eq(1) span').index(this)];
          // console.log(getOfficesId);//0?
        })
        //时间选取
        $('.time-options').eq(0).click(function(){
            $('.time-options').removeClass('time-options-1');
            $(this).addClass('time-options-1');
            timeYesterday();
            changeTitle = $(this).html();
        })
        $('.time-options').eq(1).click(function(){
            $('.time-options').removeClass('time-options-1');
            $(this).addClass('time-options-1');
            timeLastWeek();
            changeTitle = $(this).html();
        })
        $('.time-options').eq(2).click(function(){
            $('.time-options').removeClass('time-options-1');
            $(this).addClass('time-options-1');
            timeLastMonth();
            changeTitle = $(this).html();
        })
        $('.time-options').eq(3).click(function(){
            $('.time-options').removeClass('time-options-1');
            $(this).addClass('time-options-1');
            changeTitle = $(this).html();
        })
        $('.btns1').click(function(){
            //console.log($('#floor'))
            $('small').html(small);

            if($('#floor').hasClass('active')){
                getPointersId=0
                $('small').html('全院')
            }
            getEneryItemDatas();
            powerConsumption();
            theDashboard();
            charge();
            //小标题改变
            $('.right-one-headers').eq(0).html(changeTitle + '分类能耗');
            $('.right-one-headers').eq(1).html(changeTitle + '分项电耗'+'&nbsp;&nbsp;&nbsp; 单位：kWh');
            $('.right-one-headers').eq(2).html(changeTitle + '用能指标'+'&nbsp;&nbsp;&nbsp; 单位：元');
            $('.right-one-headers').eq(3).html(changeTitle + '能耗费用'+'&nbsp;&nbsp;&nbsp; 单位：元');
            //总标题改变
            //console.log(small);

        })
})
var getPointers;  //楼宇
var getPointersId = 0;
var getOffices;//科室单位
var getOfficesId = 8909180140001;
  //对于用户来说的区域位置 
var changeTitle = '上日';
var small='全院';
var myChart;
var myChart1;
var myChart2;
  var arr_11=[]
var _allPointerId=[];
var _allOfficeId=[];
function GetAllPointers(){
    var jsonText1=sessionStorage.getItem('pointers');
    var htmlTxet1 = JSON.parse(jsonText1);
    //console.log(htmlTxet1)
    var _allSter1='<li><span class="choice">'+htmlTxet1[0].pointerName+'</span></li>';
    for(var i=1;i<htmlTxet1.length;i++){
        _allSter1 +='<li><span class="choice">'+htmlTxet1[i].pointerName+'</span></li>'
    }
    for(var i=0;i<htmlTxet1.length;i++){
        _allPointerId.push(htmlTxet1[i].pointerID)
    }
    //console.log(_allPointerId)
    $('.allPointer').append(_allSter1);
}
//获取楼宇ID
//存放id
var  arr=[];
arr[0]=0;
function GetAllPointersId(){
    var jsonText1=sessionStorage.getItem('pointers');
    var htmlTxet1 = JSON.parse(jsonText1);
    //console.log(htmlTxet1);
    for(var i=0;i<htmlTxet1.length;i++){
        arr.push(htmlTxet1[i].pointerID);
    }
    //console.log(arr)
}
//获取科室单位的id
//存放id
var arr_1=[];
function GetOfficesId(){
    var jsonText2=sessionStorage.getItem('offices');
    var htmlText2 = JSON.parse(jsonText2);
    //console.log(htmlText2);
    for(var i=0;i<htmlText2.length;i++){
        arr_1.push(htmlText2[i].f_OfficeID)
    }
   // console.log(arr_1)
}
  //科室单位
function GetAllOffices(){
    var jsonText2=sessionStorage.getItem('offices');
    var htmlText2 = JSON.parse(jsonText2);
    var _allSter2 ='<li><span class="choice">'+htmlText2[0].f_OfficeName+'</span></li>'
    for(var i=1;i<htmlText2.length;i++){
        _allSter2 += '<li><span class="choice">'+htmlText2[i].f_OfficeName+'</span></li>'
    }
    for(var i=0;i<htmlText2.length;i++){
        _allOfficeId.push(htmlText2[i].f_OfficeID)
    }
    //console.log(_allOfficeId)
    $('.allOffices').append(_allSter2);
}
  //获取分类耗能数据
var arr_2 =[];
function getEneryItemDatas(){
    if($('.tree-1:eq(0) .active').length !=0){
            var ecParams={'pointerId':getPointersId,'startTime':newStr,'endTime':newStr1,'dateType':'日'}; 
            //console.log(getPointersId+'+'+newStr+'+'+newStr1)   //运行了
            $.ajax({
                type: "post",
                //url: "http://211.100.28.180/BeeWebAPI/api/EnergyItemDatas/getClassEcData",
                url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getClassEcData',
                data: ecParams,
                success: function (result) {
                    var str=[];
                    for(var i=0;i<result.length;i++){
                        str[i]=result[i].ecClassName;
                    }
                    //console.log(str)
                        $('.main-one-title:eq(0)').html(str[0]);
                        $('.main-one-title:eq(1)').html('总用'+str[1]+'量');
                        $('.main-one-title:eq(2)').html('总用'+str[2]+'量');
                        $('.main-one-title:eq(3)').html('总用'+str[3]+'量');  
                   //console.log(arr_2); //["总能耗", "电", "水", "气", "暖", "冷"]
                   //console.log(result)
                   //总量
                   var str1=[];
                   var str2=[];
                    for(var i=0;i<result.length;i++){
                        //arr_2[i]=result[i].ecClassName;
                        str1[i]=result[i].ecData;
                        str2[i]=result[i].ecUnit;
                    }
                    //console.log(str1)
                    //console.log(str2)
                    $('.main-one-total:eq(0)').html(parseInt(str1[0])+'&nbsp;&nbsp;'+str2[0]);
                    $('.main-one-total:eq(1)').html(parseInt(str1[1])+'&nbsp;&nbsp;'+str2[1]);
                    $('.main-one-total:eq(2)').html(parseInt(str1[2])+'&nbsp;&nbsp;'+str2[2]);
                    $('.main-one-total:eq(3)').html(parseInt(str1[3])+'&nbsp;&nbsp;'+str2[3]);
                    var str3=[];//环比
                    for(var i=0;i<result.length;i++){
                        //arr_2[i]=result[i].ecClassName;
                        str3[i]=result[i].dataDoD;
                    }
                    for(var i=0;i<str3.length;i++){
                        var aa = parseFloat(str3[i]);
                        //console.log(aa)
                        if(aa == 0){             
                           // alert(0)
                                $('.huanbi')[i].style.background='url(./work_parts/img/riseArrow.png)no-repeat 50px 50px';
                                $('.huanbi')[i].style.backgroundSize='160px';

                        }else{
                            if(aa>0){
                              //  alert('+')
                                $('.huanbi')[i].style.background='url(./work_parts/img/riseArrow.png)no-repeat 50px 0px';
                                $('.huanbi')[i].style.backgroundSize='16px';
                            }else if(aa<0){
                              //  alert('-')
                              $('.huanbi')[i].style.background='url(./work_parts/img/declineArrow.png)no-repeat 50px 0px';
                                $('.huanbi')[i].style.backgroundSize='16px';
                            }
                        }
                    }
                    $('.huanbizhi:eq(0)').html(str3[0]);
                    $('.huanbizhi:eq(1)').html(str3[1]);
                    $('.huanbizhi:eq(2)').html(str3[2]);
                    $('.huanbizhi:eq(3)').html(str3[3]);
                    var str4=[];
                    for(var i=0;i<result.length;i++){
                        str4[i]=result[i].dataYoY;
                    }
                    //console.log(str4);
                    $('.tongbizhi:eq(0)').html(str4[0]);
                    $('.tongbizhi:eq(1)').html(str4[1]);
                    $('.tongbizhi:eq(2)').html(str4[2]);
                    $('.tongbizhi:eq(3)').html(str4[3]);
                } 
            });
            loadingEndding();
    }else if($('.tree-1:eq(0) .active').length ==0){
        var ecParams={'officeId':getOfficesId,'startTime':newStr,'endTime':newStr1,'dateType':'日'};
        //console.log(getOfficesId+'+'+newStr+'+'+newStr1)
        $.ajax({
            type:'post',
           // url:'http://211.100.28.180/BeeWebAPI/api/EnergyItemDatas/getOfficeClassEcData',
            url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getOfficeClassEcData',
            data:ecParams,
            success:function(result){
                loadingEndding();
                //console.log('我是科室的数据');
                //console.log(result);
                var str=[];
                var str1=[];
                for(var i=0;i<result.length;i++){
                    str[i]=result[i].ecData;
                    str1[i]=result[i].ecUnit;
                }
               $('.main-one-total:eq(1)').html(parseInt(str[0])+'&nbsp;&nbsp;'+str1[0]);
               $('.main-one-total:eq(2)').html(parseInt(str[1])+'&nbsp;&nbsp;'+str1[1]);
                var str2=[];
                for(var i=0;i<result.length;i++){
                        str2[i]=result[i].dataYoY;
                }
                $('.tongbizhi:eq(1)').html(str2[0]);
                $('.tongbizhi:eq(2)').html(str2[1]);
                var str3=[];
                for(var i=0;i<result.length;i++){
                    str3[i]=result[i].dataDoD;
                }
                //alert(str3)
                $('.huanbizhi:eq(1)').html(str3[0]);
                $('.huanbizhi:eq(2)').html(str3[1]);
                for(var i=0;i<3;i++){
                        var aa = parseFloat(str3[i]);
                        //console.log(aa)
                        if(aa == 0){             
                           // alert(0)
                                $('.huanbi')[i+1].style.background='url(./img/riseArrow.png)no-repeat 50px 50px';
                                $('.huanbi')[i+1].style.backgroundSize='160px';

                        }else{
                            if(aa>0){
                              //  alert('+')
                                $('.huanbi')[i+1].style.background='url(./img/riseArrow.png)no-repeat 50px 0px';
                                $('.huanbi')[i+1].style.backgroundSize='16px';
                            }else if(aa<0){
                              //  alert('-')
                              $('.huanbi')[i+1].style.background='url(./img/declineArrow.png)no-repeat 50px 0px';
                                $('.huanbi')[i+1].style.backgroundSize='16px';
                            }
                        }
                }
            }
        })
        loadingEndding();
    }
}
//上月分项电耗（楼宇）
var arr_3 =['特殊用电', '照明插座用电', '动力用电', '空调用电'];
var arr_33=['42', '40', '41', '02'];
var arr_4 =[];
var newStr;
var newStr1;
function powerConsumption(){
   	if($('.tree-1:eq(0) .active').length !=0){
        //console.log('我是楼宇的分项电耗')
        var ecParams={'pointerID':getPointersId,'startTime':newStr,'endTime':newStr1,'energyItemIDs':arr_33};
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getEnergyItemEcData',
            data: ecParams,
            success:function(result){
                loadingEndding1();
                //console.log(result);
                for(var i=0;i<result.length;i++){
                    arr_4[i] = result[i].ecData.toFixed(0);
                }  
                //console.log(arr_3);
            myChart = echarts.init(document.getElementById('main-right-two'));
            console.log(arr_4);
            // 指定图表的配置项和数据
            option = {
    		    tooltip: {
    		        trigger: 'item',
    		        formatter: "{a} <br/>{b}: {c} ({d}%)"
    		    },
    		    legend: {
    		        orient: 'vertical',
    		        x: 'left',
    		        data:arr_3
    		    },
    		    series: [
    		        {
                        name:'',
    		            type:'pie',
    		            radius: ['50%', '70%'],
    		            avoidLabelOverlap: false,
    		            label: {
    		                normal: {
    		                    show: false,
    		                    position: 'center'
    		                },
    		                emphasis: {
    		                    show: true,
    		                    textStyle: {
    		                        fontSize: '30',
    		                        fontWeight: 'bold'
    		                    }
    		                }
    		            },
    		            labelLine: {
    		                normal: {
    		                    show: false
    		                }
    		            },
    		            data:[
    		                {value:arr_4[0], name:arr_3[0]},
    		                {value:arr_4[1], name:arr_3[1]},
    		                {value:arr_4[2], name:arr_3[2]},
    		                {value:arr_4[3], name:arr_3[3]}
    		            ]
    		        }
    		    ]
    		};
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            }
        })
        
    }else if($('.tree-1:eq(0) .active').length ==0){
        //console.log('我是科室的分项电耗');
        var ecParams={'officeId':getOfficesId,'startTime':newStr,'endTime':newStr1,'ecTypeId':'电'}; 
        $.ajax({
            type:'post',
            //url:'http://211.100.28.180/BEEWebAPI/api/ecDatas/GetOfficeEIEC',
            url:sessionStorage.apiUrlPrefix+'ecDatas/GetOfficeEIEC',
            data:ecParams,
            success:function(result){
                loadingEndding1();
                //console.log(result);
                var arr_10=[];
                for(var i=0;i<result.length;i++){
                    arr_10[i] = result[i].ecData;
                }
           myChart = echarts.init(document.getElementById('main-right-two'));
        option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        x: 'left',
		        data:arr_3
		    },
		    series: [
		        {
		            name:'',
		            type:'pie',
		            radius: ['50%', '70%'],
		            avoidLabelOverlap: false,
		            label: {
		                normal: {
		                    show: false,
		                    position: 'center'
		                },
		                emphasis: {
		                    show: true,
		                    textStyle: {
		                        fontSize: '30',
		                        fontWeight: 'bold'
		                    }
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:[
		                {value:arr_10[0], name:arr_3[0]},
		                {value:arr_10[1], name:arr_3[1]},
		                {value:arr_10[2], name:arr_3[2]},
		                {value:arr_10[3], name:arr_3[3]}
		            ]
		        }
		    ]
		};
        myChart.setOption(option);
            }
        })

    }  
}
//用能指标(仪表盘)
var arr_5=[];
function theDashboard(){
    var ecParams={'pointerId':getPointersId,'startTime':newStr,'endTime':newStr1,'dateType':'日'};   
    $.ajax({
         type: "post",
         //url: "http://211.100.28.180/BeeWebAPI/api/EnergyItemDatas/getClassEcData",
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getClassEcData',
         data: ecParams,
         success:function(result){
                loadingEndding2();
                for(var i=0;i<result.length;i++){
                    arr_5[i] = result[i].ecDataByArea;
                }
                //console.log(arr_5)
                var dian = result[1].ecDataByArea.toFixed(2);
                var shui = result[2].ecDataByArea.toFixed(2);
                var nuan = result[3].ecDataByArea.toFixed(2);
                var leng = result[4].ecDataByArea.toFixed(2); 
            myChart1 = echarts.init(document.getElementById('main-right-four'));
            option = {
                tooltip : {
                    formatter: "{a} <br/>{c} {b}"
                },
                series : [
                    {
                        name: '电耗',
                        type: 'gauge',
                        center: ['53%', '55%'],
                        z: 3,
                        min: 0,
                        max: 220,
                        splitNumber: 11,
                        radius: '65%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        title : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 14,
                                fontStyle: 'italic'
                            }
                        },
                        detail : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder'
                            }
                        },
                        data:[{value: dian, name: 'kWh/㎡'}]
                    },
                    {
                        name: '水耗',
                        type: 'gauge',
                        center: ['23%', '55%'],    // 默认全局居中
                        radius: '65%',
                        min:0,
                        max:7,
                        endAngle:45,
                        splitNumber:7,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 8
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length:12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length:20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer: {
                            width:5
                        },
                        title: {
                            offsetCenter: [0, '-30%']    // x, y，单位px
                        },
                        detail: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder'
                            }
                        },
                        data:[{value: shui, name: 'L/㎡'}]
                    },
                    {
                        name: '耗冷',
                        type: 'gauge',
                        center: ['83%', '55%'],    // 默认全局居中
                        radius: '50%',
                        min: 0,
                        max: 2,
                        startAngle: 135,
                        endAngle: 45,
                        splitNumber: 2,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 8
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            splitNumber: 5,
                            length: 10,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        axisLabel: {
                            formatter:function(v){
                                switch (v + '') {
                                    case '1' : return 'cold';
                                }
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer: {
                            width:2
                        },
                        title : {
                            show: false
                        },
                        detail : {
                            show: false
                        },
                        data:[{value: leng, name: 'MJ/㎡'}]
                    },
                    {
                        name: '耗热',
                        type: 'gauge',
                        center : ['83%', '55%'],    // 默认全局居中
                        radius : '50%',
                        min: 0,
                        max: 2,
                        startAngle: 315,
                        endAngle: 225,
                        splitNumber: 2,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 8
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            show: false
                        },
                        axisLabel: {
                            formatter:function(v){
                                switch (v + '') {
                                    case '1' : return 'heat';
                                }
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer: {
                            width:2
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data:[{value: nuan, name: 'MJ/㎡'}]
                    }
                ]
            };
            myChart1.setOption(option,true);
            
         }
    })
}
//上月能耗费用
var arr_6=[];
var arr_7=[];
function charge(){
    if($('.tree-1:eq(0) .active').length !=0){
    var ecParams={'pointerOrOfficeId':getPointersId,'startTime':newStr,'endTime':newStr1,'pointerOfficeType':'2'};
     $.ajax({
        type:'post',
         url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getEnergyMoneyCost',
        data:ecParams,
        success:function(result){
            loadingEndding3();
           // console.log(result)
            for(var i=0;i<result.length;i++){
               arr_6[i] = result[i].itemName; 
               arr_7[i] = parseInt(result[i].itemMoneyCost);
            } 
            //console.log(arr_7)
            myChart2 = echarts.init(document.getElementById('main-right-three'));
                option1 = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type : 'category',
                        splitLine: {show:false},
                        data : [arr_6[0],arr_6[1],arr_6[2],arr_6[3]]
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            name: '费用',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data:[arr_7[0],arr_7[1],arr_7[2],arr_7[3]],
                            itemStyle: {
                                normal: {
                                    color: function(params2) {
                                        
                                        var colorList = [
                                          '#91bbaf','#91bbaf','#91bbaf',
                                          '#91bbaf','#91bbaf','#91bbaf',
                                          '#91bbaf','#91bbaf'
                                        ];
                                        return colorList[params2.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                        
                };
            myChart2.setOption(option1);
        }
     })

    }else if($('.tree-1:eq(0) .active').length ==0){
        //console.log(getOfficesId)
        var ecParams={'pointerOrOfficeId':getOfficesId,'startTime':newStr,'endTime':newStr1,'pointerOfficeType':'1'};
        $.ajax({
        type:'post',
        url:'http://211.100.28.180/BEEWebAPI/api/EnergyItemDatas/getEnergyMoneyCost',
        data:ecParams,
        success:function(result){
            loadingEndding3();
           // console.log(result)
            for(var i=0;i<result.length;i++){
               arr_6[i] = result[i].itemName; 
               arr_7[i] = parseInt(result[i].itemMoneyCost);
            } 
            //console.log(arr_7)
            myChart2 = echarts.init(document.getElementById('main-right-three'));
                option1 = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type : 'category',
                        splitLine: {show:false},
                        data : [arr_6[0],arr_6[1],arr_6[2],arr_6[3]]
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            name: '费用',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data:[arr_7[0],arr_7[1],arr_7[2],arr_7[3]],
                            itemStyle: {
                                normal: {
                                    color: function(params2) {
                                        
                                        var colorList = [
                                          '#91bbaf','#91bbaf','#91bbaf',
                                          '#91bbaf','#91bbaf','#91bbaf',
                                          '#91bbaf','#91bbaf'
                                        ];
                                        return colorList[params2.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                        
                };
            myChart2.setOption(option1);
        }
     })
    }    
}
//浏览器echarts自适应
window.onresize = function () {
    myChart.resize(); 
    myChart1.resize();
    myChart2.resize();
}
//加载时的缓冲页面
function loadingStart(){
    $('#loading').show();
}
//分类能耗缓冲
function loadingEndding(){
    $('#loading').hide();
}
//分项电耗缓冲
function loadingEndding1(){
    $('#loading1').hide();
}
//用能指标缓冲
function loadingEndding2(){
    $('#loading2').hide();
}
//能耗费用指标缓冲
function loadingEndding3(){
    $('#loading3').hide();
}
//现在的时间
function timeCurrent(){
    var date = date || new Date();
    var mDate = moment(date);
    var mDates = mDate.format('YYYY/MM/DD') + ' 00:00:00';
   // console.log('现在时间是：'+mDates);
    newStr1 = mDates;
}
//上日时间
function timeYesterday(){
   var date = date || new Date();
   var mDate = moment(date);
   var yesterday = mDate.subtract(1,'day');
   var yesterdays = yesterday.format('YYYY/MM/DD') + ' 00:00:00';
    newStr = yesterdays;
   //console.log('上日时间是：'+yesterdays);
}
//上周时间
function timeLastWeek(){
    var date = date || new Date();
   var mDate = moment(date);
   var lastWeek = mDate.days(-7);
   var lastWeeks = lastWeek.format('YYYY/MM/DD')  + ' 00:00:00';
   //console.log('上周时间是：'+lastWeeks);
   newStr = lastWeeks;
}
//上月时间
function timeLastMonth(){
    var date = date || new Date();
    var mDate = moment(date);
    var lastMonth = mDate.subtract(1,'months');
    var lastMonths = lastMonth.format('YYYY/MM/DD') + ' 00:00:00';
   // console.log('上月时间是：'+lastMonths);
    newStr = lastMonths;
}
//上年时间
function timeLastYear(){
    var date = date || new Date();
    var mDate = moment(date);
    var lastYear = mDate.subtract(1,'years');
    var lastYears = lastYear.format('YYYY/MM/DD') + ' 00:00:00';
    //console.log('上年时间是：'+lastYears)
    newStr = lastYears;
}
