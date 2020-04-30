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
            <el-form-item label="设备图片">
                <el-upload
                    :class="{hide:hideUpload}"
                    action="http://47.92.235.125:8888/e_view/file/upload/image"
                    :headers="{'jtoken':token}"
                    list-type="picture-card"
                    :limit="limitCount"
                    :file-list="fileList"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-error="handleError"
                    multiple
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="通讯技术">
                <el-select v-model="form.commWay" :disabled="editFlag">
                    <el-option label="NB-IOT" :value="0"></el-option>
                    <el-option label="LoRa" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备资产编号" prop="number">
                <el-input v-model="form.number" placeholder="请输入设备资产编号"></el-input>
            </el-form-item>
            <el-form-item label="设备地址域" prop="deviceAdress">
                <el-input
                    v-model="form.deviceAdress" 
                    placeholder="请输入设备地址域"
                    :disabled="editFlag"
                ></el-input>
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
                <cc-mapSingle 
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
                    {{btnMsg}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name:'cc-equipForm',
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
                if(this.editFlag)return callback();
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
            //验证资产编号
            const checkAddress = (rule, value, callback) => {
                if (!value) { return callback(new Error('请输入设备地址域')) };
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){ return callback(new Error('请输入数字或字母')) };
                if(this.editFlag)return callback();
                this.checkAddress(value).then(res=>{
                    if(!res){
                        return callback(new Error('设备地址域已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                options:[],
                position:[113.991244,22.5959],
                editFlag:false,
                hideUpload: false,
                limitCount:3,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList:[],
                imageUrls:[],
                rules: {
                    pattern: [{ required: true, trigger: 'blur' }],
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, validator: checkNumber, trigger: 'blur' }],
                    deviceAdress: [{ required: true, validator: checkAddress, trigger: 'blur' }],
                    deviceEui: [{ required: true, validator: checkEui, trigger: 'blur' }],
                    gatewayId:[{ required: true, message: '请选择设备所属网关', trigger: 'change' }],
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
                    isBinding :[{ required: true, trigger: 'change' }],
                }
            }
        },
        created () {
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            const imgUrls = data.imageUrls&&data.imageUrls.length&&data.imageUrls.map(item=>{ 
                return { ...item,url:item.imagePath } 
            }) || [];
            this.editFlag = editFlag;
            this.position = [data.longitude||113.991244,data.latitude||22.5959];
            this.fileList = imgUrls;
            this.imageUrls = imgUrls.map(item=>{return {...item,imagePath:item.url}});
            this.hideUpload = this.imageUrls.length >= this.limitCount;
        },
        mounted () {
            const areaTree = JSON.parse(sessionStorage.getItem('areaTree'));
            this.options = areaTree;
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
            token(){
                return this.$store.state.user.token;
            },
            btnMsg(){
                const deviceType = sessionStorage.getItem('appType');
                if(this.editFlag)return '编辑完成';
                //创建类型为魔戒(36)
                if(deviceType==36){
                    //独立&LoRa
                    if(!this.form.isSingle && this.form.commWay){
                        return '下一步';
                    }
                }else{
                    if(this.form.commWay) return '下一步'
                }
                return '创建完成'
            },
            isActivate(){
                const deviceType = sessionStorage.getItem('appType');
                if(this.editFlag)return false;
                //创建类型为魔戒(36)
                if(deviceType==36){
                    //独立&LoRa
                    if(!this.form.isSingle && this.form.commWay){
                        return true;
                    }
                }else{
                    if(this.form.commWay) return true
                }
                return false
            }
        },
        methods: {
            ...mapActions('asset',[
                'checkNo',
            ]),
            ...mapActions('equip',[
                'checkEUI',
                'checkAddress',
                'createEquip',
                'updateEquip',
                'updateConcentratorBindinig'
            ]),
            submit() {
                this.$refs.equipForm.validate((valid) => {
                    if (valid) {
                        const location = `${this.form.city.join(',')},${this.form.location}`
                        const deviceType = +sessionStorage.getItem('appType');
                        const data ={
                            projectId:this.projectId,
                            ...this.form,
                            imageUrls:this.imageUrls,
                            deviceType,
                            location,
                            longitude:this.position[0],
                            latitude:this.position[1]
                        }
                        //创建集中器时 添加is_single
                        if(deviceType == 33) data.is_single = 0;

                        if(!this.editFlag){
                            this.createEquip(data).then(res=>{
                                if(!res)return;
                                if(this.isActivate){
                                    this.next();
                                    sessionStorage.setItem('equipObj',JSON.stringify({data}));
                                    return;
                                }
                                const { isBinding, deviceAddress } = this.form;
                                isBinding && isBinding === 1 && this.updateConcentratorBindinig(deviceAddress);
                                this.$router.push({name:'EquList'});
                            })
                        }else{
                            this.updateEquip(data).then(res=>{
                                if(!res)return;
                                this.$router.push({name:'EquList'});
                            })
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
            //文件上传成功回调
            handleSuccess(res, file,fileList) {
                this.imageUrls = [
                    ...this.imageUrls,
                    { imagePath:res.data }
                ]
                this.hideUpload = fileList.length >= this.limitCount;
            },
            //文件上传失败时的钩子
            handleError(err, file, fileList){  
                this.hideUpload = fileList.length >= this.limitCount;
            },
            //上传文件之前的钩子
            beforeUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 10240 < 10;
                // if (!isJPG) {
                //     this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message.error('上传设备图片大小不能超过 10MB!');
                }
                return isJPG && isLt2M;
            },
            //删除图片回调
            handleRemove(file, fileList) {
                let url = this.editFlag ? file.imagePath:file.response.data;
                this.imageUrls = this.imageUrls.reduce((pre,current)=>{
                    if(current.imagePath !== url){
                        pre.push(current);
                    }
                    return pre
                },[])
                this.hideUpload = fileList.length >= this.limitCount;
            },
            //点击文件列表中已上传的文件时的钩子
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //获取经纬度
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
        max-width: 100%;
        .el-form{
            width:1100px;
            max-width: 100%;
            overflow: auto;
            padding: 15px;
            margin-bottom: 5px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .hide .el-upload--picture-card {
                display: none;
            }
            .el-dialog{
                .el-dialog__body{
                    text-align: center;
                    padding: 15px 0px;
                    img{
                        width: 100%;
                    }
                }
            }
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
