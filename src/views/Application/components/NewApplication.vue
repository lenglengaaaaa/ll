<template>
    <div class="NewApplication_container">
        <div class="nav">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/application' }">我的应用</el-breadcrumb-item>
                <el-breadcrumb-item >{{editFlag?'编辑应用':'添加应用'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="body">
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="form">
                <el-form-item label="应用ID" prop="id">
                    <el-input v-model="form.id" placeholder="请输入应用ID"></el-input>
                </el-form-item>
                <el-form-item label="应用名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
                </el-form-item>
                <el-form-item label="应用描述" >
                    <el-input v-model="form.description" placeholder="请输入应用描述"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" prop="type">
                    <el-select v-model="form.type" placeholder="请选择应用类型" :disabled="editFlag?true:false">
                        <el-option label="低压应用" value="0"></el-option>
                        <el-option label="魔节应用" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm" size="small">
                        <i class="el-icon-check"></i>
                        {{editFlag?'确认编辑':'确认添加'}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editFlag:false,
                form: {
                    id: '',
                    name:'',
                    description: '',
                    type:''
                },
                rules: {
                    id: [
                        { required: true, message: '请输入应用ID', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择应用类型', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted () {
            const {editFlag,data} = this.$route.params;
            this.editFlag  = editFlag
            this.form ={
                ...this.form,
                ...data
            }
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$router.push('/application')
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
    .NewApplication_container{
        height: 100%;
        padding: 0 20px;
        .nav{
            padding: 10px 0;
        }
        .body{
            display: flex;
            justify-content: center;
            align-items: center;
            .el-form{
                width: 460px;
                padding: 15px;
                background:#fff;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                .el-input__inner{
                    border-radius: 0px;
                    height: 35px;
                    line-height: 35px;
                }
                .el-select{
                    width: 100%;
                }
                .submit{
                    text-align: center;
                    padding: 15px 0 10px 0;
                }
            }
        }
    }
</style>