pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // Create the wrapper container
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // Create the splash container
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);

        // Create the progress bar container
        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        // Create the progress bar element
        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);
    };

    var hideSplash = function () {
        // Remove the splash screen
        var splash = document.getElementById('application-splash-wrapper');
        if (splash) {
            splash.parentElement.removeChild(splash);
        }
    };

    var setProgress = function (value) {
        // Update the progress bar width based on the loading progress
        var bar = document.getElementById('progress-bar');
        if (bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = (value * 100) + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    margin: 0;',
            '    padding: 0;',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    background-image: url("https://playcanvas.com/api/assets/209180986/file/loading-screen.jpg");',
            '    background-size: cover;',
            '    background-position: center;',
            '    background-repeat: no-repeat;',
            '}',
            '',
            '#progress-bar-container {',
            '    position: absolute;',
            '    bottom: 20px;',
            '    left: 50%;',
            '    transform: translateX(-50%);',
            '    width: 50%;',
            '    height: 4px;',
            '    background-color: #1d292c;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #f60;',
            '}'
        ].join('\n');

        // Inject the CSS into the document
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    // Initialization
    createCss();
    showSplash();

    // Loading events
    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});