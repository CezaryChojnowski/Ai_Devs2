export default interface ImageUrlContent {
    type: string;
    image_url: {
      url: string;
      [key: string]: any;
    };
  }