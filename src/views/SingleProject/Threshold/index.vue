<template>
    <div class="OVER_THRESHOLD">
        <div class="container">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <strong>阈值设置-魔戒</strong>
                            <el-button type="text" @click="resetDeafault('ringForm')">重置为默认值</el-button>
                        </div>
                        <el-form 
                            :model="ringForm" 
                            :rules="rules"
                            ref="ringForm"  
                        >
                            <el-form-item label="电压最大值" prop="maxV">
                                <el-input v-model.number="ringForm.maxV"></el-input>
                            </el-form-item>
                            <el-form-item label="电压最小值" prop="minV">
                                <el-input v-model.number="ringForm.minV" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="电流最大值" prop="maxA">
                                <el-input v-model.number="ringForm.maxA" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="温度最大值" prop="maxTemp">
                                <el-input v-model.number="ringForm.maxTemp" autocomplete="off"></el-input>
                            </el-form-item>
                                
                            <el-form-item class="submit">
                                <el-button type="primary" @click="submitForm('ringForm')">提交</el-button>
                                <el-button @click="resetForm('ringForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <strong>阈值设置-魔节</strong>
                            <el-button type="text" @click="resetDeafault('magicForm')">重置为默认值</el-button>
                        </div>
                        <el-form
                            :model="magicForm" 
                            :rules="rules"
                            ref="magicForm" 
                        >
                            <el-row :gutter="20">
                                <el-col :span="12" :xs="24"> 
                                    <el-form-item label="温度" prop="temp">
                                        <el-input v-model.number="magicForm.temp" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="环境湿度" prop="hum">
                                        <el-input v-model.number="magicForm.hum" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="氧气含量" prop="o2">
                                        <el-input v-model.number="magicForm.o2" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="硫化氢" prop="h2s">
                                        <el-input v-model.number="magicForm.h2s" autocomplete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" :xs="24">
                                    <el-form-item label="一氧化碳" prop="co">
                                        <el-input v-model.number="magicForm.co" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="烷类" prop="ch4">
                                        <el-input v-model.number="magicForm.ch4" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="臭氧" prop="o3">
                                        <el-input v-model.number="magicForm.o3" autocomplete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item class="submit">
                                <el-button type="primary" @click="submitForm('magicForm')">提交</el-button>
                                <el-button @click="resetForm('magicForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                flag:true,
                deviceName:'',
                magicForm:{  
                    temp:0,
                    hum:0,
                    o2:0,
                    h2s:0,
                    co:0,   
                    ch4:0,
                    o3:0,
                },
                ringForm:{
                    maxV: 100,
                    minV: 10,
                    maxA: 400,
                    maxTemp: 60,
                },
                rules:{
                    maxV: [],minV: [],maxA: [],maxTemp: [],
                    temp: [],hum: [],o2: [],h2s: [],co: [],ch4: [],o3: [],
                }
            }
        },
        created () {
            
        },
        computed: {
            project() {
                return JSON.parse(sessionStorage.getItem('project'))
            }
        },
        methods: {
            //重置为默认值
            resetDeafault(formName){
                //魔节
                if(formName==='magicForm'){
                    console.log('魔节')
                    return;
                }
                //魔戒
                console.log('魔戒')
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //魔节
                        if(formName==='magicForm'){
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .OVER_THRESHOLD{
        display: flex;
        justify-content: center;
        .container{
            background: #fff;
            padding: 10px 20px;
            border-radius: 10px;
            box-shadow: 0 1px 1px rgba(189, 195, 199, 0.8);
            width: 1300px;
            max-width: 100%;
            .is-always-shadow{
                box-shadow: none;
            }
            .box-card{
                background: none;
                border-radius: 0px;
                border:none;
                border: 1px solid #ebeef5;
                .el-card__header{
                    padding: 10px 20px;
                    .clearfix{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        strong{
                            font-size: 1.2rem;
                        }
                    }
                }
                .el-card__body{
                    padding: 10px 20px;
                    .el-form{
                        widows: 100%;
                        .submit{
                            padding-top: 20px;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
</style>