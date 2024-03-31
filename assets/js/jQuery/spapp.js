$(document).ready(function () {

    $("main#spapp > section").width($(document).width());

    var app = $.spapp({
        // defaultView  : "home",
        // pageNotFound: 'error_404', 
        templateDir: './tpl/', 
        reloadView: true
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

    app.route({
        view: "stocklist",
        load: "stocklist.html",
    });

    app.route({
        view: "fav",
        load: "fav.html",
    });

    app.route({
        view: "account",
        load: "account.html",
    });


    app.run();

});