<template>
    <div class="Overview_container">
        <div class="title_bar">
            <span>
                欢迎使用E+view物联网云平台
            </span>
        </div>
        <div class="body">
            <CountRow :rows="rows" :width="screenWidth"></CountRow>
            <ChartRow :width="screenWidth"></ChartRow>
        </div>
    </div>
</template>

<script>
    import CountRow from '@/components/CountRow'
    import ChartRow from './components/ChartRow'


    export default {
        components:{
            CountRow,
            ChartRow
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
                        name:"应用",
                        icon:'#icon-yingyong',
                        path:'/application',
                        total:1,
                        has:1,
                    },
                    {
                        name:'设备',
                        icon:'#icon-huabanfuben',
                        path:'/application',
                        total:4,
                        has:2
                    }
                ],
                screenWidth:0
            }
        },
        mounted(){
            this.screenWidth = document.body.clientWidth;
            window.addEventListener('resize', ()=>{
                this.screenWidth = document.body.clientWidth;
            });
        },
        beforeDestroy () {
            window.removeEventListener('resize');
        },
        methods: {

        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 796px) {
        .body{
            padding: 0px 20px;
        }
    }
    .Overview_container{
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
        .body{
        }
    }
</style>