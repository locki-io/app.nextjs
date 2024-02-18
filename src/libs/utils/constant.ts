export const ITHEUM_EXPLORER_PROD_URL = "https://explorer.itheum.io";
export const ITHEUM_EXPLORER_STG_URL = "https://stg.explorer.itheum.io";
export const ITHEUM_EXPLORER_TEST_URL = "https://test.explorer.itheum.io";
export const ITHEUM_DATADEX_PROD_URL = "https://datadex.itheum.io";
export const ITHEUM_DATADEX_STG_URL = "https://stg.datadex.itheum.io";
export const ITHEUM_DATADEX_TEST_URL = "https://test.datadex.itheum.io";

export const nativeAuthOrigins = () => {
  return [ITHEUM_DATADEX_PROD_URL, ITHEUM_DATADEX_STG_URL, ITHEUM_DATADEX_TEST_URL, window.location.origin];
};