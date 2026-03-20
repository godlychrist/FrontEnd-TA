import { ref, reactive, computed } from 'vue';
import vehicleService from '@/services/vehicleService';
import { useRouter } from 'vue-router';

const isModalOpen = ref(false);
const vehicles = ref([]);
const loading = ref(false);
const error = ref(null);

// 1. EL ID TIENE QUE EXISTIR AQUÍ DESDE EL PRINCIPIO
const form = reactive({
    id: null,
    model: '',
    brand: '',
    year: '2024',
    price: '',
    status: 'available',
    image: null
});

// Paginación compartida de Cris
const pagination = reactive({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 8
});

// Filtros compartidos de Cris
const filters = reactive({
    search: '',
    brand: '',
    status: '',
    year_min: '',
    year_max: '',
    price_range: ''
});

export function useVehicles() {

    const resetForm = () => {
        form.id = null; // 2. LIMPIAR EL ID AQUÍ TAMBIÉN
        form.model = '';
        form.brand = '';
        form.year = '2024';
        form.price = '';
        form.status = 'available';
        form.image = null;
    };

    const resetFilters = () => {
        filters.search = '';
        filters.brand = '';
        filters.status = '';
        filters.year_min = '';
        filters.year_max = '';
        filters.price_range = '';
    }

    const openModal = (vehicle = null) => {
        // DEBUG: Esto nos dirá qué está llegando cuando le das al botón Editar
        console.log("VEHÍCULO RECIBIDO EN OPEN MODAL:", vehicle);

        if (vehicle) {
            // 3. CAPTURAR EL ID (Cubrimos todas las opciones posibles)
            form.id = vehicle.id || vehicle._id || vehicle.ID;

            form.model = vehicle.model;
            form.brand = vehicle.brand;
            form.year = vehicle.year;
            form.price = vehicle.price;
            form.status = vehicle.status;
            form.image = vehicle.image;
        } else {
            resetForm();
        }
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        resetForm();
    };

    const handleCreateVehicle = async () => {
        loading.value = true;
        error.value = null;
        try {
            const formData = new FormData();
            formData.append('brand', form.brand);
            formData.append('model', form.model);
            formData.append('year', form.year);
            formData.append('price', form.price);
            formData.append('status', form.status);

            if (form.image) {
                formData.append('image', form.image);
            }

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user._id || user.id || user.ID;
                if (userId) {
                    formData.append('user_id', userId);
                }
            }

            await vehicleService.create(formData);
            await getVehicles();
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || "Error al crear el vehículo";
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const getVehicles = async (page = 1) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await vehicleService.getAll(filters, page);
            // Laravel regresa un objeto con data, current_page, etc.
            pagination.current_page = data.current_page;
            pagination.total = data.total;
            pagination.last_page = data.last_page;
            vehicles.value = data.data;
        } catch (err) {
            error.value = "Error al cargar los vehículos";
            vehicles.value = [];
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    const imageUrl = (image) => {
        if (!image) return '';
        if (image.startsWith('http')) return image;
        return `http://127.0.0.1:8000/storage/${image}`;
    }

    const updateVehicle = async (id) => {
        loading.value = true;
        try {
            const formData = new FormData();
            formData.append('brand', form.brand);
            formData.append('model', form.model);
            formData.append('year', form.year);
            formData.append('price', form.price);
            formData.append('status', form.status);

            // 1. Agregamos el user_id 
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user._id || user.id || user.ID;
                if (userId) {
                    formData.append('user_id', userId);
                }
            }

            // TRUCO PARA LARAVEL (Spoofing)
            formData.append('_method', 'PUT');

            if (form.image && typeof form.image !== 'string') {
                formData.append('image', form.image);
            }

            await vehicleService.update(id, formData);
            await getVehicles(); // Recargar la lista automáticamente
            return true;
        } catch (err) {
            console.error("Error al editar:", err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const handleDeleteVehicle = async (id) => {
        loading.value = true;
        try {
            await vehicleService.remove(id);
            await getVehicles(); // Recargar la lista automáticamente
            return true;
        } catch (err) {
            console.error("Error al eliminar:", err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const updateVehicleStatus = async (id, newStatus) => {
        loading.value = true;
        try {
            await vehicleService.update(id, { status: newStatus });
            await getVehicles(); // Refrescar lista
            return true;
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const getVehicleById = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            return await vehicleService.getById(id);
        } catch (err) {
            error.value = "Error al cargar el vehículo";
            console.error(err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const brands = computed(() => {
        const allBrands = vehicles.value.map(v => v.brand);
        return [...new Set(allBrands)];
    });

    // --- UTILIDADES GLOBALES ---
    const router = useRouter();

    const currentUserData = computed(() => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    });

    const currentUserId = computed(() => {
        return currentUserData.value ? (currentUserData.value._id || currentUserData.value.id || currentUserData.value.ID) : null;
    });

    const isAuthenticated = computed(() => !!localStorage.getItem('token'));

    const currentUserName = computed(() => {
        return currentUserData.value ? (currentUserData.value.username || currentUserData.value.name) : 'Usuario';
    });

    const checkIsOwner = (vehicleUserId) => {
        return Boolean(currentUserId.value && vehicleUserId && String(currentUserId.value) === String(vehicleUserId));
    };

    const formatPrice = (price, useCurrency = false) => {
        if (useCurrency) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
        }
        return new Intl.NumberFormat('en-US').format(price);
    };

    const showCopiedMessage = ref(false);

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            showCopiedMessage.value = true;
            setTimeout(() => { showCopiedMessage.value = false; }, 2000);
        }).catch(err => console.error('Error al copiar:', err));
    };

    const requireLoginForMessages = () => {
        if (!isAuthenticated.value) {
            alert("Debes iniciar sesión para hacer preguntas al vendedor.");
            router.push('/login');
            return false;
        }
        router.push('/messages');
        return true;
    };

    return {
        isModalOpen,
        vehicles,
        loading,
        error,
        form,
        filters,
        brands,
        pagination,
        isAuthenticated,
        currentUserName,
        showCopiedMessage,
        openModal,
        closeModal,
        handleCreateVehicle,
        getVehicles,
        imageUrl,
        updateVehicle,
        handleDeleteVehicle,
        updateVehicleStatus,
        getVehicleById,
        resetFilters,
        checkIsOwner,
        formatPrice,
        copyToClipboard,
        requireLoginForMessages
    };
}