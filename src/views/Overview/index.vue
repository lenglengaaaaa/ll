<template>
    <div class="Overview_container">
        <div class="title_bar">
            <span>
                欢迎使用E+view物联网云平台
            </span>
        </div>
        <div class="body">
            <CountRow :rows="rows" />
            <ChartRow />
            <MapRow />
        </div>
    </div>
</template>

<script>
    import {CountRow,ChartRow} from '@/components/Row'
    import MapRow from './components/MapRow'

    export default {
        components:{
            CountRow,
            ChartRow,
            MapRow
        },
        data() {
            return {
                rows: [
                    {
                        name:'网关',
                        icon:'#icon-natNATwangguan',
                        path:'/gateway',
                        total:5,
                        has:4
                    },
                    {
                        name:"项目",
                        icon:'#icon-yingyong',
                        path:'/project',
                        total:1,
                        has:1,
                    },
                    {
                        name:'设备',
                        icon:'#icon-huabanfuben',
                        path:'/project',
                        total:4,
                        has:2
                    }
                ],
            }
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 768px) {
        .Overview_container{
            padding: 0px !important;
            .body{
                padding: 0 20px;
            }
        }
        
    }
    .Overview_container{
        padding:10px 1vw;
        height: calc(100% - 20px);
        overflow: scroll;
        .title_bar{
            background: #fff;
            padding: 15px 15px;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            span{
                font-size: 17px;
                font-weight: 300;
                color: #4abced;
            }
        }
    }
</style>