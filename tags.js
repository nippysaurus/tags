// TODO
// add new tag
// remove existing tag
// (optional) modify existing tag

(function( $ ){

  $.fn.tags = function( options ) {

    var settings = $.extend( {
      'ul_class': 'tag-box',
      'li_class': 'tag',
      'tag_added_callback': null,
      'tag_removed_callback': null
    }, options);

    var add_tag = $.proxy(function(text, suppress_event) {

      var $text = $("<span class=\"text\">" + text + "</span>");
      var $remove = $("<span class=\"remove\" title=\"remove tag\">&times;</span>");

      var $input_tag = $(".tag-input", this);

      $element = $("<li></li>");
      $element.append($text);
      $element.append($remove);
      $element.addClass(settings.li_class);
      $element.addClass("t");

      if ($input_tag.length === 0) {
        $element.appendTo(this);
      } else {
        $element.insertBefore($input_tag[0]);
      }

      if (suppress_event !== true && settings.tag_added_callback !== null) {
        settings.tag_added_callback(text);
      }

      $remove.click(remove_event);

    }, this);

    var remove_event = function(event) {

      var $li = $(this).parent("." + settings.li_class);

      if (settings.tag_removed_callback !== null) {
        settings.tag_removed_callback($(".text", $li).text());
      }

      $li.remove();

    };

    // add the main classes to existing elements
    this.addClass(settings.ul_class);

    // convert each li element into a real tag
    $("li", this).each($.proxy(function(i, o) {
      add_tag($(o).text(), true);
      $(o).remove();
    }, this));

    // add the "new tag" element
    this.append("<li class=\"t tag-input\"><input type=\"text\"></li>");
    this.append("<li class=\"t tag-add\" title=\"add tag\"><span>+</span></li>");

    $(".tag-add").click($.proxy(function() {
      $(this).addClass("adding");
      $(".tag-input input")[0].focus();
    }, this));

    var $input = $(".tag-input input", this);

    var submit_event = $.proxy(function(event) {

      if (event.type == "keypress" && event.keyCode != 13) return;

      var text = $input.val();

      if (event.type === "blur") {
        $(this).removeClass("adding");
      }

      if (text === "") {
        return;
      }

      $input.val("");

      add_tag(text);

    }, this);

    $input.blur(submit_event);
    $input.keypress(submit_event);



    var resize = function(event) {
      var $this = $(this);

      // backspace = 8
      // delete = 46
      if (event.type == "keydown" && event.which !== 8 && event.which !== 46) return;

      var compensation = event.type == "keypress" ? 1 : -1;

      $this.css("width", (2 + ($this.val().length + compensation) * 11) + "px");

    };

    $("input").keypress(resize);
    $("input").keydown(resize);



  };
})( jQuery );

$("#tags1").tags({
  'tag_added_callback': function(tag) { console.log("added " + tag); },
  'tag_removed_callback': function(tag) { console.log("removed " + tag); }
});