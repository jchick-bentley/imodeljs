/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import * as faker from "faker";
import {
  createRandomECInstanceKeyJSON, createRandomECClassInfoJSON, createRandomDescriptorJSON,
  createRandomDescriptor,
} from "../_helpers/random";
import { Content, ContentJSON } from "../../content/Content";
import { Item } from "../../content/Item";

describe("Content", () => {

  describe("constructor", () => {

    it("creates a new instance", () => {
      const descriptor = createRandomDescriptor();
      const contentSet = new Array<Item>();
      const content = new Content(descriptor, contentSet);
      expect(content.descriptor).to.eq(descriptor);
      expect(content.contentSet).to.eq(contentSet);
    });

  });

  describe("fromJSON", () => {

    let testContentJSON!: ContentJSON;
    beforeEach(() => {
      testContentJSON = {
        descriptor: createRandomDescriptorJSON(),
        contentSet: [{
          classInfo: createRandomECClassInfoJSON(),
          primaryKeys: [createRandomECInstanceKeyJSON()],
          label: faker.random.words(),
          imageId: faker.random.uuid(),
          mergedFieldNames: [],
          values: {
            test: faker.random.number(),
          },
          displayValues: {
            test: faker.random.words(),
          },
        }],
      };
    });

    it("creates valid Content from valid JSON", () => {
      const content = Content.fromJSON(testContentJSON);
      expect(content).to.matchSnapshot();
    });

    it("creates valid Content from valid serialized JSON", () => {
      const content = Content.fromJSON(JSON.stringify(testContentJSON));
      expect(content).to.matchSnapshot();
    });

    it("returns undefined for undefined JSON", () => {
      const content = Content.fromJSON(undefined);
      expect(content).to.be.undefined;
    });

    it("returns undefined if content has undefined descriptor", () => {
      const json = { ...testContentJSON, descriptor: undefined } as any;
      const content = Content.fromJSON(json);
      expect(content).to.be.undefined;
    });

    it("skips undefined items in content set", () => {
      const json = { ...testContentJSON, contentSet: [...testContentJSON.contentSet, undefined] } as any;
      const content = Content.fromJSON(json);
      expect(content!.contentSet.length).to.eq(1);
    });

  });

});
