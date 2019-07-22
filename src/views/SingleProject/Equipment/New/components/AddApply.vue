<template>
    <div class="CREATE_EDIT_EQUIP">
        <el-form 
            label-position="top" 
            label-width="100px" 
            :model="form" 
            :rules="rules" 
            ref="magicForm"
        >
            <el-form-item label="技术选型" prop="pattern">
                <el-select v-model="form.pattern">
                    <el-option label="LoRa" value="0"></el-option>
                    <el-option label="NB-IOT" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备ID" prop="id">
                <el-input v-model="form.id" placeholder="请输入设备ID"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备编号" prop="deviceNo">
                <el-input v-model="form.deviceNo" placeholder="请输入设备编号"></el-input>
            </el-form-item>
            <el-form-item :label="`设备EUI(请填写${form.pattern==0?16:15}位设备EUI)`" prop="deviceEUI">
                <el-input 
                    v-model="form.deviceEUI" 
                    :placeholder="form.pattern==0?'0000000000000000':'000000000000000'" 
                    :maxlength="form.pattern==0?16:15"
                />
            </el-form-item>

            <!--设备所属资产类型,分为井盖及台区-->
            <template v-if="type !=6">
                <el-form-item label="所属资产类型">
                    <el-select v-model="form.assetType">
                        <el-option label="井盖" value="0"></el-option>
                        <el-option label="台区" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="form.assetType==0">
                    <el-form-item label="所属井盖" prop="trapId">
                        <el-select v-model="form.trapId">
                            <el-option label="井盖一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属线缆" prop="lineId">
                        <el-select v-model="form.lineId">
                            <el-option label="线缆一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="所属台区" prop="courtsId">
                        <el-select v-model="form.courtsId">
                            <el-option label="台区一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属配电房" prop="roomId">
                        <el-select v-model="form.roomId">
                            <el-option label="配电房一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属配电柜" prop="chestId">
                        <el-select v-model="form.chestId">
                            <el-option label="配电柜一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </template>

            <!--魔戒只能绑定在配电柜-->
            <template v-else>
                    <el-form-item label="所属台区" prop="courtsId">
                        <el-select v-model="form.courtsId">
                            <el-option label="台区一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属配电房" prop="roomId">
                        <el-select v-model="form.roomId">
                            <el-option label="配电房一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属配电柜" prop="chestId">
                        <el-select v-model="form.chestId">
                            <el-option label="配电柜一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            
            
            <!--是否为独立传感器(独立,自身上传数据;非独立,通过集中器或者魔节上传),非独立需选择所属魔节或集中器-->
            <template v-if="type==2||type==3||type==4">
                <el-form-item label="是否为独立传感器(是否自身上传数据)">
                    <el-select v-model="form.Independent.flag">
                        <el-option label="是" value="0"></el-option>
                        <el-option label="否" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属传感设备" v-if="form.Independent.flag==1">
                    <el-select v-model="form.Independent.type">
                        <el-option label="魔节" value="0"></el-option>
                        <el-option label="集中器" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属魔节" 
                    prop="magicId" 
                    v-if="form.Independent.flag==1&&form.Independent.type==0"
                >
                    <el-select v-model="form.magicId">
                        <el-option label="魔节一" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属集中器" 
                    prop="centerId" 
                    v-else-if="form.Independent.flag==1&&form.Independent.type==1"
                >
                    <el-select v-model="form.centerId">
                        <el-option label="集中器一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            
            <!--线缆温度传感器需选择所属魔节-->
            <template v-if="type===1">
                <el-form-item label="所属魔节" prop="magicId">
                    <el-select v-model="form.magicId">
                        <el-option label="魔节一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <!--魔戒需选择所属集中器-->
            <template v-if="type===6">
                <el-form-item label="所属集中器" prop="centerId">
                    <el-select v-model="form.centerId">
                        <el-option label="集中器一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <!--选择省市区,填写详细地址-->
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

            <!--通过地图上点击,获取经纬度位置-->
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
                    {{editFlag?'编辑完成':type===0 || type===5?'下一步':'创建完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'

    export default {
        components: {
            MapSingle
        },
        props: {
            next:Function,
            pre:Function,
        },
        data() {
            var checkEui = (rule, value, callback) => {
                if(!value){
                    return callback(new Error('请输入设备EUI'))
                }
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){
                    return callback(new Error('请输入数字或字母'))
                }
                if (value.length<16) {
                    return callback(new Error('设备EUI长度为16'));
                }
                callback();
            };
            return {
                options:[],
                position:[],
                type:0,//设备类型
                editFlag:false,
                form: {
                    pattern:'0',
                    id:'',
                    name:'',
                    deviceNo:'',
                    deviceEUI:'',
                    assetType:'0',//所属类型
                    //井盖
                    trapId:'',
                    lineId:'',
                    //台区
                    courtsId:'',
                    roomId:'',
                    chestId:'',
                    Independent:{ //是否为独立传感
                        flag:'0',
                        type:'0'
                    },
                    magicId:'',
                    centerId:'',
                    city:[],
                    address:'',
                },
                rules: {
                    pattern: [{ required: true, trigger: 'blur' }],
                    id: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    deviceNo: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                    deviceEUI: [{ required: true, validator: checkEui, trigger: 'blur' }],
                    trapId: [{ required: true, message: '请选择设备所属井盖', trigger: 'change' }],
                    roomId: [{ required: true, message: '请选择设备所属配电房', trigger: 'change' }],
                    lineId: [{ required: true, message: '请选择设备所属线缆', trigger: 'change' }],
                    courtsId: [{ required: true, message: '请选择设备所属台区', trigger: 'change' }],
                    chestId: [{ required: true, message: '请选择设备所属配电柜', trigger: 'change' }],
                    magicId: [{ required: true, message: '请选择设备所属魔节', trigger: 'change' }],
                    centerId: [{ required: true, message: '请选择设备所属集中器', trigger: 'change' }],
                }
            }
        },
        created () {
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            const appType = sessionStorage.getItem('appType');
            this.type = +appType;
            this.form={
                ...this.form,
                ...data
            };
            this.editFlag = editFlag;
            this.position = [data.longitude||113.991244,data.latitude||22.5959];
        },
        mounted () {
            const areaTree = JSON.parse(sessionStorage.getItem('areaTree'));
            this.options = areaTree;
            // if(this.editFlag){
            //     $('.el-form').css({maxHeight:'calc(100vh - 170px)'})
            // }
        },
        methods: {
            submit() {
                this.$refs.magicForm.validate((valid) => {
                    if (valid) {
                        const location = `${this.form.city.join(',')},${this.form.location}`
                        const data ={
                            ...this.form,
                            location,
                            longitude:this.position[0],
                            latitude:this.position[1]
                        }
                        //添加 & 编辑
                        // this.type===0||this.type===5 进入激活页面
                        if(this.type===0 || this.type ===5){
                            this.next()
                        }else{
                            this.$router.push({name:'EquList'})
                        }
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
        .el-form{
            width:1100px;
            max-width: 100%;
            // max-height: calc(100vh - 250px);
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
