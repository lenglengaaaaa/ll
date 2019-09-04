<template>
    <Dialog
        title="应用"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="applyForm">
            <el-form-item label="设备EUI" prop="deviceAdress">
                <el-input v-model="form.deviceAdress" placeholder="请输入设备EUI"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'编辑完成':'创建完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script> 
    import Dialog from '@/components/Dialog'

    const restForm ={
        deviceAdress:'',
        remark:''
    }
    
    export default {
        components: {
            Dialog
        },
        props: {
            visible:Boolean,
            editFlag:Boolean,
            close:Function,
            value:{
                type:Object,
                default:()=>{}
            }
        },
        data() {
            return {
                form: {
                    eui:'',
                    remark:''
                },
                rules: {
                    deviceAdress: [
                        { required: true, message: '请输入设备EUI', trigger: 'blur' },
                    ],
                }
            }
        },
        watch: {
            value(value) {
                this.form = {
                    ...this.form,
                    ...value
                }
            },
        },
        methods: {
            handleClose() {
                this.form = restForm
                this.close();
            },
            submitForm() {
                this.$refs.applyForm.validate((valid) => {
                if (valid) {
                    this.handleClose()
                } else {
                    return false;
                }
                });
            },
        },
    }
</script>

<style lang="scss">
</style>