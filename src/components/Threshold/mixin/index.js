import { mapActions } from 'vuex'

export default {
    data() {
        return {
            id:null,
            deviceName:'',
            deviceType:0,
            rules:{}
        }
    },
    computed: {
        device() {
            return JSON.parse(sessionStorage.getItem('equipObj')).data
        }
    },
    created () {
        //30:魔节 , 36:魔戒
        const {id,deviceType,name} = this.device;
        this.deviceName = name;
        this.deviceType = deviceType;
        this.getDeviceThreshold({setId:id,setType:0,deviceType}).then(res=>{
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
    methods: {
        ...mapActions('overall',[
            'getDeviceThreshold',
            'addThresholdSet',
            'updateThresholdSet',
            'deleteThresholdSet'
        ]),
        // //重置为默认值
        // resetDeafault(){
        // },
        submitForm() {
            this.$refs.thForm.validate((valid) => {
                if (valid) {
                    const {id,deviceType,deviceAddress,deviceEui,commWay} = this.device
                    //新增
                    if(!this.id){
                        this.addThresholdSet({
                            setId:id,         
                            setType:0,       
                            deviceType,    
                            deviceAddress,  
                            deviceEui,      
                            commWay,       
                            payload:JSON.stringify(this.thForm),        
                            description:''   
                        }).then(res=>{
                            if(!res)return;
                            this.$router.push({name:'EquList'});
                        })
                        return;
                    }
                    //修改
                    this.updateThresholdSet({
                        id:this.id,
                        setId:id,         
                        setType:0,       
                        deviceType,    
                        deviceAddress,  
                        deviceEui,      
                        commWay,       
                        payload:JSON.stringify(this.thForm),        
                        description:''   
                    }).then(res=>{
                        if(!res)return;
                        this.$router.push({name:'EquList'});
                    })
                } else {
                    return false;
                }
            });
        },
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