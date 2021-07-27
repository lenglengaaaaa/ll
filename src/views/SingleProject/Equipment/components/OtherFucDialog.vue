<template>
    <div class="uploadDialog">
        <el-dialog
            title="其他功能"
            :visible="visible"
            :before-close="handleClose"
            destroy-on-close
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="showClose"
            center
            width="30%"
        >  
            <div
                v-loading="loading"
                element-loading-text="绑定关系中..."
            >
                <el-steps :active="active" align-center finish-status="success">
                    <el-step title="功能选择" />
                    <el-step title="操作" />
                </el-steps>
                <div v-if="active == 1" class="selectBox">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option label="修改集中器绑定关系" :value="0"/>
                    </el-select>
                </div>
                <div v-if="active == 2" class="funcBox">
                    <div class="updateBinding">
                        <el-form ref="form" :model="form" label-width="100px" :rules="rules" label-position="left">
                            <el-form-item 
                                label="集中器编号"
                                prop="deviceAddress"
                                :rules="[{ message:'请填写集中器编号', required:true, trigger: ['blur','change'] }]"
                            >
                                <el-input v-model="form.deviceAddress"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="dialog-footer">
                    <el-button @click="next" :type="active==2?'success':'primary'">
                        {{active == 2?'完成':'下一步'}}
                    </el-button>
                </div>
            </div>
            
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name:'UploadDialog',
        props: {
            visible: Boolean,
            close:Function,
        },
        data() {
            return {
                active:1,
                value:0,
                form:{
                    deviceAddress:'',
                    groupId:1
                },
                rules:{},
                showClose:true,
                loading:false,
                answerMqtt:null
            };
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        destroyed () {
            this.answerMqtt && this.answerMqtt.end();
        },
        methods: {
            ...mapActions('mini',[
                'issueBinding'
            ]),
            next(){
                if(this.active < 2){
                    this.active++
                }else{
                    this.submitBinding('form');
                }
            },
            submitBinding(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        const { deviceAddress } = this.form;
                        this.issueBinding(deviceAddress).then(res=>{
                            if(!res) return;

                            //旧
                            this.$refs[form].resetFields();
                            this.closeDialog();


                            //新
                            // this.loading = true;
                            // this.showClose = false;
                            // this.concentratorMqtt();
                        });
                    }
                });
            },
            handleClose(done) {
                done();
                this.closeDialog();
            },
            closeDialog(){
                this.close(this.active);
                this.active = 1;
            },
            /**
             * 获取集中器下发绑定回应
             */
            concentratorMqtt(){
                this.answerMqtt = this.$mqtt.connect(`topic_answer_${this.projectId}`);

                this.$mqtt.listen(this.answerMqtt,res=>{

                    console.log(res,'下发绑定关系回应');

                    const { address, data } = res;
                    // if( address != this.form.deviceAdress) return;

                    this.loading = false;
                    this.showClose = true;
                    
                    /**
                     * @param data 2.已响应, 3.已过期
                     */
                    const status = {
                        2:{
                            tip:"集中器关系绑定成功",
                            type:"success"
                        },
                        3:{
                            tip:"集中器关系绑定失败,请重新下发",
                            type:"error"
                        }
                    }

                    this.$message({
                        message:  status[+data].tip,
                        type: status[+data].type,
                    });
                    
                    setTimeout(()=> {
                        this.answerMqtt && this.answerMqtt.end()

                        if( data == 2){
                            this.$refs["form"].resetFields();
                            this.closeDialog();
                        }
                    });
                })
            }
        }
    }
</script>

<style lang="scss">
    .uploadDialog{
        .el-dialog{
            .el-dialog__body{
                .el-steps{
                    margin-bottom: 15px;
                }
                .selectBox{
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-top: 0px;
                }
                .funcBox{
                    .updateBinding{
                        height: 100px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .el-form-item{
                            margin:15px 0;
                        }
                    }
                }
                .dialog-footer{
                    text-align: center;
                }
            }
        }
    }
</style>