<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item 
                :label="`装置EUI(请填写${form.communicationTechnology==1? 15: 16}位装置EUI)`" 
                prop="eui"
            >
                <el-input 
                    v-model="form.eui" 
                    :placeholder="form.communicationTechnology==1? '000000000000000': '0000000000000000'" 
                    :maxlength="form.communicationTechnology==1? 15: 16"
                    :disabled="editFlag"
                />
            </el-form-item>
            <el-form-item label="所属电缆通道" prop="cablePass">
                <el-select v-model="form.cablePass">
                    <el-option 
                        v-for="item in channelMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <!-- 1.新增电话号码短信通知 -->
            <div class="phoneItems">
                <el-form-item
                    label="通知号码(1)"
                    prop="noticePhoneA"
                    :rules="{
                        validator: checkPhoneNumber, trigger: 'blur'
                    }"
                >
                    <el-input 
                        v-model.number="form.noticePhoneA"
                        :maxlength="11"
                    />
                </el-form-item>
                <el-form-item
                    label="通知号码(2)"
                    prop="noticePhoneB"
                    :rules="{
                        validator: checkPhoneNumber, trigger: 'blur'
                    }"
                >
                    <el-input 
                        v-model.number="form.noticePhoneB"
                        :maxlength="11"
                    />
                </el-form-item>
                <el-form-item
                    label="通知号码(3)"
                    prop="noticePhoneC"
                    :rules="{
                        validator: checkPhoneNumber, trigger: 'blur'
                    }"
                >
                    <el-input 
                        v-model.number="form.noticePhoneC"
                        :maxlength="11"
                    />
                </el-form-item>
            </div>
            
        </template>
    </cc-equipForm>
</template>

<script>
    import { mapActions } from 'vuex';
    //电缆定位桩

    export default {
        name:'CablePile',
        props: {
            next:Function,
            pre:Function
        },
        data() {
            return {
                form: {
                    communicationTechnology:1,
                    positioningPileName:"",
                    assetsCode:"",
                    eui:"",
                    cablePass:"",
                    noticePhoneA:"",
                    noticePhoneB:"",
                    noticePhoneC:"",
                    concentratorLongitude:"113.952658",
                    concentratorLatitude:"22.531542",
                    positionInformation:""
                },
                channelMenus:[],
                editFlag:false
            }
        },
        mounted () {
            const { id } = JSON.parse(sessionStorage.getItem('project'));
            const { data, editFlag } = JSON.parse(sessionStorage.getItem('equipObj'));
            this.projectId = id;
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                eui: data.deviceEui,
                cablePass: data.aisleId,
                ...data
            };
            this.getCableChannelMenu(id).then(res=>{
                if(!res)return;
                this.channelMenus = res ;
            })

            if( this.editFlag ){
                this.getPhoneNumbers(data.assetsCode);
            }
        },
        methods: {
            ...mapActions('equip',[
                "getAlaramStatusOfPile"
            ]),
            ...mapActions('mini',[
                "getCableChannelMenu",
                "queryCablePilePhone"
            ]),
            //电话号码
            checkPhoneNumber(rule, value, callback, param){
                const r = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
                if(!value){
                    callback();
                }else if(typeof value !== "number"){
                    callback(new Error('号码必须是数字!'));
                }else if(`${value}`.length !== 11){
                    callback(new Error('号码长度必须为11位!'));
                }
                // else if(!r.test(value)){
                //     callback("手机号码格式有误")
                // }
                callback();

            },
            // 获取电话号码
            getPhoneNumbers(assetsCode){
                this.queryCablePilePhone(assetsCode).then(res=>{
                    if(!res) return;
                    const { noticePhoneA, noticePhoneB, noticePhoneC } = res;
                    this.form = {
                        ...this.form,
                        noticePhoneA: noticePhoneA ? +noticePhoneA : "",
                        noticePhoneB: noticePhoneB ? +noticePhoneB : "",
                        noticePhoneC: noticePhoneC ? +noticePhoneC : ""
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .phoneItems{
        display: flex;
        justify-content: space-between;
        .el-form-item{
            width: 31%;
        }
    }
</style>