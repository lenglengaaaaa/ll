<template>
    <div class="deviceThreshold">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="info">
                    <strong>阈值设置</strong>
                    <div>{{deviceName}}</div>
                </div>
                <!-- <el-button type="text" @click="resetDeafault">重置为默认值</el-button> -->
            </div>
            <el-form 
                :model="thForm" 
                :rules="rules"
                ref="thForm"
                label-position="top"  
                :style="{'width':'600px'}"
            >   
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="线缆温度告警限值(最大值)(℃)" prop="lineTemp">
                                <el-input v-model.number="thForm.lineTemp" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="线缆电流告警限值(A)" prop="lineA">
                                <el-input v-model.number="thForm.lineA" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="线缆电压告警限值(V)" prop="lineV">
                                <el-input v-model.number="thForm.lineV" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="电池电压限值(V)" prop="batteryA">
                                <el-input v-model.number="thForm.batteryA" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="板温度告警限值(℃)" prop="CBTemp">
                                <el-input v-model.number="thForm.CBTemp" autocomplete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="传感器数据的采集周期(秒)" prop="samplingPeriod">
                                <el-input v-model.number="thForm.samplingPeriod" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="传感器上报数据的周期(分)" prop="reportedPeriod">
                                <el-input v-model.number="thForm.reportedPeriod" autocomplete="off" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置为默认值</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import Threshold from './mixin'
    
    export default {
        mixins: [Threshold],
        data() {
            return {
                thForm:{  
                    lineTemp:90,
                    lineA:1000,
                    lineV:250,
                    batteryA:2.8,
                    CBTemp:50,
                    samplingPeriod:600,
                    reportedPeriod:20
                },
            }
        },
    }

</script>

<style lang="scss">

</style>