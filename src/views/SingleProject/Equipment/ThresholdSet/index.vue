<template>
    <div class="deviceThreshold">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="info">
                    <strong>阈值设置</strong>
                    <div>{{deviceName}}</div>
                </div>
                <el-button type="text" @click="resetDeafault">重置为默认值</el-button>
            </div>
            <el-form 
                :model="thForm" 
                :rules="rules"
                ref="thForm"  
            >
                <template v-if="!flag">
                    <el-form-item label="电压最大值" prop="maxV">
                        <el-input v-model.number="thForm.maxV"></el-input>
                    </el-form-item>
                    <el-form-item label="电压最小值" prop="minV">
                        <el-input v-model.number="thForm.minV" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电流最大值" prop="maxA">
                        <el-input v-model.number="thForm.maxA" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="温度最大值" prop="maxTemp">
                        <el-input v-model.number="thForm.maxTemp" autocomplete="off"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-row :gutter="20">
                        <el-col :span="12" :xs="24"> 
                            <el-form-item label="温度" prop="temp">
                                <el-input v-model.number="thForm.temp" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="环境湿度" prop="hum">
                                <el-input v-model.number="thForm.hum" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="氧气含量" prop="o2">
                                <el-input v-model.number="thForm.o2" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="硫化氢" prop="h2s">
                                <el-input v-model.number="thForm.h2s" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :xs="24">
                            <el-form-item label="一氧化碳" prop="co">
                                <el-input v-model.number="thForm.co" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="烷类" prop="ch4">
                                <el-input v-model.number="thForm.ch4" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="臭氧" prop="o3">
                                <el-input v-model.number="thForm.o3" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                flag:true,
                deviceName:'',
                thForm:{  
                    maxV: 100,
                    minV: 10,
                    maxA: 400,
                    maxTemp: 60,
                    temp:0,
                    hum:0,
                    o2:0,
                    h2s:0,
                    co:0,
                    ch4:0,
                    o3:0,
                },
                rules:{
                    maxV: [],minV: [],maxA: [],maxTemp: [],
                    temp: [],hum: [],o2: [],h2s: [],co: [],ch4: [],o3: [],
                }
            }
        },
        computed: {
            device() {
                return JSON.parse(sessionStorage.getItem('equipObj')).data
            }
        },
        created () {
            //30:魔节 , 36:魔戒
            const {deviceType,name} = this.device;
            this.flag = deviceType==30?true:false;
            this.deviceName = name;
        },
        methods: {
            //重置为默认值
            resetDeafault(){
                //魔节
                if(this.flag){
                    console.log('魔节')
                    return;
                }
                //魔戒
                console.log('魔戒')
            },
            submitForm() {
                this.$refs.thForm.validate((valid) => {
                    if (valid) {
                        //魔节
                        if(this.flag){
                            console.log('魔节')
                            return;
                        }
                        //魔戒
                        console.log('魔戒')
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.thForm.resetFields();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .deviceThreshold{
        max-width: 100%;
        display: flex;
        justify-content: center;
        .box-card{
            .el-card__header{
                padding: 10px 20px;
                .clearfix{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .info{
                        strong{
                            font-size: 1.2rem;
                        }
                        div{
                            padding-top: 5px;
                            font-size: .7rem;
                            color: #708090;
                        }
                    }   
                }
            }
            .el-card__body{
                padding: 10px 20px;
                .el-form{
                    width:600px;
                    .submit{
                        padding-top: 20px;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>