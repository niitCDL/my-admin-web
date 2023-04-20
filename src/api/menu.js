import axios from '@/request'

export function getNav() {
	return axios.get('/sys/menu/nav')
}
