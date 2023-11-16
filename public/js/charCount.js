$(document).ready(function () {
  // Initialize the auto-resize textareas
  $(".auto-resize").on("input click touchstart ", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Update the character count for all textareas with the class "charCount"
  $(".charCount").on("input", function () {
    var $textarea = $(this);
    var $charCountDisplay = $textarea.next().find(".charCountDisplay");
    var text = $textarea.val();
    var maxLength = $textarea.attr("maxlength");

    if (text.length > maxLength) {
      $textarea.val(text.substring(0, maxLength));
      $charCountDisplay.text(maxLength);
    } else {
      $charCountDisplay.text(text.length);
    }
  });
});
