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
            rules:{}
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
                const {id} = this.project;
                this.deviceName = names[+this.deviceType];
                params = { setId:id, setType:1, deviceType:this.deviceType };
            }else{
                const {id,deviceType,name} = this.device;
                this.deviceName = name;
                params = { setId:id, setType:0, deviceType };
            }
            this.getDeviceThreshold(params).then(res=>{
                if(res){
                    const {id,payload} = res;
                    this.thForm={
                        ...this.thForm,
                        ...JSON.parse(payload)
                    };
                    this.id = id;
                }
            })
        },
        //提交
        submitForm() {
            this.$refs.thForm.validate((valid) => {
                if (valid) {
                    //4.30
                    let payload = {};
                    for(let item in this.thForm){
                        if(this.thForm[item]){
                            payload[item] = this.thForm[item];
                        }
                    }
                    if( !Object.keys(payload).length ){
                        this.$message.warning('至少填写一项 !!')
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
                            if(res) this.id = res.id;
                            // this.$router.push({name:'EquList'});
                        })
                        return;
                    }
                    //修改
                    this.updateThresholdSet({
                        ...params,
                        id:this.id,
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
                this.$message({
                    message: '重置成功!',
                    type: 'success'
                });
                this.id = null;
                this.$refs.thForm.resetFields();
            })
        }
    }
}