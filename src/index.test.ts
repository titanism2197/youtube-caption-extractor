import { getVideoDetails, VideoDetails, Options } from "./index";

describe("getVideoDetails function", () => {
  let videoDetails: VideoDetails;

  beforeAll(async () => {
    const options: Options = { videoID: "U2K3y_fRR1E", lang: "ko" };
    videoDetails = await getVideoDetails(options);
  });

  test("it should return an object with the expected properties from videoDetails", () => {
    console.log("Title: ", videoDetails.title);
    console.log("Author: ", videoDetails.author);
    console.log("Description: ", videoDetails.shortDescription);
    expect(videoDetails).toHaveProperty("title");
    expect(videoDetails).toHaveProperty("videoId");
    expect(videoDetails).toHaveProperty("lengthSeconds");
    expect(videoDetails).toHaveProperty("keywords");
    expect(videoDetails).toHaveProperty("channelId");
    expect(videoDetails).toHaveProperty("shortDescription");
    expect(videoDetails).toHaveProperty("thumbnail");
    expect(videoDetails).toHaveProperty("viewCount");
    expect(videoDetails).toHaveProperty("author");
    expect(videoDetails).toHaveProperty("subtitles");
  });

  test("thumbnail should have thumbnails array", () => {
    expect(videoDetails.thumbnail).toBeDefined();
    expect(Array.isArray(videoDetails.thumbnail?.thumbnails)).toBe(true);
    if (
      videoDetails.thumbnail &&
      videoDetails.thumbnail.thumbnails.length > 0
    ) {
      console.log("First thumbnail: ", videoDetails.thumbnail.thumbnails[0]);
    }
  });

  test("subtitles should be an array", () => {
    expect(Array.isArray(videoDetails.subtitles)).toBe(true);
    if (
      Array.isArray(videoDetails.subtitles) &&
      videoDetails.subtitles.length > 0
    ) {
      console.log("First few subtitles: ", videoDetails.subtitles.slice(0, 5));
    }
  });

  // If you wish to test the parsing of keywords or any other specific properties, add tests here
  test("keywords should be an array", () => {
    expect(Array.isArray(videoDetails.keywords)).toBe(true);
    if (videoDetails.keywords && videoDetails.keywords.length > 0) {
      console.log("First keyword: ", videoDetails.keywords[0]);
    }
  });
});
