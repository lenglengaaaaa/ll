<template>
    <div class="CREATE_EDIT">
        <el-form label-position="top" label-width="100px" :model="form" ref="moduleForm">
            <el-form-item label="模组名称">
                <el-input v-model="form.name" placeholder="请输入模组名称"></el-input>
            </el-form-item>
            <el-form-item label="厂商ID">
                <el-input v-model="form.manufacturerId" placeholder="请输入厂商ID"></el-input>
            </el-form-item>
            <el-form-item label="厂商名称">
                <el-input v-model="form.manufacturerName" placeholder="请输入厂商名称"></el-input>
            </el-form-item>
            <el-form-item label="mac地址">
                <el-input v-model="form.mac" placeholder="请输入mac地址"></el-input>
            </el-form-item>
            <el-form-item label="模组型号">
                <el-input v-model="form.model" placeholder="请输入模组型号"></el-input>
            </el-form-item>
            <el-form-item label="模组位置">
                <el-input v-model="form.location" placeholder="请输入模组位置"></el-input>
            </el-form-item>
            <el-form-item label="模组软件版本">
                <el-input v-model="form.swversion" placeholder="请输入模组软件版本"></el-input>
            </el-form-item>
            <el-form-item label="模组固件版本">
                <el-input v-model="form.fwversion" placeholder="请输入模组固件版本"></el-input>
            </el-form-item>
            <el-form-item label="模组硬件版本">
                <el-input v-model="form.hwversion" placeholder="请输入模组硬件版本"></el-input>
            </el-form-item>
            <el-form-item label="协议类型">
                <el-input v-model="form.protocolType" placeholder="请输入协议类型"></el-input>
            </el-form-item>
            <el-form-item label="Bridge标识">
                <el-input v-model="form.bridgeid" placeholder="请输入Bridge标识"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.detail" placeholder="请输入模组信息描述"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submit" >
                    编辑完成
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    moduleName:'',
                    manufacturerId:'',
                    manufacturerName:'',
                    mac:'',
                    model:'',
                    location:'',
                    swversion:'',
                    fwversion:'',
                    hwversion:'',
                    protocolType:'',
                    bridgeid:'',
                    moduleDetail:''
                },
            }
        },
        mounted () {
            const data = this.$route.params.data;
            this.form={
                ...this.form,
                ...data
            }
        },
        methods: {
            submit() {
                this.$refs.moduleForm.validate((valid) => {
                    if (valid) {
                        this.$message({
                            message: '编辑模组成功',
                            type: 'success'
                        });
                        this.$router.push({name:'ModuleList'})
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
</style>