var assert = require('assert'),
    nodes = require('../lib/nodes'),
    Context = require('../lib/context').Context

describe('Context', function() {
  beforeEach(function() {
    this.parent = new Context(new nodes.Rule("body", []))
    this.context = new Context(new nodes.Rule("a", []), this.parent)
  })

  describe('selectors', function() {
    it('returns selectors', function() {
      assert.deepEqual(this.context.selectors(), ["body", "a"])
    })

    it('compiles selectors from parent contexts', function() {
      assert.deepEqual(this.context.selector(), "body a")
    })
  })

  describe('variables', function() {
    beforeEach(function() {
      this.parent.set('@parent', true)
      this.context.set('@var', true)
    })

    it('returns variable', function() {
      assert(this.context.get('@var'))
    })

    it('returns variables from parent', function() {
      assert(this.context.get('@parent'))
    })

    it('overrides variable from parents', function() {
      this.context.set('@parent', 'indeed')
      assert.equal(this.context.get('@parent'), 'indeed')
    })
  })

})
