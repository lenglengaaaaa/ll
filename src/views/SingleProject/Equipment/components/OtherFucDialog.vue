<template>
    <div class="uploadDialog">
        <el-dialog
            title="其他功能"
            :visible="visible"
            :before-close="handleClose"
            destroy-on-close
            :close-on-click-modal="false"
            center
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
                    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                        <el-form-item 
                            label="集中器地址"
                            prop="deviceAddress"
                            :rules="[{ message:'请填写集中器地址', required:true, trigger: ['blur','change'] }]"
                        >
                            <el-input v-model="form.deviceAddress"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="next" :type="active==2?'success':'primary'">
                    {{active == 2?'完成':'下一步'}}
                </el-button>
            </span>
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
                    deviceAddress:''
                },
                rules:{}
            };
        },
        methods: {
            ...mapActions('equip',[
                'updateConcentratorBindinig'
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
                        this.updateConcentratorBindinig(deviceAddress).then(res=>{
                            if(!res) return;
                            this.$refs[form].resetFields();
                            this.closeDialog();
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
        }
    }
</script>

<style lang="scss">
    .uploadDialog{
        .el-dialog{
            .el-dialog__body{
                .funcBox{
                    .updateBinding{
                        height: 100px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .el-form-item{
                            margin: 0px;
                        }
                    }
                }
            }
        }
    }
</style>