<template>
    <div class="MAGIC_CONTAINER">
        <div class="wrap">
            <el-divider content-position="left">魔节环境数据</el-divider>
            <div>
                <el-row :gutter="20">
                    <el-col v-for="(i,index) in 4" :key="index" :span="6" :xs="12">
                        <Gauge />
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col v-for="(i,index) in 4" :key="index" :span="6" :xs="12">
                        <Gauge />
                    </el-col>
                </el-row>
            </div>
            <el-divider content-position="left">魔节历史纪录</el-divider>
            <div>
                <div class="seletGroup">
                    <el-form label-position="top">
                        <el-form-item label="环境变量:">
                            <el-select v-model="value">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间段:">
                            <el-date-picker
                                v-model="time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <div class="icon">
                        <i class="el-icon-download"></i>
                    </div>
                </div>
                <LineChart></LineChart>
            </div>
        </div>
    </div>
    
</template>

<script>
    import {Gauge,LineChart} from '@/components/Charts'

    export default {
        components: {
            Gauge,
            LineChart
        },
        data() {
            return {
                options: [
                        {value: '0',label: '环境温度'}, 
                        {value: '1',label: '环境湿度'}, 
                        {value: '6',label: '氧气含量'}, 
                        {value: '2',label: '硫化氢'}, 
                        {value: '3',label: '一氧化碳'}, 
                        {value: '4',label: '烷类'}, 
                        {value: '5',label: '臭氧'}, 
                        {value: '7',label: '电池电压'}
                    ],
                value: '0',
                time: [new Date(), new Date()],
            }
        },
    }
</script>

<style lang="scss" scoped>
    .MAGIC_CONTAINER{
        width: 100%;
        display: flex;
        justify-content: center;
        .wrap{
            width: 98%;
            background: #fff;
            box-shadow: 0 1px 1px rgba(189, 195, 199, 0.8);
            border-radius: 5px;
            .seletGroup{
                padding-bottom: 20px;
                display: flex;
                align-items: center;
                .el-form{
                    width: 100%;
                    display: flex;
                    .el-form-item{
                        padding: 0 10px;
                    }
                }
                .icon{
                    margin: 20px 0 0 10px;
                    i{
                        cursor: pointer;
                        background: #ecefef;
                        padding: 5px;
                        border-radius: 5px;
                    }
                }
            }
        }
    }
    
</style>