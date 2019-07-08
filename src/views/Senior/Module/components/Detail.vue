<template>
    <div class="module_detail">
        <el-dialog
            title="模组详情"
            :visible.sync="visible"
            :before-close="handleClose"
        >
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <template v-for="(item,index) in options">
                        <p :key="item.title" v-if="index <= 10">
                            <strong :title="item.title">{{item.title}}</strong>
                            <span :title="item.value">{{item.value}}</span>
                        </p>
                    </template>
                </el-col>
                <el-col :span="12" :xs="24">
                    <template v-for="(item,index) in options">
                        <p :key="item.title" v-if="index > 10">
                            <strong :title="item.title">{{item.title}}</strong>
                            <span :title="item.value">{{item.value}}</span>
                        </p>
                    </template>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script> 
    export default {
        props: {
            visible:Boolean,
            close:Function,
            value:{
                type:Object,
                default:()=>{}
            }
        },
        data() {
            return {
                options:[
                    {title:'模组名称',value:'' ,sign:'name'},
                    {title:'模组类型',value:'',sign:'moduleType'},
                    {title:'模组型号',value:'',sign:'model'},
                    {title:'模组信号强度',value:'',sign:'moduleSign'},
                    {title:'信号等级',value:'',sign:'wifiLevel'},
                    {title:'模组描述信息',value:'',sign:'detail'},
                    {title:'Bridge标识',value:'',sign:'bridgeid'},
                    {title:'模组绑定的设备状态',value:'',sign:'statusDetail'},
                    {title:'模组sig版本',value:'',sign:'sigVersion'},
                    {title:'模组信噪比',value:'',sign:'moduleSinr'},
                    {title:'模组状态',value:'',sign:'status'},
                    {title:'模组位置',value:'',sign:'location'},
                    {title:'厂商ID',value:'',sign:'manufacturerId'},
                    {title:'厂商名称',value:'',sign:'manufacturerName'},
                    {title:'使用的通讯技术',value:'',sign:'commWay'},
                    {title:'设备激活状态',value:'',sign:'activated'},
                    {title:'mac',value:'',sign:'mac'},
                    {title:'模组软件版本',value:'',sign:'swversion'},
                    {title:'模组固件版本',value:'',sign:'fwversion'},
                    {title:'模组硬件版本',value:'',sign:'hwversion'},
                    {title:'协议类型',value:'',sign:'protocolType'},
                ]
            }
        },
        watch: {
            value(data){
                const value =this.options.map((i)=>{
                    for(let k in data){
                        if(i.sign ===k){
                            i.value = data[k]
                        } 
                    }
                    return i
                })
                this.options = value;
            }
        },
        methods: {
            handleClose(){
                this.close();
            }
        },
    }
</script>

<style lang="scss">
    .module_detail{
        .el-dialog{
            border-radius: 10px;
            width: 650px;
            max-width: 95%;
            .el-dialog__header{
                border-radius: 10px 10px 0px 0px;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                background-color: rgb(218, 218, 218);
                .el-dialog__title{
                    color: #000;
                    font-size: 16px;
                    font-weight: bold;
                }
            }
            .el-dialog__body{
                padding: 10px 20px;
                p{
                    strong,span{
                        display:inline-block;
                        width:120px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    strong{
                        border: 0 solid #e4e6eb;
                        padding: 0px 20px;
                        border-left-width: 5px;
                        border-radius: 5px;
                        border-left-color: #67c2ef;
                    }
                }
            }
        }
    }
</style>