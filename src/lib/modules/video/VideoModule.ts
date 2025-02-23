import type IExoModule from '../../IExoModule.js';
import VideoBlock from './VideoBlock.svelte';
import MdBlock from './VideoBlock.svelte';
import type { VideoData } from './VideoData.js';

export default class VideoModule implements IExoModule<VideoData> {
	type = 'video';
	container = false;
	component = VideoBlock;
	name = 'Video';
	icon = '<i class="fa-solid fa-v"></i>';
	default_value = () => '';
}
