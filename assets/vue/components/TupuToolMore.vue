<template>
	<i class="icon-sprite" :class="className"></i>
</template>

<script>
	export default {
		name: "TupuToolMore",

		props: {
			className: {
				type: String,
				default: "icon-more-white"
			}
		}
	};
</script>