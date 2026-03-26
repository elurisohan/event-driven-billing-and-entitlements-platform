import api from "../api/axios"

export async function createCheckoutSession(priceId) {
    const response = await api.post('/billing/checkout-session', { priceId });
    return response.data.checkoutUrl;
}