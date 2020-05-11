import { mapActions } from 'vuex'

const names = {
    30:'电缆监测终端(魔节）',
    38:'线缆温度传感器',
    32:'红外传感器',
    35:'烟雾传感器',
    37:'水浸传感器',
    36:'低压传感器(魔戒)'
}

export default {
    props: {
        deviceType: Number
    },
    data() {
        return {
            id:null,
            deviceName:'',
            rules:{},
            defaultValue:{
                36:{
                    lineTemp:70,
                    lineA:650,
                    lineV:15,
                    batteryA:2.8,
                    CBTemp:70,
                    samplingPeriod:1,
                    reportedPeriod:5
                }
            }
        }
    },
    computed: {
        device() {
            return JSON.parse(sessionStorage.getItem('equipObj')).data
        },
        project() {
            return JSON.parse(sessionStorage.getItem('project'))
        },
        path(){
            return this.$route.path
        }
    },
    created () {
        this.getSetting();
    },
    methods: {
        ...mapActions('overall',[
            'getDeviceThreshold',
            'addThresholdSet',
            'updateThresholdSet',
            'deleteThresholdSet'
        ]),
        //获取阈值设置
        getSetting(){
            let params;
            if(this.path==='/project/threshold'){
                const { id } = this.project;
                this.deviceName = names[+this.deviceType];
                params = { setId:id, setType:1, deviceType:this.deviceType };
            }else{
                const { id, deviceType, name } = this.device;
                this.deviceName = name;
                params = { setId:id, setType:0, deviceType };
            }
            this.getDeviceThreshold(params).then(res=>{
                if(res){
                    const { id, payload } = res;
                    this.thForm={
                        ...this.thForm,
                        ...JSON.parse(payload)
                    };
                    this.defaultValue[params.deviceType] ={
                        ...this.defaultValue[params.deviceType],
                        ...JSON.parse(payload)
                    }
                    this.id = id;
                }
            })
        },
        //提交
        submitForm() {
            this.$refs.thForm.validate((valid) => {
                if (valid) {
                    //5.11
                    //可只单独修改一项限值
                    const equipType = this.deviceType || this.device.deviceType; //设备类型

                    let payload = {};
                    for(let i in this.thForm){
                        if( this.thForm[i] != this.defaultValue[equipType][i] ){
                            payload[i] = this.thForm[i];
                        }
                    }
                    if( !Object.keys(payload).length ){
                        this.$message.warning('至少修改一项 !!')
                        return;
                    }
                    let params ={
                        payload:JSON.stringify(payload)        
                    };

                    if(this.path==='/project/threshold'){
                        //全局阈值设置
                        const {id} = this.project
                        params = {
                            ...params,
                            setId:id,         
                            setType:1,
                            deviceType:this.deviceType,
                        }
                    }else{
                        //单个设备阈值设置
                        const { id, deviceType, deviceAdress, deviceEui, commWay } = this.device;
                        params = {
                            ...params,
                            setId:id,         
                            setType:0,       
                            deviceType,    
                            deviceAddress:deviceAdress,  
                            deviceEui,      
                            commWay,       
                        }
                    }
                    //新增
                    if(!this.id){
                        this.addThresholdSet(params).then(res=>{
                            if(!res) return; 
                            this.id = res.id;
                            this.resetDefaultValue(payload);
                            // this.$router.push({name:'EquList'});
                        })
                        return;
                    }
                    this.updateThresholdSet({
                        ...params,
                        id:this.id,
                    }).then(res=>{
                        if(!res) return;
                        this.resetDefaultValue(res);
                    })
                } else {
                    return false;
                }
            });
        },
        //重置
        resetForm() {
            if(!this.id){
                this.$message({
                    message: '已为设备默认阈值设置,无需重置!',
                    type: 'warning'
                });
                return;
            }
            this.deleteThresholdSet({
                id:this.id
            }).then(res=>{
                if(!res)return;

                this.id = null;
                this.$refs.thForm.resetFields();
                
                this.resetDefaultValue(res);
                
            })
        },
        //根据返回值修改defaultValue
        resetDefaultValue(data){
            const equipType = this.deviceType || this.device.deviceType;
            delete data.deviceAddress;

            this.defaultValue[equipType] = {
                ...this.defaultValue[equipType],
                ...data
            };
        }
    }
}