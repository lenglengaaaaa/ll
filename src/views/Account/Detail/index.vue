<template>
    <div class="account_detail">
        <div class="wrap">
            <div class="avatar">
                <el-upload
                    class="avatar-uploader"
                    :action="api"
                    :headers="{'jtoken':token}"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
    import { mapActions } from 'vuex'
    import avatar from '@/assets/images/default.jpg'
    import {judgeObject} from '@/utils/methods'

    export default {
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
            userDetail() {
                return JSON.parse(sessionStorage.getItem('userDetail'));
            },
            api(){
                return this.$api.uploadAvatar;
            },
            token(){
                return this.$store.state.user.token
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
                const userDetail =data || this.userDetail;
                this.imageUrl = userDetail.imagePath || avatar;
                this.form = userDetail;
                this.options.reduce((pre,current)=>{
                    for(let i in userDetail){
                        if(current.sign === i){ current.value = userDetail[i]; }
                    }
                    return {...pre,current}
                },{})
            },
            //切换状态
            switchState(index){
                const defaultValue = JSON.parse(sessionStorage.getItem('userDetail'));
                this.$refs.Form&&this.$refs.Form.clearValidate();
                this.value = index;
                this.form = defaultValue;
            },
            //编辑完成
            handleOk(){
                const defaultValue = JSON.parse(sessionStorage.getItem('userDetail'));
                this.$refs.Form.validate((valid)=>{
                    if(valid){
                        this.value = null;
                        if(judgeObject(defaultValue,this.form))return;
                        this.updateAccount(this.form).then(res=>{
                            if(!res)return;
                            this.getAccountDetail(defaultValue.id).then(res=>{
                                if(!res)return;
                                this.getAccount(res);
                            })
                        });
                    }else{
                        return false
                    }
                })
            },
            //上传成功后回调
            handleAvatarSuccess(res, file) {
                const {id,imageId} = this.userDetail;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.updateAvatar({
                    id:imageId,
                    accountId:id,
                    name:'xxx',
                    imagePath:res.data
                }).then(result=>{
                    if(!result)return;
                    this.imageUrl = res.data; 
                    this.getAccountDetail(id)
                })
            },
            //上传前回调
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
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
            .avatar{
                text-align: center;
                padding: 20px 0;
                .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .avatar-uploader .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    border-radius: 50%;
                    font-size: 1.75rem;
                    color: #8c939d;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    display: block;
                    padding: 0;
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