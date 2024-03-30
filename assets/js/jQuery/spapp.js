$(document).ready(function () {

    $("main#spapp > section").width($(document).width());

    var app = $.spapp({
        pageNotFound: 'error_404', templateDir: '../', reloadView: true
    });

    app.route({
        view: "login",
        load: "login.html",
    });
    app.route({
        view: "register",
        load: "register.html",
    });

    app.route({
        view: "home",
        load: "home.html",
    });


    app.run();

});