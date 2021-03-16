$(function() {
    $(".ModeS").click(function() {
        $(".singleMode").show("slow");
        $(".multiMode").hide();
    });
    $(".ModeM").click(function() {
        $(".multiMode").show("slow");
        $(".singleMode").hide();
    });
    $(".join").click(function() {
        $(".id").show("slow");
        $("#join").show("slow");
        $(".new").hide();
        $(".join").hide();
    });
    $("#pause").click(function() {
        $(".pause1").show();
    });
    $("#continue").click(function() {
        $(".pause1").hide();
    });
    $("#exit").click(function() {
        $(".issure").show();
    });
    $("#continue").click(function() {
        $(".issure").hide();
    });
});


function Sound(src, doc) {
    this.sound = doc.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    doc.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    }

    this.stop = function() {
        this.sound.pause();
    }

}