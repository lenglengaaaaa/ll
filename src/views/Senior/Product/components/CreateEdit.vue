<template>
    <Dialog
        title="应用"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="applyForm">
            <el-form-item label="产品名称" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="产品自解码插件" prop="productProfile">
                <el-input v-model="form.productProfile" placeholder="请输入产品自解码插件"></el-input>
            </el-form-item>
            <el-form-item label="IMEI" prop="deviceEUI">
                <el-input v-model="form.deviceEUI" placeholder="请输入产品IMEI"></el-input>
            </el-form-item>
            <el-form-item label="所关联应用">
                <el-select v-model="form.appId" multiple placeholder="请选择所关联应用">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    编辑完成
                </el-button>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script> 
    import Dialog from '@/components/Dialog'

    const restForm ={
        productName:'',
        productProfile:'',
        deviceEUI:'',
        appId:[]
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
                options: [{
                    value: '0',
                    label: '黄金糕'
                }, {
                    value: '1',
                    label: '双皮奶'
                }, {
                    value: '2',
                    label: '蚵仔煎'
                }, {
                    value: '3',
                    label: '龙须面'
                }, {
                    value: '4',
                    label: '北京烤鸭'
                }],
                form: {
                    productName:'',
                    productProfile:'',
                    deviceEUI:'',
                    appId:[]
                },
                rules: {
                    productName: [
                        { required: true, message: '请输入产品名称', trigger: 'blur' },
                    ],
                    productProfile: [
                        { required: true, message: '请输入产品自解码插件', trigger: 'blur' },
                    ],
                    deviceEUI: [
                        { required: true, message: '请输入产品IMEI', trigger: 'blur' },
                    ]
                }
            }
        },
        watch: {
            value(value) {
                const appId = value.appId.split(',')
                this.form = {
                    ...this.form,
                    ...value,
                    appId
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