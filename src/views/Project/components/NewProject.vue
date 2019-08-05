<template>
    <Dialog
        title="项目"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="项目描述">
                <el-input v-model="form.detail" placeholder="请输入应用描述"></el-input>
            </el-form-item>
            <el-form-item label="项目所属位置" prop="area">
                <el-cascader 
                    placeholder="请选择项目所属区域"
                    :options="options" 
                    v-model="form.area"  
                    :props="{
                        children:'childList',
                        value:'id',
                        label:'name'
                    }"
                />
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'确认编辑':'确认添加'}}
                </el-button>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog'
    import {mapActions} from 'vuex'
    
    const resetForm = {
        name:'',
        detail: '',
        area:[]
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
                options:[],
                form: {
                    name:'',
                    detail: '',
                    area:['44','4403','440305']
                },
                rules: {
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    area: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                }
            }
        },
        mounted () {
            const areaTree = JSON.parse(sessionStorage.getItem('areaTree'));
            this.options = areaTree
        },
        watch: {
            value(value) {
                this.form = {
                    ...this.form,
                    ...value,
                    area:(value.areaId&&`${value.areaId}`.split()) || []
                }
            },
        },
        methods: {
            ...mapActions('overall',[
                'createProject', 
                'updateProject'
            ]),
            handleClose(res) {
                this.form = resetForm;
                this.close(res);
            },
            submitForm() {
                this.$refs.appForm.validate((valid) => {
                    if (valid) {
                        if(!this.editFlag){
                            this.createProject({
                                ...this.form,
                                areaId:this.form.area.length&&this.form.area[2],
                                location:''
                            }).then(res=>{
                                this.handleClose(res)
                            })
                        }else{
                            this.updateProject({
                                ...this.form,
                                areaId:this.form.area.length&&this.form.area[2],
                                location:''
                            }).then(res=>{
                                this.handleClose(res)
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .create_edit{
        .el-dialog{
            width: 450px;
        }
    }
</style>