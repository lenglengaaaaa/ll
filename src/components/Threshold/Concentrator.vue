<template>
    <div class="deviceThreshold">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="info">
                    <strong>集中器-节点阈值设置</strong>
                    <div>{{deviceName}}</div>
                </div>
                <!-- <el-button type="text" @click="resetDeafault">重置为默认值</el-button> -->
            </div>
            <el-form 
                :model="thForm" 
                :rules="rules"
                ref="thForm"
                label-position="top"  
                :style="{'width':'500px'}"
            >   
                <el-row :gutter="40">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="线缆温度告警限值(℃)" prop="lineTemp">
                            <el-input-number v-model="thForm.lineTemp" :precision="2" :min="0" />
                        </el-form-item>
                        
                        <el-form-item label="线缆电流告警限值(A)" prop="lineA">
                            <el-input-number v-model="thForm.lineA" :precision="2" :min="0" />
                        </el-form-item>
                        <el-form-item label="线缆电压告警限值(V)" prop="lineV">
                            <el-input-number v-model="thForm.lineV" :precision="0" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="电池电压限值(V)" prop="batteryA">
                            <el-input-number v-model="thForm.batteryA" :precision="1" :min="0" />
                        </el-form-item>
                        <el-form-item label="板子温度告警限值(℃)" prop="CBTemp">
                            <el-input-number v-model="thForm.CBTemp" :precision="2" :min="0" />
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
        mixins: [ Threshold ],
        data() {
            return {
                thForm:{
                    lineTemp:70,
                    lineA:650,
                    lineV:15,
                    batteryA:2.8,
                    CBTemp:70,
                    samplingPeriod:1,
                    reportedPeriod:5
                }
            }
        },
    }

</script>

<style lang="scss" scoped>
    .el-col-12{
        text-align: center;
    }
</style>