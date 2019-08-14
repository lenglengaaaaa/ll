<template>
    <Dialog
        title="角色"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="applyForm">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="form.description" type="textarea" placeholder="请输入备注"></el-input>
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
                    name:'',
                    description:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
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
                this.form = restForm;
                this.close();
            },
            submitForm() {
                this.$refs.applyForm.validate((valid) => {
                if (valid) {
                    console.log(this.form,'form')
                    this.handleClose()
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
        },
    }
</script>

<style lang="scss">
</style>