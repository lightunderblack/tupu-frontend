<template>
	<i class="icon-sprite icon-top-word-gray-40" :class="className"></i>
</template>

<script>
	export default {
		name: "TupuToolTop",

		props: {
			className: {
				type: String
			}
		}
	};
</script>