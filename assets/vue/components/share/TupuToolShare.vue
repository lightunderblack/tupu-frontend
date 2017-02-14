<template>
	<i class="icon-sprite" :class="className"></i>
</template>

<script>
	export default {
		name: "TupuToolShare",

		props: {
			className: {
				type: String,
				default: "icon-share-white"
			}
		}
	};
</script>