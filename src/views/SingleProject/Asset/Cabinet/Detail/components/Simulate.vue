<template>
    <div class="SIMULATE_CONTAINER">
        <el-form label-position="left" label-width="150px" :model="form" ref="form" :rules="rules">
            <el-form-item label="设备编码(4位数字)" prop="number">
                <el-input v-model="form.number"></el-input>
            </el-form-item>
            <el-form-item label="温度(0 ~ 127℃)" prop="temp">
                <el-input v-model="form.temp"></el-input>
            </el-form-item>
            <el-form-item label="电流(0 ~ 6000A)" prop="a">
                <el-input v-model="form.a"></el-input>
            </el-form-item>
            <el-form-item label="电压(0 ~ 600V)" prop="v">
                <el-input v-model="form.v"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    number: '',
                    temp:'',
                    a: '',
                    v: ''
                },
                rules: {
                    number: [ { required: true, message: '请输入设备编码', trigger: 'blur' }, ],
                    temp: [ { trigger: 'blur' } ],
                    a: [ { trigger: 'blur' } ],
                    v: [ { trigger: 'blur' } ]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                if (valid) {
                    console.log('submit')
                } else {
                    return false;
                }
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .SIMULATE_CONTAINER{
        .el-form{
            width: 500px;
            max-width: 100%;
            margin: 20px auto;
        }
    }
</style>