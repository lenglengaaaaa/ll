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
            <!-- <el-form-item label="装置图片">
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
            </el-form-item> -->
            <el-form-item label="通讯技术">
                <el-select v-model="form.communicationTechnology" :disabled="editFlag">
                    <el-option label="NB-IOT" :value="1"></el-option>
                    <!-- <el-option label="LoRa" :value="2"></el-option> -->
                    <!-- <el-option label="4G" :value="3"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item label="装置名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入装置名称"></el-input>
            </el-form-item>
            <el-form-item label="装置编号(请填写12位装置编号)" prop="assetsCode">
                <el-input 
                    v-model="form.assetsCode" 
                    placeholder="请输入装置编号" 
                    :disabled="editFlag"
                    :maxlength="12"
                />
            </el-form-item>

            <!-- 插槽 -->
            <slot></slot>

            <!--选择省市区,填写详细地址(必备) √-->
            <el-form-item label="位置信息" prop="positionInformation">
                <el-input v-model="form.positionInformation" placeholder="请填写装置安装位置"></el-input>
            </el-form-item>

            <!--通过地图上点击,获取经纬度位置(必备) √-->
            <template v-if="equipType == 40">
                <el-form-item label="装置经纬度" class="map">
                    <cc-mapSingle 
                        vid="newEquip"
                        :position="position"
                        :get="getPostion"
                    />
                </el-form-item>
            </template>
            
            <el-alert
                v-if="equipType == 36 || equipType == 41"
                title="提示"
                type="warning"
                description='创建完所有节点后, 可手动下发集中器绑定关系( 装置管理模块, 右上角 "其他功能-修改集中器绑定关系" )'
                show-icon
                effect="dark"
                :closable="false"
            />

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

    const mapCenter = window.$cfg.mapCenter;

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
                    return callback(new Error('请输入装置EUI'))
                }
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){
                    return callback(new Error('请输入数字或字母'))
                }
                if (value.length<(!this.form.commWay?15:16)) {
                    return callback(new Error(`装置EUI长度为${!this.form.commWay?'15':'16'}位`));
                }
                if(this.editFlag)return callback();
                
                const obj ={ deviceType:+sessionStorage.getItem('appType'), eui:value, assetsCode:"" };
                this.checkoutDeviceNumOrEui(obj).then(res=>{
                    if(!res){
                        return callback(new Error('装置EUI已存在'));
                    }else{
                        callback()
                    }
                });
            };
            //验证资产编号
            const checkNumber = (rule, value, callback) => {
                const obj ={ deviceType:+sessionStorage.getItem('appType'), assetsCode:value, eui: "" };
                if (!value) {
                    return callback(new Error('请输入装置资产编号'));
                }
                if (value.length < 12) {
                    return callback(new Error(`装置编号长度为12位`));
                }
                
                if(this.editFlag)return callback();

                this.checkoutDeviceNumOrEui(obj).then(res=>{
                    if(!res){
                        return callback(new Error('装置编号已存在'));
                    }else{
                        callback()
                    }
                });
            };
            //验证资产编号
            const checkAddress = (rule, value, callback) => {
                if(this.editFlag)return callback();

                if (!value) { return callback(new Error('请输入装置地址域')) };

                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){ return callback(new Error('请输入数字或字母')) };

                if(`${value}`.length !== 12){ return callback(new Error('装置ID长度为12位'))};

                this.checkAddress(value).then(res=>{
                    if(!res){
                        return callback(new Error('装置地址域已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                position: mapCenter,
                editFlag:false,
                hideUpload: false,
                limitCount:3,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList:[],
                imageUrls:[],
                rules: {
                    pattern: [{ required: true, trigger: 'blur' }],
                    name: [{ required: true, message: '请输入装置名称', trigger: 'blur' }],
                    assetsCode: [{ required: true, validator: checkNumber, trigger: 'blur' }],
                    voltageConcentratorEui: [{ required: true, validator: checkEui, trigger: 'blur' }],
                    eui: [{ required: true, validator: checkEui, trigger: 'blur' }],
                    // gatewayId:[{ required: true, message: '请选择装置所属网关', trigger: 'change' }],
                    cabinetId: [{ required: true, message: '请选择所属魔节', trigger: 'change' }],
                    distributionRoomId: [{ required: true, message: '请选择所属配电房', trigger: 'change' }],
                    transformerOrTrap: [{ required: true, message: '请选择所属电缆井', trigger: 'change' }],
                    roomId: [{ required: true, message: '请选择所属主线缆', trigger: 'change' }],
                    lineId: [{ required: true, message: '请选择所属线缆', trigger: 'change' }],
                    cablePass: [{ required: true, message: '请选择所属电缆通道', trigger: 'change' }],
                    transformerId: [{ required: true, message: '请选择装置所属', trigger: 'change' }],
                    distributionCabinetId: [{ required: this.hasChest, message: '请选择所属配电柜', trigger: 'change' }],
                    hostId: [{ required: true, message: '请选择所属魔节', trigger: 'change' }],
                    voltageConcentratorId: [{ required: true, message: '请选择所属集中器', trigger: 'change' }],
                    loopCode: [{ required: true, message: '请选择出线线路', trigger: 'change' }],
                    phaseSequence: [{ required: true, message: '请选择所属相序', trigger: 'change' }],
                    parentId: [{ required: true, message: '请选择附属装置', trigger: 'change' }],
                    // location: [{ required: true, message: '请填写装置安装位置', trigger: 'blur' }],
                    // isBinding :[{ required: true, trigger: 'change' }],
                },
            }
        },
        created () {
            const { data, editFlag } = this.equipObj;

            // 装置图片
            // const imgUrls = data.imageUrls && data.imageUrls.length && data.imageUrls.map(item=>{ 
            //     return { ...item,url:item.imagePath } 
            // }) || [];
            // this.fileList = imgUrls;
            // this.imageUrls = imgUrls.map(item=>{return {...item,imagePath:item.url}});
            // this.hideUpload = this.imageUrls.length >= this.limitCount;

            this.editFlag = editFlag;
            this.position = [ data.longitude || mapCenter[0], data.latitude || mapCenter[1] ];

        },
        computed: {
            equipObj(){
                return JSON.parse(sessionStorage.getItem('equipObj'));
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
            token(){
                return this.$store.state.user.token;
            },
            equipType(){
                const deviceType = sessionStorage.getItem('appType');
                return deviceType;
            },
            btnMsg(){
                const deviceType = sessionStorage.getItem('appType');
                if(this.editFlag)return '编辑完成';
                //创建类型为魔戒(36)
                if(deviceType==36){
                    //独立 or LoRa
                    if(!this.form.isSingle && this.form.commWay) return '下一步';
                }else{
                    if(this.form.commWay) return '下一步' ;
                }
                return '创建完成'
            },
            isActivate(){
                const deviceType = sessionStorage.getItem('appType');
                if(this.editFlag)return false;
                //创建类型为魔戒(36)
                if(deviceType==36){
                    //独立&LoRa
                    if(!this.form.isSingle && this.form.commWay)  return true;
                }else{
                    if(this.form.commWay) return true ;
                }
                return false
            }
        },
        methods: {
            ...mapActions('asset',[
                'checkNo',
            ]),
            ...mapActions('mini',[
                'ringCreate',
                'concentratorCreate',
                'cableTempCreate',
                'independentSensorCreate',
                'magicCreate',
                'cablePileCreate',
                'checkoutDeviceNumOrEui',
                'editDevice'
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
                        const deviceType = +sessionStorage.getItem('appType');
                        const data ={
                            ...this.form,
                            projectId:this.projectId,
                            concentratorLongitude: this.position[0],
                            concentratorLatitude: this.position[1]
                        }

                        deviceType == 36 && ( data.ringName = this.form.name );
                        deviceType == 33 && ( data.voltageConcentratorName = this.form.name );
                        deviceType == 38 && ( data.cableName = this.form.name );
                        deviceType == 40 && ( data.positioningPileName = this.form.name );

                        deviceType == 30 && ( data.magicFestivalName = this.form.name );
                        deviceType == 30 && ( data.address = this.form.assetsCode );


                        // 红外,液位,烟感 sensorType 传感器类型（1、红外；2、液位；3、烟感）
                        deviceType == 32 && ( data.sensorType = 1 );
                        deviceType == 35 && ( data.sensorType = 2 );
                        deviceType == 37 && ( data.sensorType = 3 );

                        let deviceInterface = {
                            36: this.ringCreate,
                            38: this.cableTempCreate,
                            32: this.independentSensorCreate,
                            35: this.independentSensorCreate,
                            37: this.independentSensorCreate,
                            33: this.concentratorCreate,
                            30: this.magicCreate,
                            40: this.cablePileCreate
                        }

                        if(!this.editFlag){
                            deviceInterface[deviceType](data).then(res=>{
                                if(!res) return;
                                this.$router.push({name:'EquList'});
                            })
                        }else{
                            const { 
                                id, type, name, positionInformation, //common
                                cablePass, noticePhoneA, noticePhoneB, noticePhoneC, // 定位桩40
                                transformerOrTrap,
                                transformerId, distributionRoomId,
                                hostId, cabinetId,
                                roomId,
                                voltageConcentratorId,distributionCabinetId,loopCode,phaseSequence,
                                concentratorLongitude, concentratorLatitude
                            } = data;

                            let param = { id, type, name, position: positionInformation || "" };

                            // { type:30, name:"电缆监测终端(魔节)" },
                            // { type:32, name:"红外传感器" },
                            // { type:33, name:"低压集中器" },
                            // { type:35, name:"烟雾传感器" },
                            // { type:36, name:"低压传感器(魔戒)" },
                            // { type:37, name:"液位传感器" },
                            // { type:38, name:"线缆温度传感器" },
                            // { type:40, name:"电缆定位桩" }
                            type == 40 && ( param = {  // 电缆桩
                                ...param,
                                aisleId:cablePass,
                                phoneA:`${noticePhoneA}`,
                                phoneB:`${noticePhoneB}`,
                                phoneC:`${noticePhoneC}`,
                                longitude:concentratorLongitude,
                                latitude:concentratorLatitude
                            });

                            type == 30 && ( param = { ...param, trapId: transformerOrTrap}) // 魔节
                            type == 33 && ( param = { ...param, courtsId: transformerId, roomId: distributionRoomId }) // 集中器
                            if( type == 32 || type == 35 || type == 37 ) param = { ...param, trapId: transformerOrTrap, magicId: hostId};// 红外,烟雾,水位
                            type == 38 && ( param = { ...param, trapId: transformerId, magicId: cabinetId, lineId: roomId}) // 线缆温度传感器
                            type == 36 && (param = { 
                                ...param, 
                                courtsId: transformerId,
                                roomId: distributionRoomId,
                                chestId: distributionCabinetId,
                                loopCode: loopCode,
                                phaseSequence,
                                vcId: voltageConcentratorId
                            }) // 魔戒
                            this.editDevice(param).then(res=>{
                                if(!res)return;
                                this.$router.push({name:'EquList'});
                            })
                        }
                    } else {
                        this.$message({
                            message: '请按要求填写表单信息',
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
                    this.$message.error('上传装置图片大小不能超过 10MB!');
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
            .submit{
                padding-top: 20px;
                text-align: center;
            }
        }
    }
</style>
