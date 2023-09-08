import ValueTypes from "@typeful/types/ValueTypes";
import { describe, expect, it } from "vitest";
import Model, { ModelContext } from "./Model";

const modelCtx: ModelContext = {
  types: new ValueTypes(),
}

describe("Model", () => {
  const model = new Model({
    meta: {
      name: 'auth.signIn',
    },
    schema: {
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          'x-ui': {
            prefix: '@',
          },
        },
        password: {
          type: 'string', mode: 'password',
        },
      },
    }
  }, modelCtx)

  describe('locates individual fields', () => {
    it('userName', () => {
      expect(model.locate().field(['userName'])).to.deep.equal({
        name: 'userName',
        path: ['userName'],
        schema: {type: "string"},
        ui: {prefix: '@'},
        modelMeta: model.spec.meta,
      })
    })
    it('password', () => {
      expect(model.locate().field(['password'])).to.deep.equal({
        name: 'password',
        path: ['password'],
        schema: {type: "string", mode: 'password'},
        modelMeta: model.spec.meta,
      })
    })
  })

  it ('locates field with ui options', () => {
    expect(model.locate().field({
      path: ['password'],
      ui: {
        mode: 'otp',
        length: 6,
      },
    })).to.deep.equal({
      name: 'password',
      path: ['password'],
      schema: {type: "string", mode: 'password'},
      ui: { mode: 'otp', length: 6 },
      modelMeta: model.spec.meta,
    })
  })
  it ('locates field, merging ui options with schema', () => {
    expect(model.locate().field({
      path: ['userName'],
      ui: {
        suffix: '@mastod.on',
      },
    }))
      .to.deep.equal({
        name: 'userName',
        path: ['userName'],
        schema: {type: 'string'},
        ui: {prefix: '@', suffix: '@mastod.on'},
        modelMeta: model.spec.meta,
      })
  })

  it("locates all fields", () => {
    const fieldNames = model.locate().fields('all')
      .map((ref) => ref.name)
    expect(fieldNames).to.deep.equal([
      'userName',
      'password',
    ])
  })

  it ("handles field not found", () => {
    expect(model.locate().field(['theUltimateAnswerToTheGreatQuestionOfLifeTheUniverseAndEverything']))
      .to.deep.equal({
        name: false, path: ['theUltimateAnswerToTheGreatQuestionOfLifeTheUniverseAndEverything'],
      })
  })
})
