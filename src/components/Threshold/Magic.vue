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
            >
                <el-row :gutter="20">
                    <el-col :span="5" :xs="24">
                        <el-form-item label="是否进行环境温度采集" prop="tempSwitch">
                            <el-select v-model="thForm.tempSwitch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="是否进行环境湿度采集" prop="humSwitch">
                            <el-select v-model="thForm.humSwitch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="是否进行O2含量采集" prop="o2Switch">
                            <el-select v-model="thForm.o2Switch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="是否进行CO含量采集" prop="coSwitch">
                            <el-select v-model="thForm.coSwitch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="是否进行H2S含量采集" prop="h2sSwitch">
                            <el-select v-model="thForm.h2sSwitch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="是否进行O3含量采集" prop="o3Switch">
                            <el-select v-model="thForm.o3Switch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="是否进行CH4含量采集" prop="ch4switch">
                            <el-select v-model="thForm.ch4switch">
                                <el-option label="是" :value="1"/>
                                <el-option label="否" :value="0"/>
                            </el-select> 
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :xs="24"> 
                        <el-form-item label="环境温度告警限值(℃)" prop="temp">
                            <el-input v-model.number="thForm.temp" autocomplete="off" :disabled="!thForm.tempSwitch"></el-input>
                        </el-form-item>
                        <el-form-item label="环境湿度告警限值(%)" prop="hum">
                            <el-input v-model.number="thForm.hum" autocomplete="off" :disabled="!thForm.humSwitch"></el-input>
                        </el-form-item>
                        <el-form-item label="氧气含量告警限值(%)" prop="o2">
                            <el-input v-model.number="thForm.o2" autocomplete="off" :disabled="!thForm.o2Switch"></el-input>
                        </el-form-item>
                        <el-form-item label="一氧化碳含量告警限值(ppm)" prop="co">
                            <el-input v-model.number="thForm.co" autocomplete="off" :disabled="!thForm.coSwitch"></el-input>
                        </el-form-item>
                        <el-form-item label="硫化氢含量告警限值(ppm)" prop="h2s">
                            <el-input v-model.number="thForm.h2s" autocomplete="off" :disabled="!thForm.h2sSwitch"></el-input>
                        </el-form-item>
                        <el-form-item label="臭氧含量告警限值(ppm)" prop="o3">
                            <el-input v-model.number="thForm.o3" autocomplete="off" :disabled="!thForm.o3Switch"></el-input>
                        </el-form-item>
                        <el-form-item label="烷类含量告警限值(ppm)" prop="ch4">
                            <el-input v-model.number="thForm.ch4" autocomplete="off" :disabled="!thForm.ch4switch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24">
                        <el-form-item label="环境温度的采集周期(分)" prop="tempSamplingPeriod">
                            <el-input 
                                v-model.number="thForm.tempSamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.tempSwitch"
                            />
                        </el-form-item>
                        <el-form-item label="环境湿度采集周期(分)" prop="humSamplingPeriod">
                            <el-input 
                                v-model.number="thForm.humSamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.humSwitch"
                            />
                        </el-form-item>
                        <el-form-item label="O2含量采集周期(分)" prop="o2SamplingPeriod">
                            <el-input 
                                v-model.number="thForm.o2SamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.o2Switch"
                            />
                        </el-form-item>
                        <el-form-item label="CO含量采集周期(分)" prop="coSamplingPeriod">
                            <el-input 
                                v-model.number="thForm.coSamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.coSwitch"
                            />
                        </el-form-item>
                        <el-form-item label="H2S含量采集周期(分)" prop="h2sSamplingPeriod">
                            <el-input 
                                v-model.number="thForm.h2sSamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.h2sSwitch"
                            />
                        </el-form-item>
                        <el-form-item label="O3含量采集周期(分)" prop="o3SamplingPeriod">
                            <el-input 
                                v-model.number="thForm.o3SamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.o3Switch"
                            />
                        </el-form-item>
                        <el-form-item label="CH4含量采集周期(分)" prop="ch4SamplingPeriod">
                            <el-input 
                                v-model.number="thForm.ch4SamplingPeriod" 
                                autocomplete="off"
                                :disabled="!thForm.ch4switch"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24">
                        <el-form-item label="传感器上报数据的周期(分)" prop="reportedPeriod">
                            <el-input v-model.number="thForm.reportedPeriod" autocomplete="off"></el-input>
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
                    temp:0,
                    hum:0,
                    o2:0,
                    h2s:0,
                    co:0,
                    ch4:0,
                    o3:0,
                    tempSwitch:1,
                    humSwitch:1,
                    o2Switch:1,
                    coSwitch:1,
                    h2sSwitch:1,
                    o3Switch:1,
                    ch4switch:1,
                    tempSamplingPeriod:5,
                    humSamplingPeriod:5,
                    o2SamplingPeriod:5,
                    coSamplingPeriod:5,
                    h2sSamplingPeriod:5,
                    o3SamplingPeriod:5,
                    ch4SamplingPeriod:5,
                    reportedPeriod:5
                },
            }
        },
    }

</script>

<style lang="scss">
    
</style>