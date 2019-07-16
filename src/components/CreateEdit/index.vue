<template>
    <div class="CREATE_EDIT">
        <el-form 
            label-position="top" 
            label-width="100px" 
            :model="form" 
            :rules="rules" 
            ref="magicForm"
            :style="{maxHeight:'calc(100vh - 170px)'}"
        >
            <el-form-item label="资产名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入资产名称"></el-input>
            </el-form-item>
            <el-form-item label="资产编号" prop="number">
                <el-input v-model="form.number" placeholder="请输入资产编号"></el-input>
            </el-form-item>
            
            <slot></slot>
            <template v-if="hasCable">
                <el-form-item label="主进线" prop="mainComeline">
                    <el-input v-model="form.mainComeline" placeholder="请输入资产名称"></el-input>
                </el-form-item>
                <el-form-item label="备用进线" prop="comeLine">
                    <el-input v-model="form.comeLine" placeholder="请输入资产名称"></el-input>
                </el-form-item>
            </template>
            
            <el-form-item label="资产详情">
                <el-input v-model="form.detail" placeholder="请输入资产详情"></el-input>
            </el-form-item>
            <el-form-item label="位置信息" prop="location" class="address">
                <el-cascader :options="options" v-model="form.city"></el-cascader>
                <el-input v-model="form.location" placeholder="请输入设备位置信息"></el-input>
            </el-form-item>

            <template v-if="hasMap">
                <el-form-item label="资产经纬度" class="map">
                    <MapSingle 
                        vid="newApply"
                        :position="position"
                        :get="getPostion"
                    />
                </el-form-item>
            </template>
            
            <el-form-item class="submit">
                <el-button type="primary" @click="submit" >
                    {{!editFlag?'创建完成':'编辑完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'
    import {options} from '@/utils/options'

    export default {
        components: {
            MapSingle
        },
        props: {
            form: {
                type: Object,
                default: ()=>{}
            },
            create:Function,
            edit:Function,
            hasCable:{
                type:Boolean,
                default:true
            },
            hasMap:{
                type:Boolean,
                default:true
            },
            type:Number
        },
        data() {
            const checkAccount = (rule, value, callback) => {
                if(this.editFlag) return callback();
                if (!value) {
                    return callback(new Error('请输入用户账号'));
                }
                const obj ={num:value,type:this.type}
                this.$store.dispatch('asset/checkNo', obj).then(res=>{
                    if(!res){
                        return callback(new Error('资产编号已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                options:options,
                position:[],
                rules:{
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, validator: checkAccount, trigger: 'blur' }],
                    mainComeline: [{ required: true, message: '请输入主进线', trigger: 'blur' }],
                    comeLine: [{ required: true, message: '请输入备用进线', trigger: 'blur' }],
                    courtsId: [{ required: true, message: '请选择所属台区', trigger: 'change' }],
                    roomId: [{ required: true, message: '请选择所属配电房', trigger: 'change' }],
                    parentId:[{ required: true, message: '请选择所属配电柜', trigger: 'change' }],
                    lineId: [{ required: true, message: '请选择所属主线缆', trigger: 'change' }],
                    trapId: [{ required: true, message: '请选择所属井盖', trigger: 'change' }],
                }
            }
        },
        created () {
            const {data} = JSON.parse(sessionStorage.getItem('assetObj'));
            this.position = [data.longitude||113.991244,data.latitude||22.5959];
        },
        computed: {
            id(){
                const {data} = JSON.parse(sessionStorage.getItem('assetObj'));
                return data.id;
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).projectId;
            },
            editFlag(){
                return JSON.parse(sessionStorage.getItem('assetObj')).editFlag;
            }
        },
        methods: {
            submit() {
                this.$refs.magicForm.validate((valid) => {
                    if (valid) {
                        if(!this.editFlag){
                            this.create({
                                ...this.form,
                                projectId:this.projectId,
                                longitude:this.position[0],
                                latitude:this.position[1]
                            })
                        }else{
                            this.edit({
                                ...this.form,
                                longitude:this.position[0],
                                latitude:this.position[1]
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            getPostion(lng,lat){
                this.position =[lng,lat];
            }
        },
    }
</script>

<style lang="scss">
    @import '@/styles/form.scss';
    .CREATE_EDIT{
        width: 100%;
        display: flex;
        justify-content: center;
        .el-form{
            max-height: calc(100vh - 170px);
        }
    }
</style>