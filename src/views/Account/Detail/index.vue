<template>
    <div class="account_detail">
        <div class="wrap">
            <div class="avatar_warpper">
                <my-upload 
                    ref="uploader"
                    field="file"
                    @crop-upload-success="cropUploadSuccess"
                    @crop-upload-fail="cropUploadFail"
                    @src-file-set="srcFileSet"
                    v-model="show"
                    :width="150"
                    :height="150"
                    :url="api"
                    :headers="{'jtoken':token}"
                    img-format="jpg"
                />
                <img 
                    class="avatar"
                    :src="imageUrl" 
                    @click="toggleShow"
                >
            </div>
            <div>
                <el-form 
                    label-position="left"
                    label-width="100px" 
                    :model="form" 
                    :rules="rules" 
                    hide-required-asterisk
                    ref="Form"
                >
                    <el-form-item 
                        v-for="(i,index) in options" 
                        :key="i.sign"
                        :label="i.title"
                        :prop="i.sign"
                    >   
                        <div class="value" v-if="index !== value">
                            {{i.value}}
                            <i class="el-icon-edit" @click="switchState(index)" v-if="index"></i>
                        </div>
                        <el-input v-model="form[i.sign]" v-else>
                            <i
                                class="el-icon-close"
                                slot="suffix"
                                @click="switchState(null)">
                            </i>
                            <i
                                class="el-icon-check"
                                slot="suffix"
                                @click="handleOk">
                            </i>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions,mapState } from 'vuex'
    import avatar from '@images/default.jpg'
    import {judgeObject} from '@/utils/methods'
    import myUpload from 'vue-image-crop-upload';

    export default {
        components: {
			'my-upload': myUpload
		},
        data() {
            const checkPhone = (rule,value,callback) =>{
                const myreg=/^[1][34578][0-9]{9}$/;  
                if (!myreg.test(value)) {  
                    callback(new Error('请输入正确的手机号码'));
                }
                callback();
            }
            const checkEmail = (rule,value,callback) =>{
                const myreg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  
                if (!myreg.test(value)) {  
                    callback(new Error('请输入正确的邮箱'));
                }
                callback();
            }
            return {
                show: false,
                imageUrl: '',
                options:[
                    {title:'账号',value:'',sign:'name'},
                    {title:'用户名',value:'',sign:'userName'},
                    {title:'手机号码',value:'',sign:'phoneNum'},
                    {title:'邮箱',value:'',sign:'email'},
                    {title:'详情',value:'',sign:'description'},
                ],
                value:null,
                form:{},
                rules: {
                    userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
                    phoneNum: [{  validator: checkPhone, trigger: 'blur' }],
                    email: [{  validator: checkEmail, trigger: 'blur' }],
                }
            };
        },
        created () {
            this.getAccount()
        },
        computed: {
            ...mapState('user',[
                'userDetail',
            ]),
            api(){
                return this.$api.uploadAvatar;
            },
            token(){
                return this.$store.state.user.token
            }
        },
        watch: {
            show(newVal) {
                if(!newVal){
                    this.$refs.uploader.setStep(1);
                }
            }
        },
        methods: {
            ...mapActions('user',[
                'updateAvatar',
                'getAccountDetail',
                'updateAccount'
            ]),
            //获取用户信息
            getAccount(data){
                const userDetail = data || this.userDetail;
                this.imageUrl = userDetail.imagePath || avatar;
                this.form = userDetail;
                this.options.reduce((pre,current)=>{
                    for(let i in userDetail){
                        if(current.sign === i){ 
                            current.value = userDetail[i] || "xxx"; 
                        }
                    }
                    return {...pre,current}
                },{})
            },
            //切换状态
            switchState(index){
                this.$refs.Form&&this.$refs.Form.clearValidate();
                this.value = index;
                this.form = this.userDetail;
            },
            //编辑完成
            handleOk(){
                this.$refs.Form.validate((valid)=>{
                    if(valid){
                        this.value = null;
                        if(judgeObject(this.userDetail,this.form))return;
                        this.updateAccount(this.form).then(res=>{
                            if(!res)return;
                            this.getAccountDetail(this.userDetail.id).then(res=>{
                                if(!res)return;
                                this.getAccount(res);
                            })
                        });
                    }else{
                        return false
                    }
                })
            },
            /**
             * 图片上传开关
             */
            toggleShow() {
                this.show = !this.show;
            },
            srcFileSet(fileName, fileType, fileSize){
                // const isJPG = fileType === 'image/jpeg';
                const isLt2M = fileSize / 1024 / 1024 < 2;
                // if (!isJPG) {
                //     this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    this.$refs.uploader.off();
                }
            },
			/**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
                const {id,imageId} = this.userDetail;
                this.updateAvatar({
                    id:imageId,
                    accountId:id,
                    name:'xxx',
                    imagePath:jsonData.data
                }).then(result=>{
                    if(!result)return;
                    this.imageUrl = jsonData.data; 
                    this.getAccountDetail(id)
                })
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			}
        },
    }
</script>

<style lang="scss">
    .account_detail{
        padding-top: 50px;
        width: 100%;
        display: flex;
        justify-content: center;
        .wrap{
            width:400px;
            max-width: 100%;
            padding: 15px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .avatar_warpper{
                @include center();
                margin: 20px 0;
                .avatar {
                    box-sizing: border-box;
                    width: 120px;
                    height: 120px;
                    display: block;
                    cursor: pointer;
                    border-radius: 10px;
                    padding: 2px;
                    &:hover{
                        border: 1px dashed #22a8ed;
                    }
                }
            }
            .el-form-item{
                height: 40px;
                .el-form-item__label{
                    font-weight: bold;
                    color: #000000;
                    font-size: 0.8rem;
                    padding-left: 5px;
                }
                .el-icon-check,.el-icon-close,.el-icon-edit{
                    font-size: 0.8rem;
                    color: #000000;
                    font-weight: bold;
                    cursor: pointer;
                }
                .el-icon-close{
                    padding-right: 5px;
                }
                .value{
                    font-size: 0.8rem;
                    background: #d6dcdf;
                    padding-left:20px;
                    position: relative;
                    &:hover{
                        .el-icon-edit{
                            display: block;
                        }
                    }
                    .el-icon-edit{
                        display: none;
                        position: absolute;
                        right: 5px;
                        top: 12px;
                    }
                }
            }
        }
    }
</style>