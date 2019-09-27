import OverallLayout from '@/Layout/Overall'
import SideBarLayout from '@/Layout/HasSidebar'

const projectRouter = {
    path: '/project',
    component: OverallLayout,
    children: [
        {
            path: '/',
            name: 'Project',
            component: () => import('@/views/Project'),
        },
        {
            path:'',
            component:SideBarLayout,
            redirect: '/projectOverview',
            children:[
            {
                path:'projectOverview',
                name:'ProjectOverview',
                component: () => import('@/views/SingleProject/ProjectOverview'),
                meta: { 
                    title:'项目总览',
                    icon: 'overview'
                }
            },
            {
                path:'courts',
                name:'Courts',
                component: () => import('@/views/SingleProject/Asset'),
                redirect:'courts/list',
                meta: { 
                    title:'台区管理',
                    icon: 'courts'
                },
                children:[
                {
                    path:'list',
                    name:'CourtsList',
                    component: () => import('@/views/SingleProject/Asset/Courts'),
                },
                {
                    path:'newCourts',
                    name:'NewCourts',
                    component: () => import('@/views/SingleProject/Asset/Courts/CreateEdit'),
                    meta:{title:'添加(编辑)台区'}
                },
                {
                    path:'courtsDetail',
                    name:'CourtsDetail',
                    component: () => import('@/views/SingleProject/Asset/Courts/Detail'),
                    meta:{title:'台区详情'}
                },
                ]
            },
            {
                path:'room',
                name:'Room',
                component: () => import('@/views/SingleProject/Asset'),
                redirect:'room/list',
                meta: { 
                    title:'配电房管理',
                    icon: 'room'
                },
                children:[
                {
                    path:'list',
                    name:'RoomList',
                    component: () => import('@/views/SingleProject/Asset/Room'),
                },
                {
                    path:'newRoom',
                    name:'NewRoom',
                    component: () => import('@/views/SingleProject/Asset/Room/CreateEdit'),
                    meta:{title:'添加(编辑)配电房'}
                },
                {
                    path:'roomDetail',
                    name:'RoomDetail',
                    component: () => import('@/views/SingleProject/Asset/Room/Detail'),
                    meta:{title:'配单房详情'}
                },
                ]
            },
            {
                path:'cabinet',
                name:'Cabinet',
                component: () => import('@/views/SingleProject/Asset'),
                redirect:'cabinet/list',
                meta: { 
                    title:'配电柜管理',
                    icon: 'cabinet'
                },
                children:[
                {
                    path:'list',
                    name:'CabinetList',
                    component: () => import('@/views/SingleProject/Asset/Cabinet'),
                },
                {
                    path:'newCabinet',
                    name:'NewCabinet',
                    component: () => import('@/views/SingleProject/Asset/Cabinet/CreateEdit'),
                    meta:{title:'添加(编辑)配电柜'}
                },
                {
                    path:'cabinetDetail',
                    name:'CabinetDetail',
                    component: () => import('@/views/SingleProject/Asset/Cabinet/Detail'),
                    meta:{title:'配电柜详情'}
                },
                ]
            },
            {
                path:'cover',
                name:'Cover',
                component: () => import('@/views/SingleProject/Asset'),
                redirect:'cover/list',
                meta: { 
                    title:'井盖管理',
                    icon: 'trap'
                },
                children:[
                {
                    path:'list',
                    name:'CoverList',
                    component: () => import('@/views/SingleProject/Asset/Cover'),
                },
                {
                    path:'newCover',
                    name:'NewCover',
                    component: () => import('@/views/SingleProject/Asset/Cover/CreateEdit'),
                    meta:{title:'添加(编辑)井盖'}
                },
                {
                    path:'coverDetail',
                    name:'CoverDetail',
                    component: () => import('@/views/SingleProject/Asset/Cover/Detail'),
                    meta:{title:'井盖详情'}
                },
                ]
            },
            {
                path:'cable',
                name:'Cable',
                component: () => import('@/views/SingleProject/Asset'),
                redirect:'cable/list',
                meta: { 
                    title:'线缆管理',
                    icon: 'line'
                },
                children:[
                {
                    path:'list',
                    name:'CableList',
                    component: () => import('@/views/SingleProject/Asset/Cable'),
                },
                {
                    path:'newCable',
                    name:'NewCable',
                    component: () => import('@/views/SingleProject/Asset/Cable/CreateEdit'),
                    meta:{title:'添加(编辑)线缆'}
                },
                ]
            },
            {
                path:'equipment',
                name:'Equipment',
                component: () => import('@/views/SingleProject/Equipment'),
                redirect:'equipment/list',
                meta: { 
                    title:'设备管理',
                    icon: 'device'
                },
                children:[
                {
                    path:'list',
                    name:'EquList',
                    component: () => import('@/views/SingleProject/Equipment/List'),
                },
                {
                    path:'newEqu',
                    name:'NewEqu',
                    component: () => import('@/views/SingleProject/Equipment/New'),
                    meta:{title:'添加(编辑)设备'}
                },
                {
                    path:'detail',
                    name:'EquDetail',
                    component: () => import('@/components/EquipDetail'),
                    meta:{title:'设备详情'}
                },
                {
                    path:'deviceThSet',
                    name:'DeviceThSet',
                    component: () => import('@/views/SingleProject/Equipment/ThresholdSet'),
                    meta:{title:'阈值设置'}
                },
                ]
            },
            {
                path:'threshold',
                name:'Threshold',
                component: () => import('@/views/SingleProject/Threshold'),
                meta: { 
                    title:'阈值设置',
                    icon: 'threshold'
                }
            },
            {
                path:'alarm',
                name:'Alarm',
                component: () => import('@/views/SingleProject/Alarm'),
                redirect:'alarm/list',
                meta: { 
                    title:'告警管理',
                    icon: 'alarm'
                },
                children:[
                {
                    path:'list',
                    name:'AlarmList',
                    component: () => import('@/views/SingleProject/Alarm/List'),
                },
                {
                    path:'detail',
                    name:'Detail',
                    component: () => import('@/views/SingleProject/Alarm/Detail'),
                    meta:{title:'告警详情'}
                }
                ]
            },
            ]
        }
    ]
}

export default projectRouter;