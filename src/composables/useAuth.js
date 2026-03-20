import { ref, reactive } from 'vue';
import authService from '@/services/authServices.js';
import router from '@/router';

export function useAuth() {
    const error = ref(null);
    const isLoading = ref(false);
    const isLogin = ref(true);

    const form = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
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
                // Validación de contraseña corta en el cliente
                if (form.password.length < 6) {
                    error.value = "La contraseña debe tener al menos 6 dígitos";
                    isLoading.value = false;
                    return;
                }

                await authService.register({
                    username: form.username,
                    password: form.password,
                    password_confirmation: form.confirmPassword
                });
                alert("¡Registrado!");
                isLogin.value = true;
                form.username = '';
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
    return { form, isLogin, isLoading, error, toggleAuthMode, handleSubmit, handleLogout };
}
