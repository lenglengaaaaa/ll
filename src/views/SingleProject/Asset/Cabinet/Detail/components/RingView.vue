<template>
    <div class="RING_VIEW">
        <el-row :gutter="20" >
            <el-col :span="10" :xs="24">
                <div class="view">
                    <ul class="wrap">
                        <strong>{{title}}</strong>
                        <li v-for="(item,index) in switchList" :key="item.switchId">
                            <div class="title">
                                <span 
                                    @click="selectRing(index)" 
                                    :class="highlight===index&&'active'"
                                >
                                    {{item.switchName}}
                                </span>
                            </div>
                            <ul class="list">
                                <li v-for="k in item.outLineList" :key="k.deviceId">
                                    <div class="info">
                                        <el-tooltip class="item" effect="dark" :content="`${k.deviceId}` || 'null'" placement="right">
                                            <svg class="icon" aria-hidden="true" >
                                                <use xlink:href="#icon-ring" :title="k.deviceId"></use>
                                            </svg>
                                        </el-tooltip>
                                        <span>{{(k.data&&k.data.CBTemp)||'---'}}℃</span>
                                        <span>37.0A</span>
                                        <span>有压</span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="14" :xs="24">
                <div class="chart">
                    <Tline></Tline>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import Tline from './Tline'


    export default {
        components: {
            Tline,
        },
        data() {
            return {
                title:'',
                highlight: 0,
                switchList:[]
            }
        },
        mounted () {
            const {id,name} = JSON.parse(sessionStorage.getItem('obj'));
            this.title = name ;
            this.getRingDetail(id).then(res=>{
                if(!res)return;
                this.switchList = res.switchList;
            })
        },
        methods: {
            ...mapActions('equip',[
                'getRingDetail',
            ]),
            selectRing(index) {
                this.highlight = index;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .RING_VIEW{
        height: 100%;
        .el-row{
            height: 100%;
            .el-col{
                height: 100%;
                .view{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: scroll;
                    .wrap{
                        padding: 0;
                        margin: 0;
                        position: relative;
                        max-width: 100%;
                        strong{
                            position: absolute;
                            width: 220px;
                            top: -99px;
                            left: 120px;
                            padding: 5px;
                            font-size: 0.8rem;
                            border-radius: 5px;
                            border: 4px solid black;
                        }
                        > li{
                            display: flex;
                            width: 400px;
                            height: 120px;
                            .title{
                                    width: 30%;
                                    padding: 15px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    span{
                                        font-size: 0.8rem;
                                        font-weight: bold;
                                        cursor: pointer;
                                        width: 100%;
                                        padding: 5px;
                                        display: inline-block;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                        border-radius: 5px;
                                        text-align: center;
                                    }
                                    .active{
                                        color: #fff;
                                        background-color: rgb(54, 169, 225);
                                    }
                            }
                            .list{
                                width: 70%;
                                background:url('../../../../../../assets/img/linemap.png') no-repeat ;
                                position: relative;
                                &::before{
                                        content: ' ';
                                        position: absolute;
                                        top: -60px;
                                        left: 0px;
                                        height: 100%;
                                        border-left: 4px solid #000;
                                }
                                li{
                                    font-size: 0.75rem;
                                    position: relative;
                                    height: 26.5px;
                                    .info{
                                        width: 100%;
                                        position: absolute;
                                        top: 5px;
                                        left: 90px;
                                        display: flex;
                                        align-items: center;
                                        .icon{
                                            width: 20px;
                                            height: 19px;
                                            cursor: pointer;
                                        }
                                        span{
                                            padding: 0 5px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }
</style>