<template>
    <div class="CREATE_EDIT_ASSET">
        <el-form 
            label-position="top" 
            label-width="100px" 
            :model="form" 
            :rules="rules" 
            ref="assetForm"
        >
            <el-form-item label="资产名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入资产名称"></el-input>
            </el-form-item>
            <el-form-item label="资产编号" prop="number">
                <el-input v-model="form.number" placeholder="请输入资产编号" :disabled="editFlag"></el-input>
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
                <el-cascader 
                    :options="options" 
                    v-model="form.city"  
                    placeholder="省/市/区"
                    :props="{
                        children:'childList',
                        value:'name',
                        label:'name'
                    }"
                />
                <el-input v-model="form.location" placeholder="请输入设备位置信息"></el-input>
            </el-form-item>

            <template v-if="hasMap">
                <el-form-item label="资产经纬度" class="map">
                    <cc-mapSingle 
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
    export default {
        name:'cc-equipEdit',
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
            const checkNumber = (rule, value, callback) => {
                if(this.editFlag)return callback();
                const id = this.form.id || null
                const obj ={id,num:value,type:this.type}
                if (!value) {
                    return callback(new Error('请输入资产编号'));
                }
                this.$store.dispatch('asset/checkNo', obj).then(res=>{
                    if(!res){
                        return callback(new Error('资产编号已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                options:[],
                position:[],
                rules:{
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, validator: checkNumber, trigger: 'blur' }],
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
        mounted () {
            const areaTree = JSON.parse(sessionStorage.getItem('areaTree'));
            this.options = areaTree
        },
        computed: {
            id(){
                const {data} = JSON.parse(sessionStorage.getItem('assetObj'));
                return data.id;
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
            editFlag(){
                return JSON.parse(sessionStorage.getItem('assetObj')).editFlag;
            }
        },
        methods: {
            submit() {
                this.$refs.assetForm.validate((valid) => {
                    if (valid) {
                        const location = `${this.form.city.join(',')},${this.form.location}`
                        const data ={
                            ...this.form,
                            location,
                            longitude:this.position[0],
                            latitude:this.position[1]
                        }
                        if(!this.editFlag){
                            this.create({
                                ...data,
                                projectId:this.projectId
                            })
                        }else{
                            this.edit(data)
                        }
                    } else {
                        this.$message({
                            message: '请正确填写表单信息!',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            //获取经纬度
            getPostion(lng,lat){
                this.position =[lng,lat];
            }
        },
    }
</script>

<style lang="scss">
    .CREATE_EDIT_ASSET{
        width: 100%;
        display: flex;
        justify-content: center;
        .el-form{
            width:1100px;
            max-width: 100%;
            overflow: scroll;
            padding: 15px;
            margin-bottom: 5px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .el-input__inner{
                border-radius: 0px;
                height: 35px;
                line-height: 35px;
            }
            .el-select,.el-cascader{
                width: 100%;
            }
            .address{
                .el-form-item__content{
                    display: flex;
                    .el-cascader{
                        width: 300px;
                        padding-right: 10px;
                    }
                }
            }
            .submit{
                padding-top: 10px;
                text-align: center;
            }
        }
    }
</style>