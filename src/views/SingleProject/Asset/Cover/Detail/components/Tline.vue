<template>
    <div class="DATA_DETAIL">
        <div class="wrap">
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
    import {LineChart} from '@/components/Charts'

    export default {
        components: {
            LineChart,
        },
        data() {
            return {
                options: [
                        {value: '0',label: '线缆温度'}, 
                        {value: '1',label: '线缆电流'}, 
                        {value: '6',label: '线缆电压'}, 
                        {value: '2',label: '电池低压'}, 
                        {value: '3',label: '板子自身温度'}, 
                        {value: '4',label: '震动数据'}, 
                        {value: '5',label: '433M子节点参数'}, 
                        {value: '7',label: '信号强度'}
                    ],
                value: '0',
                time: [new Date(), new Date()],
            }
        },
        
    }
</script>

<style lang="scss" scoped>
    @import '@/styles/dataDetail.scss';
</style>