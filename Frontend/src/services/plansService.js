import axios from 'axios';

const plansUrl = import.meta.env.VITE_PLANS_URL ?? 'http://localhost:8081/plans';

export async function getPlans(){
    const plans = await axios.get(plansUrl);
    return plans.data;
}