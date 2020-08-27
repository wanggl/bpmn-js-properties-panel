var domify = require('min-dom').domify;

var CollapsibleEntry = require('lib/factory/CollapsibleEntryFactory');


describe('factory/CollapsibleEntry', function() {

  describe('rendering', function() {

    it('should render', function() {

      // when
      var html = CollapsibleEntry({ title: 'title', description: 'description' }).html;

      // then
      expect(html).to.eql('<div class="bpp-field-wrapper" data-action="toggle">' +
        '<span class="bpp-collapsible__icon"/>' +
        '<label class="bpp-collapsible__title">title</label>' +
        '<label class="bpp-collapsible__description">description</label>' +
      '</div>');
    });


    it('should render remove button if callback is provided', function() {

      // when
      var html = CollapsibleEntry({ onRemove: function() {} }).html;

      // then
      expect(html).to.have.string(
        '<button class="bpp-collapsible__remove clear" data-action="onRemove" />');
    });


    it('should render correct classes', function() {

      // when
      var entryCollapsed = CollapsibleEntry({ open: false });
      var entryOpen = CollapsibleEntry({ open: true });

      // then
      expect(entryCollapsed.cssClasses).to.eql([ 'bpp-collapsible', 'bpp-collapsible--collapsed' ]);
      expect(entryOpen.cssClasses).to.eql([ 'bpp-collapsible' ]);
    });
  });


  describe('collapsing', function() {

    it('should collapse', function() {

      // given
      var entry = CollapsibleEntry({ open: true }),
          entryNode = domify(
            '<div class="bpp-collapsible">' + entry.html + '</div>');

      // when
      entry.toggle(null, entryNode);

      // then
      expect(entry.isOpen()).to.be.false;
      expect(entryNode).to.have.property('className', 'bpp-collapsible bpp-collapsible--collapsed');
    });


    it('should open', function() {

      // given
      var entry = CollapsibleEntry({ open: false }),
          entryNode = domify(
            '<div class="bpp-collapsible bpp-collapsible--collapsed">' + entry.html + '</div>');

      // when
      entry.toggle(null, entryNode);

      // then
      expect(entry.isOpen()).to.be.true;
      expect(entryNode).to.have.property('className', 'bpp-collapsible');
    });
  });



  describe('escaping', function() {

    it('should escape HTML', function() {

      // when
      var html = CollapsibleEntry({ title: '<html />', description: '<html />' }).html;

      // then
      expect(html).to.eql('<div class="bpp-field-wrapper" data-action="toggle">' +
        '<span class="bpp-collapsible__icon"/>' +
        '<label class="bpp-collapsible__title">&lt;html /&gt;</label>' +
        '<label class="bpp-collapsible__description">&lt;html /&gt;</label>' +
      '</div>');
    });
  });
});
