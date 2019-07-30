<template>
    <div class="CREATE_EDIT_EQUIP">
        <el-form 
            label-position="top" 
            label-width="100px" 
            :model="form" 
            :rules="rules" 
            ref="equipForm"
        >
            <!-- 必备字段 √ -->
            <el-form-item label="通讯技术">
                <el-select v-model="form.commWay">
                    <el-option label="NB-IOT" :value="0"></el-option>
                    <el-option label="LoRa" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备资产编号" prop="number">
                <el-input v-model="form.number" placeholder="设备资产编号"></el-input>
            </el-form-item>

            <!-- 插槽 -->
            <slot></slot>

            <!--选择省市区,填写详细地址(必备) √-->
            <el-form-item label="位置信息" prop="location" class="address">
                <el-cascader 
                    :options="options" 
                    v-model="form.city"  
                    placeholder="请选择项目所属区域"
                    :props="{
                        children:'childList',
                        value:'name',
                        label:'name'
                    }"
                />
                <el-input v-model="form.location" placeholder="请输入设备位置信息"></el-input>
            </el-form-item>

            <!--通过地图上点击,获取经纬度位置(必备) √-->
            <el-form-item label="设备经纬度" class="map">
                <MapSingle 
                        vid="newEquip"
                        :position="position"
                        :get="getPostion"
                    />
            </el-form-item>

            <el-form-item class="submit">
                <el-button type="danger" @click="pre" v-if="!editFlag">
                    上一步
                </el-button>
                <el-button type="primary" @click="submit" >
                    {{editFlag?'编辑完成':'创建完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'
    import { mapActions } from 'vuex'

    export default {
        components: {
            MapSingle,
        },
        props: {
            form: {
                type: Object,
                default: ()=>{}
            },
            next:Function,
            pre:Function,
            hasChest:{
                type:Boolean,
                default:true
            }
        },
        data() {
            //验证EUI
            const checkEui = (rule, value, callback) => {
                if(!value){
                    return callback(new Error('请输入设备EUI'))
                }
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){
                    return callback(new Error('请输入数字或字母'))
                }
                if (value.length<(!this.form.commWay?15:16)) {
                    return callback(new Error(`设备EUI长度为${!this.form.commWay?'15':'16'}`));
                }
                this.checkEUI(value).then(res=>{
                    if(!res){
                        return callback(new Error('设备EUI已存在'));
                    }else{
                        callback()
                    }
                });
            };
            //验证资产编号
            const checkNumber = (rule, value, callback) => {
                const id = this.form.id || null
                const obj ={id,num:value,type:6}
                if (!value) {
                    return callback(new Error('请输入设备资产编号'));
                }
                this.checkNo(obj).then(res=>{
                    if(!res){
                        return callback(new Error('设备资产编号已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                options:[],
                position:[113.991244,22.5959],
                editFlag:false,
                rules: {
                    pattern: [{ required: true, trigger: 'blur' }],
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, validator: checkNumber, trigger: 'blur' }],
                    deviceEui: [{ required: true, validator: checkEui, trigger: 'blur' }],
                    trapId: [{ required: true, message: '请选择设备所属井盖', trigger: 'change' }],
                    roomId: [{ required: true, message: '请选择设备所属配电房', trigger: 'change' }],
                    lineId: [{ required: true, message: '请选择设备所属线缆', trigger: 'change' }],
                    courtsId: [{ required: true, message: '请选择设备所属台区', trigger: 'change' }],
                    chestId: [{ required: this.hasChest, message: '请选择设备所属配电柜', trigger: 'change' }],
                    magicId: [{ required: true, message: '请选择设备所属魔节', trigger: 'change' }],
                    centerId: [{ required: true, message: '请选择设备所属集中器', trigger: 'change' }],
                    switchId: [{ required: true, message: '请选择出线线路', trigger: 'change' }],
                    outLineId: [{ required: true, message: '请选择所属相序', trigger: 'change' }],
                    parentId: [{ required: true, message: '请选择附属设备', trigger: 'change' }],
                }
            }
        },
        created () {
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            this.editFlag = editFlag;
            this.position = [data.longitude||113.991244,data.latitude||22.5959];
        },
        mounted () {
            const areaTree = JSON.parse(sessionStorage.getItem('areaTree'));
            this.options = areaTree;
        },
        methods: {
            ...mapActions('asset',[
                'checkNo',
            ]),
            ...mapActions('equip',[
                'checkEUI',
                'createEquip'
            ]),
            submit() {
                this.$refs.equipForm.validate((valid) => {
                    if (valid) {
                        const location = `${this.form.city.join(',')},${this.form.location}`
                        const deviceType = +sessionStorage.getItem('appType')
                        const data ={
                            ...this.form,
                            deviceType,
                            location,
                            longitude:this.position[0],
                            latitude:this.position[1]
                        }
                        this.createEquip(data).then(res=>{
                            if(!res)return;
                            this.$router.push({name:'EquList'});
                        })
                        // //添加 & 编辑
                        // // this.type===0||this.type===5 进入激活页面
                        // if(this.type===0 || this.type ===5){
                        //     this.next()
                        // }else{
                        //     this.$router.push({name:'EquList'})
                        // }
                    } else {
                        return false;
                    }
                });
            },
            getPostion(lng,lat){
                this.position =[lng,lat];
            },
        },
    }
</script>

<style lang="scss">
    .CREATE_EDIT_EQUIP{
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
                padding-top: 20px;
                text-align: center;
            }
        }
    }
</style>
