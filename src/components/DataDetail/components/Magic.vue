<template>
    <div>
        <div class="magicList">
            <el-row :gutter="20">
                <el-col :span="6" v-for="(value,name) in magicData" :key="name" :xs="12">
                    <div >
                        <Gauge 
                            :value="{name,value}"
                        />
                    </div>
                </el-col>
            </el-row>
            
        </div>
        <el-divider content-position="left">魔节历史数据</el-divider>
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
</template>

<script>
    import {Gauge,LineChart} from '@/components/Charts'

    export default {
        components: {
            Gauge,
            LineChart
        },
        props: {
            magicData: {
                type: Object,
                default: ()=>{}
            },
        },
        data() {
            return {
                options: [
                        {value: '0',name: '环境温度'}, 
                        {value: '1',name: '环境湿度'}, 
                        {value: '6',name: '氧气含量'}, 
                        {value: '2',name: '硫化氢'}, 
                        {value: '3',name: '一氧化碳'}, 
                        {value: '4',name: '烷类'}, 
                        {value: '5',name: '臭氧'}, 
                        {value: '7',name: '电池电压'}
                    ],
                value: '0',
                time: [new Date(), new Date()],
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>