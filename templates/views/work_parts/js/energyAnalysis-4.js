$(function(){
    getHeight();
	//水电选择
	$(".electricity_aa_6").click(function(){
        $(this).css({
            "background":"url(./img/electricity_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".water_aa_6").css({
            "background":"url(./img/water.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    $(".water_aa_6").click(function(){
        $(this).css({
            "background":"url(./img/water_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".electricity_aa_6").css({
             "background":"url(./img/electricity.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
	//对象选择
	$(".left-middle-tab_aa_6").click(function(){
        //alert($(this).index())
        //alert($(".left-middle-list").width())
        $(".left-middle-tab_aa_6").css({
            "border":"2px solid #7f7f7f",
            "background":"#f1f3fa",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
        $(".tree-6").css({
            display:"none"
        }),
        $(".tree-6")[$(this).index()-1].style.display="block"
    })
    //饼状图-center-电
    myChart36 = echarts.init(document.getElementById('energy-parts-total'));
		option36 = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    series: [
		        {
		            name:'访问来源',
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
		                {value:335, name:'直接访问'},
		                {value:310, name:'邮件营销'},
		                {value:234, name:'联盟广告'},
		                {value:135, name:'视频广告'},
		                {value:1548, name:'搜索引擎'}
		            ],
		             itemStyle: {
		                normal: {
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
		                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
		                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
		                        ];
		                        return colorList[params.dataIndex]
		                    }
		                }
		            }
		        }
		    ]
		};
		myChart36.setOption(option36);
	//饼状图-top-left-电
	myChart37 = echarts.init(document.getElementById('energy-parts-one'));
		option37 = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '50%'],
		            data:[
		                {value:335, name:'直接访问'},
		                {value:310, name:'邮件营销'},
		                {value:234, name:'联盟广告'},
		                {value:135, name:'视频广告'},
		                {value:1548, name:'搜索引擎'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                },
		                normal: {
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
		                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
		                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
		                        ];
		                        return colorList[params.dataIndex]
		                    }
		                }
		            }
		        }
		    ]
		};
	myChart37.setOption(option37);
	//饼状图-bottom-left-电
	myChart38 = echarts.init(document.getElementById('energy-parts-two'));
			option38 = {
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    series : [
			        {
			            name: '访问来源',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '50%'],
			            data:[
			                {value:335, name:'直接访问'},
			                {value:310, name:'邮件营销'},
			                {value:234, name:'联盟广告'},
			                {value:135, name:'视频广告'},
			                {value:1548, name:'搜索引擎'}
			            ],
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                },
			                normal: {
			                    color: function(params) {
			                        
			                        var colorList = [
			                          '#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
			                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
			                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
			                       ];
			                        return colorList[params.dataIndex]
			                    }
			                }
			            }
			        }
			    ]
			};
			myChart38.setOption(option38);	
	//饼状图-top-right-电
	myChart39 = echarts.init(document.getElementById('energy-parts-three'));
			option39 = {
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    series : [
			        {
			            name: '访问来源',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '50%'],
			            data:[
			                {value:335, name:'直接访问'},
			                {value:310, name:'邮件营销'},
			                {value:234, name:'联盟广告'},
			                {value:135, name:'视频广告'},
			                {value:1548, name:'搜索引擎'}
			            ],
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                },
			                normal: {
			                    color: function(params) {
			                        
			                        var colorList = [
			                          '#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
			                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
			                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
			                        ];
			                        return colorList[params.dataIndex]
			                    }
			                }
			            }
			        }
			    ]
			};
			myChart39.setOption(option39);
	//饼状图-bottom-right-电
	myChart40 = echarts.init(document.getElementById('energy-parts-four'));
			option40 = {
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    series : [
			        {
			            name: '访问来源',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '50%'],
			            data:[
			                {value:335, name:'直接访问'},
			                {value:310, name:'邮件营销'},
			                {value:234, name:'联盟广告'},
			                {value:135, name:'视频广告'},
			                {value:1548, name:'搜索引擎'}
			            ],
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                },
			                normal: {
			                    color: function(params) {
			                        
			                        var colorList = [
			                          '#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
			                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
			                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
			                        ];
			                        return colorList[params.dataIndex]
			                    }
			                }
			            }
			        }
			    ]
			};
			myChart40.setOption(option40);
})
getHeight();
var myChart36;
var myChart37;
var myChart38;
var myChart39;
window.onresize = function () {
    myChart36.resize(); 
    myChart37.resize();
    myChart38.resize();
    myChart39.resize();
    getHeight();
}
function getHeight(){
    //获取浏览器的高度；
    var h = window.innerHeight ||document.documentElement.clientHeight || document.body.clientHeight;
    // console.log(h);
    var heights = h * 0.70;
    $('.total-warp').css({
        height:heights
    })
}