<template>
    <div class="empty" >
        <div>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <span>{{text}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name:'cc-empty',
        props: {
            text: {
                type: String,
                default: '暂无数据'
            },
        },
    }
</script>

<style lang="scss" scoped>
    .empty{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        div{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .icon{
                width: 10rem;
                margin-bottom: -30px;
            }
            span{
                font-weight: bold;
                font-size: 0.9rem;
            }
        }
    }
</style>