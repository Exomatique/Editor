<script lang="ts">
	import type ExoInstance from '../../ExoInstance';
	import type { VideoData } from './VideoData';
	import 'vidstack/bundle';
	import 'vidstack/icons';

	let {
		data = $bindable(),
		onchange,
		edition,
		instance,
		id,
		index
	}: {
		data: VideoData;
		onchange: (v: string) => void;
		edition: boolean;
		instance: ExoInstance;
		id: string;
		index: number;
	} = $props();

	$effect(() => {
		if (edition)
			(document.getElementById(id)?.getElementsByClassName('editable')[0] as any).focus();
	});
</script>

<div class="relative my-5 flex flex-1 flex-col items-center" tabindex="-1">
	{#if edition}
		<div class="flex flex-row items-center gap-2">
			Paste your video link here :
			<div
				class="editable prose lg:prose-xl min-h-5 w-full flex-1 border-none text-blue-400 outline-none"
				contenteditable
				bind:innerText={data}
			></div>
		</div>
	{/if}

	<div class="relative w-3/4">
		<media-player class="min-h-20" src={data} crossOrigin playsInline>
			<media-provider>
				<media-poster
					class="absolute inset-0 block h-full w-full rounded-md bg-black opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
					alt="Poster"
				></media-poster>
			</media-provider>
			<media-audio-layout></media-audio-layout>
			<media-video-layout></media-video-layout>
		</media-player>
	</div>
</div>
