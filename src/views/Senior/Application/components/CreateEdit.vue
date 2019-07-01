<template>
    <Dialog
        title="应用"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="applyForm">
            <el-form-item label="应用名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="应用密钥" prop="key">
                <el-input v-model="form.key" placeholder="请输入应用密钥"></el-input>
            </el-form-item>
            <el-form-item label="应用类型" prop="type">
                <el-input v-model="form.type" placeholder="请输入应用类型"></el-input>
            </el-form-item>
            <el-form-item label="入网模式" prop="netIn">
                <el-input v-model="form.netIn" placeholder="请输入入网模式"></el-input>
            </el-form-item>
            <el-form-item label="coap链接方式" prop="coap">
                <el-input v-model="form.coap" placeholder="请输入coap链接方式"></el-input>
            </el-form-item>
            <el-form-item label="mqtt链接方式" prop="mqtt">
                <el-input v-model="form.mqtt" placeholder="请输入mqtt链接方式"></el-input>
            </el-form-item>
            <el-form-item label="AgentLite链接方式" prop="agent">
                <el-input v-model="form.agent" placeholder="请输入AgentLite链接方式"></el-input>
            </el-form-item>
            <el-form-item label="https链接方式" prop="https">
                <el-input v-model="form.https" placeholder="请输入https链接方式"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description" placeholder="请输入应用描述"></el-input>
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
        name:'',
        key:'',
        type:"",
        netIn:'',
        coap:'',
        mqtt:'',
        agent:'',
        https:'',
        description:''
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
                    key:'',
                    type:"",
                    netIn:'',
                    coap:'',
                    mqtt:'',
                    agent:'',
                    https:'',
                    description:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    key: [
                        { required: true, message: '请输入应用密钥', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入应用类型', trigger: 'blur' }
                    ],
                    netIn: [
                        { required: true, message: '请输入入网模式', trigger: 'blur' }
                    ],
                    coap: [
                        { required: true, message: '请输入coap链接方式', trigger: 'blur' }
                    ],
                    mqtt: [
                        { required: true, message: '请输入mqtt链接方式', trigger: 'blur' }
                    ],
                    agent: [
                        { required: true, message: '请输入AgentLite链接方式', trigger: 'blur' }
                    ],
                    https: [
                        { required: true, message: '请输入https链接方式', trigger: 'blur' }
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
    .create_edit{
        .el-dialog{
            width: 1000px;
            margin-top:3vh !important; 
        }
    }
</style>