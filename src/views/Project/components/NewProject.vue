<template>
    <cc-dialog
        title="项目"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="projectForm">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="项目描述" prop="detail">
                <el-input v-model="form.detail" placeholder="请输入应用描述"></el-input>
            </el-form-item>
            <el-form-item label="项目所属位置" prop="area">
                <el-cascader 
                    placeholder="请选择项目所属区域"
                    :options="areaTree" 
                    v-model="form.area"  
                    :props="{
                        children:'childList',
                        value:'id',
                        label:'name'
                    }"
                />
            </el-form-item>
            <el-form-item label="项目经纬度" class="map">
                <cc-mapSingle 
                    vid="newEquip"
                    :position="position"
                    :get="getPostion"
                />
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'确认编辑':'确认添加'}}
                </el-button>
            </el-form-item>
        </el-form>
    </cc-dialog>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import { splitString } from '@/utils/methods'

    const mapCenter = window.$cfg.mapCenter;
    
    const resetForm = {
        name:'',
        detail: '',
        area:[]
    }
    
    export default {
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
                position: mapCenter,
                form: {
                    name:'',
                    detail: '',
                    area:[]
                },
                rules: {
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    area: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    detail: [],
                }
            }
        },
        watch: {
            value(value) {
                this.form = {
                    ...this.form,
                    ...value,
                    area:(value.areaId && splitString(value.areaId))|| []
                }
                this.position= [ value.longitude, value.latitude ];
            },
        },
        computed: {
            ...mapState('overall',[
                'areaTree',
            ]),
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
            //获取经纬度
            getPostion(lng,lat){
                this.position =[lng,lat];
            },
            submitForm() {
                this.$refs.projectForm.validate((valid) => {
                    if (valid) {
                        const [ longitude,latitude ] = this.position;

                        if(!this.editFlag){
                            this.createProject({
                                ...this.form,
                                areaId:this.form.area.length&&this.form.area[2],
                                location:'',
                                longitude,
                                latitude
                            }).then(res=>{
                                this.handleClose(res)
                            })
                        }else{
                            this.updateProject({
                                ...this.form,
                                areaId:this.form.area.length&&this.form.area[2],
                                location:'',
                                longitude,
                                latitude
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