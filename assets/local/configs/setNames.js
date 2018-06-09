/**
 * Created by admin on 2017/12/10.
 */

var __names = {

    //区域
    area:"车务段1",

    //部门
    department:"车站1",

    //车间
    workshop: "车间1",

    //班组
    group:"维修班组1"

};

function __setNames(){

    //给页面赋值
    //区域
    $('.user-defined-area').html(__names.area);

    //部门
    $('.user-defined-department').html(__names.department);

    //车间
    $('.user-defined-workshop').html(__names.workshop);

    //班组
    $('.user-defined-group').html(__names.group);

}

__setNames();


//定义系统中的配置信息
var __systemConfigArr = [

    //驾驶舱配置信息
    {
        pageName :"驾驶舱",
        pageUrl :"new-nengyuanzonglan/new-index.html",

        //定义驾驶舱中右下角能耗排名的配置项
        indexPageRandingObj : {

            btnMessage :[
                {
                    btnId:0,
                    btnName: "项目",
                    isShow:1
                },
                {
                    btnId:1,
                    btnName: "楼宇",
                    isShow:0
                },
                {
                    btnId:2,
                    btnName: "单位",
                    isShow:0
                }
            ]

        }
    },

    //报表管理配置信息
    {
        pageName :"报表管理",
        pageUrl :"new-baobiaoguanli/statementManagement.html",
        //定义报表管理中要展示报表的配置项
        showStatement :[
            {
                statementName:"总能耗报表",
                jumpUrl: "energyCollectStatement.html",
                addClass:'statement-contain',
                isShow:1
            },
            {
                statementName:"区域能耗报表",
                jumpUrl: "areaEnergyDataStatement.html",
                addClass:'statement-contain',
                isShow:1
            },
            {
                statementName:"部门能耗报表",
                jumpUrl: "officeEnergyDataManagement.html",
                addClass:'statement-contain1 statement-contain',
                isShow:1
            },
            {
                statementName:"水电气分科报表",
                jumpUrl: "officePQCCDataManagement.html",
                addClass:'statement-contain',
                isShow:1
            },
            {
                statementName:"变压器能耗报表",
                jumpUrl: "electroDetail.html",
                addClass:'statement-contain',
                isShow:1
            }
        ]
    },
    //实时报警配置信息
    {
        pageName :"实时报警",
        pageUrl :"baojingyujing/warningAlarm-3.html",
        //定义实时报警是否显示查看流程图功能 0为不显示 1为显示
        ifShowMonitor : 0
    },
    //摄像头相关页面配置信息
    {
        pageName :"摄像头",
        pageUrl :"new-luxianghuifang/historyMonitor.html",
        pageId:0,
        //定义摄像头是否显示需要进行解密操作 0为不需解密 1为解密
        ifdecode : 0
    },
    //能耗中定额管理相关页面配置信息
    {
        pageName :"能耗中定额管理",
        pageUrl :"new-yongnengguanli/OfficeDingEData.html",
        pageId:1,
        //定义定额管理中定额种类
        quotaKind : [
            {
                quotaName:'楼宇',
                quotaTypeID:'1',
                isShow:1
            },
            {
                quotaName:'分户',
                quotaTypeID:'2',
                isShow:1
            },
            {
                quotaName:'支路',
                quotaTypeID:'3',
                isShow:0
            },
            {
                quotaName:'企业',
                quotaTypeID:'4',
                isShow:0
            },
            {
                quotaName:'KPI指标',
                quotaTypeID:'5',
                isShow:0
            }
        ]
    },
    //能耗中关联分析页面配置信息
    {
        pageName :"能耗中关联分析",
        pageUrl :"new-nenghaofenxi/relevanAnalysData.html",
        pageId:2,
        //定义根据楼宇展示 还是院区展示 0为楼宇 1为院区
        showDataType : 0
    }
];