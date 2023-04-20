import { router } from '@/router'

export function useBreadCrumbs() {
	const route = useRoute()
	const cookie = useCookies()

	const activeTab = ref(route.path)
	const tabList = ref([
		{
			title: '仪表盘',
			path: '/'
		}
	])

	// 添加标签导航
	function addTab(tab) {
		let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
		if (noTab) {
			tabList.value.push(tab)
		}

		cookie.set('tabList', tabList.value)
	}

	// 初始化标签导航列表
	function initTabList() {
		let tbs = cookie.get('tabList')
		if (tbs) {
			tabList.value = tbs
		}
	}

	initTabList()

	onBeforeRouteUpdate(to => {
		activeTab.value = to.path
		addTab({
			title: to.meta.title,
			path: to.path
		})
	})

	const changeTab = t => {
		activeTab.value = t
		router.push(t)
	}

	const removeTab = t => {
		let tabs = tabList.value
		let a = activeTab.value
		if (a == t) {
			tabs.forEach((tab, index) => {
				if (tab.path == t) {
					const nextTab = tabs[index + 1] || tabs[index - 1]
					if (nextTab) {
						a = nextTab.path
					}
				}
			})
		}

		activeTab.value = a
		tabList.value = tabList.value.filter(tab => tab.path != t)

		cookie.set('tabList', tabList.value)
	}

	const handleClose = c => {
		if (c == 'clearAll') {
			// 切换回仪表盘页面
			activeTab.value = '/'
			// 过滤只剩下仪表盘页面
			tabList.value = [
				{
					title: '仪表盘',
					path: '/'
				}
			]
		} else if (c == 'clearOther') {
			// 过滤只剩下仪表盘页和当前激活
			tabList.value = tabList.value.filter(tab => tab.path == '/' || tab.path == activeTab.value)
		}
		cookie.set('tabList', tabList.value)
	}

	return {
		activeTab,
		tabList,
		changeTab,
		removeTab,
		handleClose
	}
}
