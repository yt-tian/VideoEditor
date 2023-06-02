import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from "element-plus";
// import AutomaticCrawlPage from '@/components/AutomaticCrawlPage'
import layout from '@/components/layout/index.vue';
import videoView from '@/views/video/index.vue';
import officialView from '@/views/official/index.vue';
import authView from '@/views/auth/index.vue';
import workTable from '@/views/workTable/index.vue';
import material from '@/views/workTable/video-material.vue';
import videoList from '@/views/workTable/video-list.vue';
import staging from '@/views/workTable/staging.vue';
import videoSplit from '@/views/workTable/video-split.vue';
import loginView from '@/views/auth/login.vue';
import notFindView from '@/views/404.vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: layout,
      redirect: '/home/video',
      children: [
        {
          path: 'video',
          name: 'videoPage',
          component: videoView,
        },
        {
          path: 'official',
          name: 'official',
          component: officialView,
        }
      ]
    },
    {   
      path: '/auth',
      name: 'auth',
      component: authView,
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: loginView,
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/register.vue'),
        },
        {
          path: 'forgetPwd',
          name: 'forgetPwd',
          component: () => import('@/views/auth/forgetPwd.vue'),
        }
      ]
    },
    {
      path: '/workTable',
      name: 'workTable',
      component: workTable,
      redirect: '/workTable/material',
      children: [
        {
          path: 'material',
          name: 'material',
          component: material,
        },
        {
          path:'videoList',
          name:'videoList',
          component:videoList
        },
        {
          path:'staging',
          name:'staging',
          component:staging
        },
        {
          path:'videoSplit',
          name:'videoSplit',
          component:videoSplit
        }
      ]
    },
    {
      path:'/videoSplit',
      name:'videoSplit',
      component:videoSplit
    },
    {
      path: '/404',
      name: '404',
      component: notFindView
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
});

const whiteList = ['/404'];
router.beforeEach((to, from, next) => {
  if (to.path.includes('/auth') || whiteList.includes(to.path)) {
    next()
  } else {
    // 获取 token
    const token = sessionStorage.getItem('Authorization'); 
    // token 不存在
    if (token === null || token === '') {
        ElMessage.error('您还没有登录，请先登录');
        next('/auth/login');
    } else {
        next();
    }
  }
})

export default router;