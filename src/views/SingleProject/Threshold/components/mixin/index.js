import { mapActions } from 'vuex'

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
        project() {
            return JSON.parse(sessionStorage.getItem('project'))
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
            const {id} = this.project;
            this.getDeviceThreshold({setId:id,setType:1,deviceType:this.deviceType}).then(res=>{
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
                    const {id} = this.project
                    //新增
                    if(!this.id){
                        this.addThresholdSet({
                            setId:id,         
                            setType:1,
                            deviceType:this.deviceType,       
                            payload:JSON.stringify(this.thForm),        
                            description:''  
                        }).then(res=>{
                            if(res) this.id = res.id;
                        })
                        return;
                    }
                    //修改
                    this.updateThresholdSet({
                        id:this.id,
                        setId:id,         
                        setType:1,   
                        deviceType:this.deviceType,    
                        payload:JSON.stringify(this.thForm),        
                        description:''   
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