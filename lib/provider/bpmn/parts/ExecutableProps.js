'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var entryFactory = require('../../../factory/EntryFactory');

var participantHelper = require('../../../helper/ParticipantHelper');

module.exports = function(group, element, translate) {

  var bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  if (is(element, 'bpmn:Process') || (is(element, 'bpmn:Participant') && bo.get('processRef'))) {

    var executableEntry = entryFactory.checkbox({
      id: 'process-is-executable',
      label: translate('Executable'),
      modelProperty: 'isExecutable'
    });

    // in participants we have to change the default behavior of set and get
    if (is(element, 'bpmn:Participant')) {
      executableEntry.get = function(element) {
        return participantHelper.getProcessBusinessObject(element, 'isExecutable');
      };

      executableEntry.set = function(element, values) {
        return participantHelper.modifyProcessBusinessObject(element, 'isExecutable', values);
      };
    }

    group.entries.push(executableEntry);

    addCollapsibleEntries(group.entries);
  }

};

function addCollapsibleEntries(entries) {
  var Collapsible = require('../../../factory/CollapsibleEntryFactory');
  var EntryFactory = require('../../../factory/EntryFactory');

  var collapsibleOpen = Collapsible({
    id: 'collapsibleOpen',
    title: 'realllly long title',
    description: 'so many words so many wordsso many wordsso many wordsso many wordsso many wordsso many wordsso many words'
  });
  var textEntry1 = EntryFactory.textField({ id: 'textEntry1', modelProperty: 'nope', hidden: negation(collapsibleOpen.isOpen) });


  var collapsibleOpenRemovable = Collapsible({
    id: 'collapsibleOpenRemovable',
    title: 'realllly long title',
    description: 'so many words so many wordsso many wordsso many wordsso many wordsso many wordsso many wordsso many words',
    open: true,
    onRemove: function() {}
  });
  var textEntry2 = EntryFactory.textField({ id: 'textEntry2', modelProperty: 'nope', hidden: negation(collapsibleOpenRemovable.isOpen) });

  entries.push(
    collapsibleOpen,
    textEntry1,
    collapsibleOpenRemovable,
    textEntry2
  );
}

function negation(fn) {
  return function() { return !fn(); };
}
