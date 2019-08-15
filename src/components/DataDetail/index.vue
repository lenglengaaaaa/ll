<template>
    <div class="EQUIP_CONTAINER">
        <div class="magic"> 
            <div class="title">
                <span>魔节环境数据</span>
                <el-select v-model="magicId" @change="changeMagic" v-if="magicList.length">
                    <el-option
                        v-for="item in magicList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
                <el-divider></el-divider>
                <p>
                    <span>数据上传时间 :&nbsp;</span>
                    <strong>{{magicData.createTime || "---"}}</strong>
                </p>
            </div>
            <div class="content">
                <div class="wrap">
                    <Magic
                        :magicData="magicData.data"
                    />
                </div>
            </div>
        </div>
        <div class="line" v-if="hasLine">
            <div class="title">
                <span>线缆温度传感器</span>
                <el-divider></el-divider>
                <p>
                    <span>数据上传时间: </span>
                    <strong>2019-07-04 14:42:20</strong>
                </p>
                <div class="content">
                    <div class="wrap">
                        <Tline></Tline>
                    </div>
                </div>
            </div>
        </div>
        <div class="lone">
            <div class="title">
                <span>独立传感器</span>
                <el-divider></el-divider>
            </div>
            <div class="content">
                <div class="wrap"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import Magic from './components/Magic'
    import Tline from './components/Tline'
    import { mapActions } from 'vuex'

    const magicParam = ['temp','hum','o2','h2s','co','ch4','o3','bat'];

    export default {
        components: {
            Magic,
            Tline
        },
        props: {
            assetType: Number,
            hasLine:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                magicList:[],
                magicId:'',
                params:{
                    trapId:null,
                    roomId:null,
                    chestId:null,
                    deviceType:30
                },
                magicData:{},
                lineData:{}
            }
        },
        created () {
            this.classifyType(this.assetType)
            this.getMagicList();
        }, 
        computed: {
            assetObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            }
        },
        methods: {
            ...mapActions('equip',[
                'getEquipMenu',
                'getCurrentMagicData',
                'getTrapLineHistory' 
            ]),
            //获取资产下魔节列表
            getMagicList(){
                const {id} = this.assetObj;
                this.getEquipMenu(this.params).then(res=>{
                    if(!res)return;
                    this.magicList = res;
                    if(res.length){
                        this.magicId = res[0].id;
                        this.getMagicData( res[0].id);
                    }
                })
            },
            //获取魔节数据
            getMagicData(queryId){
                const {id} = this.assetObj;
                this.getCurrentMagicData({
                    queryId,
                    assetId:id,
                    assetType:this.assetType
                }).then(res=>{
                    if(!res){
                        this.magicData = {};
                        return
                    }
                    this.magicData= {
                        data:this.filterMagicData(res),
                        createTime:res.createTime&&this.$moment(res.createTime).format('YYYY-MM-DD HH:mm:ss')
                    };
                })
            },
            //切换魔节回调
            changeMagic(val){
                this.getMagicData(val);
            },
            //筛选魔节数据
            filterMagicData(res){
                let obj = {};
                for(let i in res){
                    if(magicParam.includes(i)){
                        obj[i] = res[i];
                    }
                }
                return obj;
            },
            classifyType(type){
                const {id} = this.assetObj; 
                switch (type) {
                    //配电柜
                    case 0:
                        return this.params.chestId = id;
                    //配电房
                    case 1:
                        return this.params.roomId = id;
                    //井盖 2
                    default:
                        return this.params.trapId = id;
                }
            },
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .EQUIP_CONTAINER{
            .seletGroup{
                flex-direction: column;
                align-items: stretch !important;
                .el-form{
                    flex-direction: column;
                }
            }
        }
    }

    .EQUIP_CONTAINER{
        position: relative;
        // width: 90%;
        // margin: 0 auto;
        .title{
            padding: 10px 0 10px 0;
            >span{
                font-size: 1.2rem;
                font-weight: bold;
                padding: 0 10px;
                border: 0 solid #e4e6eb;
                border-left-width: 5px;
                border-radius: 5px;
                border-left-color: #36a9e1;
            }
            .el-divider--horizontal{
                margin: 10px 0;
            }
            p{
                margin:15px 0;
                display: flex;
                align-items: center;
                span,strong{
                    font-size: 15px;
                }
            }
        }
        .content{
            display: flex;
            justify-content: center;
            .wrap{
                width: 95%;
                background: #fff;
                padding: 20px;
                border-radius: 5px;
                .seletGroup{
                    padding-bottom: 20px;
                    display: flex;
                    // justify-content: space-between;
                    align-items: center;
                    .el-form{
                        width: 100%;
                        display: flex;
                        .el-form-item{
                            padding: 0 10px;
                        }
                    }
                    .icon{
                        margin: 20px 0 0 10px;
                        i{
                            cursor: pointer;
                            background: #ecefef;
                            padding: 5px;
                            border-radius: 5px;
                        }
                    }
                }
            }
        }
    }
</style>