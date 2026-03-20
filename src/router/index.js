import { createRouter, createWebHistory } from 'vue-router';
import loginView from '../components/auth/loginView.vue';
import vehicleListView from '../components/vehicles/vehicleListView.vue';
import vehicleDetailView from '../components/vehicles/vehicleDetailView.vue';
import messagesView from '../components/messages/messagesView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: loginView
        },
        {
            path: '/vehicles',
            name: 'vehicles',
            component: vehicleListView
        },
        {
            path: '/vehicles/:id',
            name: 'vehicle-detail',
            component: vehicleDetailView
        },
        {
            path: '/messages',
            name: 'messages',
            component: messagesView
        }
    ]
})
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    
    // Rutas públicas que no requieren token
    const publicPages = ['login', 'vehicles', 'vehicle-detail'];
    const authRequired = !publicPages.includes(to.name);

    if (authRequired && !token) {
        next({ name: 'login' });
    } else {
        next();
    }
})

export default router;
