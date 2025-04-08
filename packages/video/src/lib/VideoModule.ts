import type { IExoModule } from '@exomatique_editor/base';
import VideoBlock from './VideoBlock.svelte';

export interface VideoData {
	link: string;
}

export default class VideoModule implements IExoModule<VideoData> {
	type = 'video';
	container = false;
	component = VideoBlock;
	name = 'Video';
	icon = '<i class="fa-solid fa-v"></i>';
	default_value = () => ({ link: '' });
}
