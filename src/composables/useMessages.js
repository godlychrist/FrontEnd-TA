import { ref } from 'vue';
import messageServices from '@/services/messageServices';
import { useRouter } from 'vue-router';



// Es como una caja de herramientas, solo voy a sacar lo que ocupo
export function useMessages() {

    const conversations = ref([]);
    const messages = ref([]);
    const activeConversation = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter(); // Solo funciona al ser llamado dentro de un componente/composable

    const loadConversations = async () => {
        loading.value = true;
        error.value = null;

        try {
            const data = await messageServices.getConversations();
            conversations.value = data;
        } catch (err) {
            error.value = "Error al cargar conversaciones";
            console.error(err);
        } finally {
            loading.value = false;
        }

    }

    const loadConversation = async (id) => {
        loading.value = true;
        error.value = null;

        try {
            const data = await messageServices.getConversation(id);
            messages.value = data;
            activeConversation.value = conversations.value.find(c => c._id === id);
        } catch (err) {
            console.error("Error al cargar la conversacion", err);
        } finally {
            loading.value = false;
        }
    };

    const createConversation = async (vehicleId, sellerId) => {
        loading.value = true;
        error.value = null;

        try {
            const data = await messageServices.createConversation(vehicleId, sellerId);
            return data;
        } catch (err) {
            console.error("Error al crear la conversacion: ", err)
        } finally {
            loading.value = false;
        }
    }

    const sendMessage = async (conversationId, message) => {
        loading.value = true;
        error.value = null;

        try {
            await messageServices.sendMessage(conversationId, message);
            await loadConversation(conversationId);
            return true;

        } catch (err) {
            console.error("Error al mandar mensaje: ", err);
            error.value = err.response?.data?.message;
        } finally {
            loading.value = false;
        }
    }

    const startChat = async (vehicleId, sellerId) => {
        const conversation = await createConversation(vehicleId, sellerId);
        if (conversation) {
            router.push({
                name: 'messages',
                query: {
                    id: conversation._id
                }
            });
        }
    }


    return {
        conversations,
        messages,
        activeConversation,
        loading,
        error,
        loadConversations,
        loadConversation,
        createConversation,
        sendMessage,
        startChat
    };
}