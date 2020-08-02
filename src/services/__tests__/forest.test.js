const uuid = require("uuid");

let getTreeLocationFromS3;
let aws;
let config;

describe("Forest Service Integration Test", () => {
  describe("getTreeLocationFromS3", () => {
    let objectKey;
    let sampleObj;
    beforeEach(async () => {
      sampleObj = {
        type: "APPLE",
        lat: "4.915833",
        long: "23.823650",
      };
      objectKey = `tree${uuid.v4()}Location.json`;
      try {
        ({ getTreeLocationFromS3 } = require("../forest.service"));
        ({ aws, config } = require("../../modules"));
        await aws.s3Client
          .putObject({
            Body: JSON.stringify(sampleObj),
            Bucket: config.get("aws.s3.bucketName"),
            Key: objectKey,
          })
          .promise();
      } catch (e) {
        console.log(new Error("Failed to create object in before each"), e);
      }
    });
    test("Should succeed in getting proper tree location from bucket file", async () => {
      try {
        const data = await getTreeLocationFromS3(objectKey);
        expect(data).toMatchObject(sampleObj);
      } catch (e) {
        console.log(new Error("Failed to get object from s3"), e);
      }
    });
  });
});
