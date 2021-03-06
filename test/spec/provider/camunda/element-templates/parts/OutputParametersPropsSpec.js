'use strict';

var TestHelper = require('../../../../../TestHelper');

/* global inject */

var findExtension = require('lib/provider/camunda/element-templates/Helper').findExtension,
    findOutputParameter = require('lib/provider/camunda/element-templates/Helper').findOutputParameter;

var entrySelect = require('./Helper').entrySelect,
    selectAndGet = require('./Helper').selectAndGet,
    bootstrap = require('./Helper').bootstrap;


describe('element-templates/parts - Collapsible Output Parameters', function() {

  var diagramXML = require('./OutputParametersProps.bpmn'),
      elementTemplates = require('./OutputParametersProps.json');

  beforeEach(bootstrap(diagramXML, elementTemplates));

  it('should display label as title', inject(function() {

    // given
    selectAndGet('SimpleTask');

    // when
    var collapsibleTitle = entrySelect(
      'template-outputs-my.domain.SimpleWorkerTask-0-collapsible',
      '.bpp-collapsible__title'
    );

    // then
    expect(collapsibleTitle).to.exist;
    expect(collapsibleTitle.innerText).to.equal('resultStatus');
  }));


  it('should display description', inject(function() {

    // given
    selectAndGet('SimpleTask');

    // when
    var descriptionField = entrySelect(
      'template-outputs-my.domain.SimpleWorkerTask-1-description',
      '.description__text'
    );

    // then
    expect(descriptionField).to.exist;
    expect(descriptionField.innerText).to.equal('foo bar');
  }));


  it('should display value', inject(function() {

    // given
    selectAndGet('SimpleTask');

    // when
    var parameterValueField = entrySelect(
      'template-outputs-my.domain.SimpleWorkerTask-0-variableName',
      'input'
    );

    // then
    expect(parameterValueField).to.exist;
    expect(parameterValueField.value).to.equal('resultStatus');
  }));


  describe('should update parameter value', function() {
    var task;

    beforeEach(inject(function() {

      // given
      task = selectAndGet('SimpleTask');

      var collapsibleTitle = entrySelect(
            'template-outputs-my.domain.SimpleWorkerTask-0-collapsible',
            '.bpp-collapsible__title'
          ),
          parameterValueField = entrySelect(
            'template-outputs-my.domain.SimpleWorkerTask-0-variableName',
            'input'
          );

      // assure item is collapsed
      TestHelper.triggerEvent(collapsibleTitle, 'click');

      // when
      TestHelper.triggerValue(parameterValueField, 'bar', 'change');
    }));

    it('should execute', function() {

      // then
      var inputOutput = findExtension(task, 'camunda:InputOutput'),
          outputParameter = findOutputParameter(inputOutput, { source: '${resultStatus}' });

      expect(outputParameter.name).to.equal('bar');
    });


    it('should undo', inject(function(commandStack) {

      // when
      commandStack.undo();

      var inputOutput = findExtension(task, 'camunda:InputOutput'),
          outputParameter = findOutputParameter(inputOutput, { source: '${resultStatus}' });

      // then
      expect(outputParameter.name).to.equal('resultStatus');
    }));


    it('should redo', inject(function(commandStack) {

      // when
      commandStack.undo();
      commandStack.redo();

      var inputOutput = findExtension(task, 'camunda:InputOutput'),
          outputParameter = findOutputParameter(inputOutput, { source: '${resultStatus}' });

      // then
      expect(outputParameter.name).to.equal('bar');
    }));

  });


  describe('validation', function() {

    function expectError(entry, message) {
      var errorElement = entrySelect(entry, '.bpp-error-message');

      var error = errorElement && errorElement.textContent;

      expect(error).to.eql(message);
    }

    function expectValid(entry) {
      expectError(entry, null);
    }

    function changeInput(collapsible, variableName, newValue) {
      var collapsibleTitle = entrySelect(collapsible, '.bpp-collapsible__title'),
          input = entrySelect(variableName, 'input');

      // assure item is collapsed
      TestHelper.triggerEvent(collapsibleTitle, 'click');

      TestHelper.triggerValue(input, newValue, 'change');
    }

    it('should validate empty name', inject(function() {

      // given
      selectAndGet('SimpleTask');

      var collapsibleEntryId = 'template-outputs-my.domain.SimpleWorkerTask-2-collapsible',
          variableNameEntryId = 'template-outputs-my.domain.SimpleWorkerTask-2-variableName';

      // assume
      expectError(variableNameEntryId, 'Process Variable Name must not be empty.');

      // when
      changeInput(collapsibleEntryId, variableNameEntryId, 'foo');

      // then
      expectValid(variableNameEntryId);
    }));


    it('should validate spaces', inject(function() {

      // given
      selectAndGet('SimpleTask');

      var collapsibleEntryId = 'template-outputs-my.domain.SimpleWorkerTask-3-collapsible',
          variableNameEntryId = 'template-outputs-my.domain.SimpleWorkerTask-3-variableName';

      // assume
      expectError(variableNameEntryId, 'Process Variable Name must not contain spaces.');

      // when
      changeInput(collapsibleEntryId, variableNameEntryId, 'foo');

      // then
      expectValid(variableNameEntryId);
    }));

  });

});
