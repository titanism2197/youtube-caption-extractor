"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubtitles = exports.getVideoDetails = void 0;
const he_1 = __importDefault(require("he"));
const striptags_1 = __importDefault(require("striptags"));
const getVideoDetails = async ({ videoID, lang = "en", }) => {
    const response = await fetch(`https://youtube.com/watch?v=${videoID}`);
    const data = await response.text();
    // Attempt to find the ytInitialPlayerResponse object within the script tag
    const ytInitialPlayerResponseMatch = data.match(/var ytInitialPlayerResponse = ({.*?});<\/script>/s);
    // Initialize an object to hold the parsed video details
    let parsedVideoDetails = {};
    if (ytInitialPlayerResponseMatch) {
        // Extract the JSON-like string
        const ytInitialPlayerResponseStr = ytInitialPlayerResponseMatch[1];
        try {
            // Parse the string to a JavaScript object
            const ytInitialPlayerResponseObj = JSON.parse(ytInitialPlayerResponseStr);
            // Access the videoDetails key
            parsedVideoDetails = ytInitialPlayerResponseObj.videoDetails;
        }
        catch (error) {
            console.error("Failed to parse ytInitialPlayerResponse:", error);
        }
    }
    else {
        console.warn("ytInitialPlayerResponse object not found in the page data.");
    }
    // Check if the video page contains captions
    if (!data.includes("captionTracks")) {
        console.warn(`No captions found for video: ${videoID}`);
        return {
            ...parsedVideoDetails,
            subtitles: [],
        };
    }
    // Extract caption tracks JSON string from video page data
    const regex = /"captionTracks":(\[.*?\])/;
    const regexResult = regex.exec(data);
    if (!regexResult) {
        console.warn(`Failed to extract captionTracks from video: ${videoID}`);
        return {
            ...parsedVideoDetails,
            subtitles: [],
        };
    }
    const [_, captionTracksJson] = regexResult;
    const captionTracks = JSON.parse(captionTracksJson);
    // Find the appropriate subtitle language track
    const subtitle = captionTracks.find((track) => track.vssId === `.${lang}`) ||
        captionTracks.find((track) => track.vssId === `a.${lang}`) ||
        captionTracks.find((track) => track.vssId && track.vssId.match(`.${lang}`));
    // Check if the subtitle language track exists
    if (!(subtitle === null || subtitle === void 0 ? void 0 : subtitle.baseUrl)) {
        console.warn(`Could not find ${lang} captions for ${videoID}`);
        return {
            ...parsedVideoDetails,
            subtitles: [],
        };
    }
    // Fetch subtitles XML from the subtitle track URL
    const subtitlesResponse = await fetch(subtitle.baseUrl);
    const transcript = await subtitlesResponse.text();
    // Define regex patterns for extracting start and duration times
    const startRegex = /start="([\d.]+)"/;
    const durRegex = /dur="([\d.]+)"/;
    // Process the subtitles XML to create an array of subtitle objects
    const lines = transcript
        .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', "")
        .replace("</transcript>", "")
        .split("</text>")
        .filter((line) => line && line.trim())
        .reduce((acc, line) => {
        // Extract start and duration times using regex patterns
        const startResult = startRegex.exec(line);
        const durResult = durRegex.exec(line);
        if (!startResult || !durResult) {
            console.warn(`Failed to extract start or duration from line: ${line}`);
            return acc;
        }
        const [, start] = startResult;
        const [, dur] = durResult;
        // Clean up subtitle text by removing HTML tags and decoding HTML entities
        const htmlText = line
            .replace(/<text.+>/, "")
            .replace(/&amp;/gi, "&")
            .replace(/<\/?[^>]+(>|$)/g, "");
        const decodedText = he_1.default.decode(htmlText);
        const text = (0, striptags_1.default)(decodedText);
        // Create a subtitle object with start, duration, and text properties
        acc.push({
            start,
            dur,
            text,
        });
        return acc;
    }, []);
    return {
        ...parsedVideoDetails,
        subtitles: lines,
    };
};
exports.getVideoDetails = getVideoDetails;
const getSubtitles = async ({ videoID, lang = "en", }) => {
    // Fetch YouTube video page data
    const response = await fetch(`https://youtube.com/watch?v=${videoID}`);
    const data = await response.text();
    // Check if the video page contains captions
    if (!data.includes("captionTracks")) {
        console.warn(`No captions found for video: ${videoID}`);
        return [];
    }
    // Extract caption tracks JSON string from video page data
    const regex = /"captionTracks":(\[.*?\])/;
    const regexResult = regex.exec(data);
    if (!regexResult) {
        console.warn(`Failed to extract captionTracks from video: ${videoID}`);
        return [];
    }
    const [_, captionTracksJson] = regexResult;
    const captionTracks = JSON.parse(captionTracksJson);
    // Find the appropriate subtitle language track
    const subtitle = captionTracks.find((track) => track.vssId === `.${lang}`) ||
        captionTracks.find((track) => track.vssId === `a.${lang}`) ||
        captionTracks.find((track) => track.vssId && track.vssId.match(`.${lang}`));
    // Check if the subtitle language track exists
    if (!(subtitle === null || subtitle === void 0 ? void 0 : subtitle.baseUrl)) {
        console.warn(`Could not find ${lang} captions for ${videoID}`);
        return [];
    }
    // Fetch subtitles XML from the subtitle track URL
    const subtitlesResponse = await fetch(subtitle.baseUrl);
    const transcript = await subtitlesResponse.text();
    // Define regex patterns for extracting start and duration times
    const startRegex = /start="([\d.]+)"/;
    const durRegex = /dur="([\d.]+)"/;
    // Process the subtitles XML to create an array of subtitle objects
    const lines = transcript
        .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', "")
        .replace("</transcript>", "")
        .split("</text>")
        .filter((line) => line && line.trim())
        .reduce((acc, line) => {
        // Extract start and duration times using regex patterns
        const startResult = startRegex.exec(line);
        const durResult = durRegex.exec(line);
        if (!startResult || !durResult) {
            console.warn(`Failed to extract start or duration from line: ${line}`);
            return acc;
        }
        const [, start] = startResult;
        const [, dur] = durResult;
        // Clean up subtitle text by removing HTML tags and decoding HTML entities
        const htmlText = line
            .replace(/<text.+>/, "")
            .replace(/&amp;/gi, "&")
            .replace(/<\/?[^>]+(>|$)/g, "");
        const decodedText = he_1.default.decode(htmlText);
        const text = (0, striptags_1.default)(decodedText);
        // Create a subtitle object with start, duration, and text properties
        acc.push({
            start,
            dur,
            text,
        });
        return acc;
    }, []);
    return lines;
};
exports.getSubtitles = getSubtitles;
