<template>
    <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
        <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
            <el-input v-model="form.number" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备EUI" prop="eui">
            <el-input 
                v-model="form.eui" 
                placeholder="0000000000000000" 
                maxlength="16"
            />
        </el-form-item>
        <el-form-item label="入网模式" prop="pattern">
            <el-select v-model="form.pattern" placeholder="请选择入网模式">
                <el-option label="ABP-Device-Profile" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="submit">
            <el-button type="primary" @click="submit" >
                下一步
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        props: {
            next: Function
        },
        data() {
            var checkEui = (rule, value, callback) => {
                if(!value){
                    return callback(new Error('请输入设备EUI'))
                }
                const r =  /^\+?[1-9][0-9]*$/;
                if(!r.test(value)){
                    return callback(new Error('请输入正整数'))
                }
                if (value.length<16) {
                    return callback(new Error('设备EUI长度为16'));
                }
                callback();
            };
            return {
                form: {
                    name:'',
                    number:'',
                    eui:'',
                    pattern:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入设备名称', trigger: 'blur' },
                    ],
                    number: [
                        { required: true, message: '请输入设备EUI', trigger: 'blur' },
                    ],
                    eui: [
                        { required: true, validator: checkEui, trigger: 'blur' },
                    ],
                    pattern: [
                        { required: true, message: '请选择设备入网模式', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            submit() {
                this.next();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .el-form{
        width:500px;
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
            padding-top: 20px;
            text-align: center;
        }
    }
</style>