import OverallLayout from '@/Layout/Overall'
import SideBarLayout from '@/Layout/HasSidebar'

const seniorRouter = {
    path: '/senior',
    component: OverallLayout,
    children: [
        {
            path: '',
            name: 'Senior',
            component:SideBarLayout,
            redirect: '/senior/userControl',
            children:[
                {
                    id:"14",
                    path:'userControl',
                    name:'UserControl',
                    component: () => import('@/views/Senior/User'),
                    redirect:'userControl/list',
                    meta: { 
                        title:'用户管理',
                        icon: 'user'
                    },
                    children:[
                        {
                            path:'list',
                            name:'UserList',
                            component: () => import('@/views/Senior/User/List'),
                        },
                        {
                            path:'permission',
                            name:'AccountPermission',
                            component: () => import('@/views/Senior/User/Permission'),
                            meta:{title:'用户权限分配'}
                        }
                    ]
                },
                {
                    id:"15",
                    path:'role',
                    name:'Role',
                    component: () => import('@/views/Senior/Role'),
                    redirect:'role/list',
                    meta: { 
                        title:'角色管理',
                        icon: 'jurisdiction'
                    },
                    children:[
                        {
                            path:'list',
                            name:'RoleList',
                            component: () => import('@/views/Senior/role/List'),
                        },
                        {
                            path:'permission',
                            name:'RolePermission',
                            component: () => import('@/views/Senior/role/Permission'),
                            meta:{title:'角色权限分配'}
                        }
                    ]
                },
                {
                    id:"16",
                    path:'mainLine',
                    name:'MainLine',
                    component: () => import('@/views/Senior/MainLine'),
                    redirect:'mainLine/list',
                    meta: { 
                        title:'主线缆管理',
                        icon: 'line'
                    },
                    children:[
                        {
                            path:'list',
                            name:'MainLineList',
                            component: () => import('@/views/Senior/MainLine/List'),
                        },
                        {
                            path:'newMainLine',
                            name:'NewMainLine',
                            component: () => import('@/views/Senior/MainLine/CreateEdit'),
                            meta:{title:'添加(编辑)主线缆'}
                        },
                        {
                            path:'mainLineDetail',
                            name:'MainLineDetail',
                            redirect:'mainLineDetail/list',
                            component: () => import('@/views/Senior/MainLine/Detail'),
                            meta:{title:'主线缆详情'},
                            children:[
                                {
                                    path:'list',
                                    name:'List',
                                    component: () => import('@/views/Senior/MainLine/Detail/TrapList'),
                                },
                                {
                                    path:'mainTrap',
                                    name:'MainTrap',
                                    component: () => import('@/views/SingleProject/Asset/Cover/Detail'),
                                    meta:{title:'井盖详情'}
                                },
                            ]
                        },
                        
                    ]
                },
                {
                    id:"17",
                    path:'application',
                    name:'Application',
                    component: () => import('@/views/Senior/Application'),
                    meta: { 
                        title:'应用管理',
                        icon: 'application'
                    }
                },
                {
                    id:"18",
                    path:'module',
                    name:'Module',
                    component: () => import('@/views/Senior/Module'),
                    redirect:'module/list',
                    meta: { 
                        title:'模组管理',
                        icon: 'module'
                    },
                    children:[
                        {
                            path:'list',
                            name:'ModuleList',
                            component: () => import('@/views/Senior/Module/List'),
                        },
                        {
                            path:'edit',
                            name:'ModuleEdit',
                            component: () => import('@/views/Senior/Module/Edit'),
                            meta:{title:'编辑模组'}
                        }
                    ]
                },
                {
                    id:"19",
                    path:'product',
                    name:'Product',
                    component: () => import('@/views/Senior/Product'),
                    meta: { 
                        title:'产品管理',
                        icon: 'product'
                    }
                },
                {
                    id:"20",
                    path:'system',
                    name:'System',
                    component: () => import('@/views/Senior/System'),
                    meta: { 
                        title:'系统操作管理',
                        icon: 'system'
                    }
                },
                {
                    id:"21",
                    path:'repair',
                    name:'Repair',
                    component: () => import('@/views/Senior/Repair'),
                    meta: { 
                        title:'设备修复管理',
                        icon: 'repair'
                    }
                },
            ]
        }
    ]
}

export default seniorRouter;