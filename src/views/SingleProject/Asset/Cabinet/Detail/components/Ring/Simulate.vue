<template>
    <div class="SIMULATE_CONTAINER">
        <el-form label-position="left" label-width="150px" :model="form" ref="form" :rules="rules">
            <el-form-item label="设备地址域" prop="deviceAddress">
                <el-input v-model="form.deviceAddress"></el-input>
            </el-form-item>
            <el-form-item label="温度(0 ~ 127℃)" prop="lineTemp">
                <el-input v-model="form.lineTemp"></el-input>
            </el-form-item>
            <el-form-item label="电流(0 ~ 6000A)" prop="lineA">
                <el-input v-model="form.lineA"></el-input>
            </el-form-item>
            <el-form-item label="电压(0 ~ 600V)" prop="lineV">
                <el-input v-model="form.lineV"></el-input>
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
                    deviceAddress: '',
                    lineTemp:'0',
                    lineA: '0',
                    lineV: '0'
                },
                rules: {
                    deviceAddress: [ { required: true, message: '请输入设备编码', trigger: 'blur' }, ],
                    lineTemp: [ { trigger: 'blur' } ],
                    lineA: [ { trigger: 'blur' } ],
                    lineV: [ { trigger: 'blur' } ]
                },
            }
        },
        props: {
            client: {
                type: Object,
                default: null
            }
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                if (valid) {
                    const { deviceAddress, lineTemp, lineA, lineV } = this.form;
                    this.client.publish(`topic_data_${this.projectId}`,JSON.stringify({
                        address: deviceAddress,
                        data:{
                            lineTemp,
                            lineA,
                            lineV
                        },
                        fc: "36",
                        time: new Date()
                    }))
                    this.$message({
                        message: '设置成功!',
                        type: 'success'
                    });
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