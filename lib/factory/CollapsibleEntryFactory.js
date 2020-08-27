'use strict';

var escapeHTML = require('../Utils').escapeHTML;


/**
 * @param  {object} options
 * @param  {string} options.id
 * @param  {string} [options.title='']
 * @param  {string} [options.description='']
 * @param  {boolean} [options.open=false]
 * @param  {Function} [options.onToggle]
 * @param  {Function} [options.onRemove]
 *
 * @return {object}
 */
function Collapsible(options) {

  var id = options.id,
      title = options.title || '',
      description = options.description || '',
      open = !!options.open || false,
      onToggle = options.onToggle || noop,
      onRemove = options.onRemove;


  var collapsibleEntry = { id: id, toggle: toggle, isOpen: isOpen };

  if (typeof onRemove === 'function') {
    collapsibleEntry.onRemove = onRemove;
  }

  function toggle(_, entryNode) {
    open = !open;
    entryNode.classList.toggle('bpp-collapsible--collapsed');
    onToggle(open);
  }

  function isOpen() {
    return open;
  }

  collapsibleEntry.html = '<div class="bpp-field-wrapper" data-action="toggle">' +
    '<span class="bpp-collapsible__icon"></span>' +
    '<label class="bpp-collapsible__title">' + escapeHTML(title) + '</label>' +
    '<label class="bpp-collapsible__description">' + escapeHTML(description) + '</label>' +
    (onRemove ? '<button class="bpp-collapsible__remove clear" data-action="onRemove" />' : '') +
  '</div>';

  collapsibleEntry.cssClasses = open ?
    [ 'bpp-collapsible' ] : [ 'bpp-collapsible', 'bpp-collapsible--collapsed' ];

  return collapsibleEntry;
}

module.exports = Collapsible;

function noop() {}
