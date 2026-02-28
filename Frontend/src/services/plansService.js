import api from '../api/axios';

const api_url='http://localhost:8081/plans'

export async function getPlans(){
    const plans= await api.get(api_url)
    return plans.data
}