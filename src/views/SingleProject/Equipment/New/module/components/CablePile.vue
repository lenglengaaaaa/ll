<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item 
                :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" 
                prop="deviceEui"
                v-if="!form.isSingle"
            >
                <el-input 
                    v-model="form.deviceEui" 
                    :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                    :maxlength="form.commWay===0?15:16"
                    :disabled="editFlag"
                />
            </el-form-item>
            <!-- 1.新增电话号码短信通知 -->
            <div class="phoneItems">   
                <el-form-item
                    v-for="(phone, index) in form.phones"
                    :label="'通知号码(' + (index + 1) + ')'"
                    :key="index"
                    :prop="'phones.' + index + '.value'"
                    :rules="{
                        validator: checkPhoneNumber, trigger: 'blur'
                    }"
                >
                <!-- :rules="{
                        validator: checkPhoneNumber, trigger: 'blur'
                    }" -->
                    <el-input 
                        v-model.number="phone.value"
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
                    commWay:0,
                    isSon:1,
                    isSingle:0,
                    phones:[
                        { value: null },
                        { value: null },
                        { value: null }
                    ]
                },
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
                ...data
            };
            if(this.editFlag){
                this.getPhoneNumbers(data.deviceAdress);
            }
        },
        methods: {
            ...mapActions('equip',[
                "getAlaramStatusOfPile"
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
            getPhoneNumbers(deviceAddress){
                this.getAlaramStatusOfPile(deviceAddress).then(res=>{
                    if(!res) return;
                    const { phone } = res;

                    if( !phone ) return;
                    const phones = phone.split(";");

                    this.form.phones.forEach((item,index)=>{
                        item.value = phones[index]? +phones[index]: null;
                    })
                })
            }
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