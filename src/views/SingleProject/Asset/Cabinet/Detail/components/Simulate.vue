<template>
    <div class="SIMULATE_CONTAINER">
        <el-form label-position="left" label-width="150px" :model="form" ref="form" :rules="rules">
            <el-form-item label="设备地址域" prop="deviceAddress">
                <el-input v-model="form.deviceAddress"></el-input>
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
                    deviceAddress: '',
                    temp:'0',
                    a: '0',
                    v: '0'
                },
                rules: {
                    deviceAddress: [ { required: true, message: '请输入设备编码', trigger: 'blur' }, ],
                    temp: [ { trigger: 'blur' } ],
                    a: [ { trigger: 'blur' } ],
                    v: [ { trigger: 'blur' } ]
                },
                client:null
            }
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        created () {
            this.client = this.$mqtt.connect(`topic_data_1`);
        },
        destroyed () {
            this.client&&this.client.end();
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                if (valid) {
                    const {deviceAddress,temp,a,v} = this.form;
                    this.client.publish(`topic_data_${this.projectId}`,JSON.stringify({
                        address: deviceAddress,
                        data:{
                            lineA:a,
                            lineV: v,
                            temp,
                        },
                        fc: "36",
                        outLineId: "1",
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