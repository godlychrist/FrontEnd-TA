import { ref, reactive, onMounted, watch } from 'vue';
import authService from '@/services/authServices.js';
import router from '@/router';
import { useRoute } from 'vue-router';

export function useAuth() {
    const error = ref(null);
    const isLoading = ref(false);
    const isLogin = ref(true);

    const form = reactive({
        cedula: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });

    const route = useRoute();
    const legalName = ref('');

    // --- RADAR DE CÉDULA (Autocompletar) ---
    watch(() => form.cedula, async (newCedula) => {
        if (newCedula && newCedula.length >= 9) {
            try {
                const response = await authService.checkCedula(newCedula);
                if (response.nombre) {
                    legalName.value = response.nombre;
                }
            } catch (err) {
                legalName.value = '';
            }
        } else {
            legalName.value = '';
        }
    });

    onMounted(() => {
        // 1. CASO LOGIN EXITOSO: Google nos manda el token por URL
        const token = route.query.token;
        const username = route.query.username;
        const id = route.query.id;

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username, id }));
            localStorage.setItem('userId', id);
            router.push('/vehicles');
        }

        // 2. CASO USUARIO NUEVO: Google nos manda email y nombre para REGISTRO
        if (route.query.is_google === 'true') {
            isLogin.value = false; // Cambiamos a modo Registro
            form.email = route.query.google_email || '';
            form.username = (route.query.google_name || '').replace(/\s+/g, '').toLowerCase(); // Usuario sugerido
            // Dejamos la cédula vacía (REQUERIMIENTO: Pedirla al usuario)
        }
    });

    const toggleAuthMode = () => {
        isLogin.value = !isLogin.value;
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        error.value = null; // Limpiar errores previos
        try {
            if (isLogin.value) {
                const response = await authService.login(form);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('userId', response.user.id);
                    router.push('/vehicles');
                }

            } else {
                if (form.password.length < 6) {
                    error.value = "La contraseña debe tener al menos 6 dígitos";
                    isLoading.value = false;
                    return;
                }

                await authService.register({
                    cedula: form.cedula,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.confirmPassword
                });
                alert("¡Te enviamos un correo para activar tu cuenta!");
                isLogin.value = true;
                // Limpiar campos
                form.cedula = '';
                form.username = '';
                form.email = '';
                form.password = '';
                form.confirmPassword = '';
            }
        } catch (err) {
            // Extraer el mensaje de error del backend si existe
            if (err.response && err.response.data && err.response.data.error) {
                error.value = err.response.data.error;
            } else if (err.response && err.response.data && err.response.data.message) {
                error.value = err.response.data.message;
            } else {
                error.value = "Credenciales incorrectas o error de conexión";
            }

            // Limpiar campos para que el usuario reintente
            form.password = '';
            // Si quieres limpiar también el username opcionalmente:
            // form.username = ''; 
        } finally {
            isLoading.value = false;
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }

    const initGoogleLogin = async () => {
        try {
            const response = await authService.getGoogleUrl();
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (err) {
            error.value = "Error al redireccionar a Google";
        }
    };

    return { form, isLogin, isLoading, error, legalName, toggleAuthMode, handleSubmit, handleLogout, initGoogleLogin };
}
