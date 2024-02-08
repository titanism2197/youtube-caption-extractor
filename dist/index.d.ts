interface Subtitle {
    start: string;
    dur: string;
    text: string;
}
export interface Options {
    videoID: string;
    lang?: string;
}
interface VideoThumbnail {
    url: string;
    width: number;
    height: number;
}
export interface VideoDetails {
    videoId?: string;
    title?: string;
    lengthSeconds?: string;
    keywords?: string[];
    channelId?: string;
    isOwnerViewing?: boolean;
    shortDescription?: string;
    isCrawlable?: boolean;
    thumbnail?: {
        thumbnails: VideoThumbnail[];
    };
    allowRatings?: boolean;
    viewCount?: string;
    author?: string;
    isPrivate?: boolean;
    isUnpluggedCorpus?: boolean;
    isLiveContent?: boolean;
    subtitles?: Subtitle[];
}
export declare const getVideoDetails: ({ videoID, lang, }: Options) => Promise<VideoDetails>;
export declare const getSubtitles: ({ videoID, lang, }: Options) => Promise<Subtitle[]>;
export {};
