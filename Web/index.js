$(document).ready(function(){
    //Slider
    $(this).on('input change', '#salaryRange', function() {
        var x = $(this).val();
        $("#salaryValue").html(x.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")); 
    });
  
    //Tabs in index.html
    $("#pills-occupation-tab").click(function(){
        $('#pills-occupation-tab').tab('show');
    });

    $("#pills-rich-tab").click(function(){
        $('#pills-rich-tab').tab('show');
    });

    //Dyanamic footer
    var docHeight = $(window).height();
    var footerHeight = $('#footer').outerHeight();
    var footerTop = $('#footer').position().top + footerHeight;

    if (footerTop < docHeight) {
    $('#footer').css('margin-top', (docHeight - footerTop) + 'px');
    }
});