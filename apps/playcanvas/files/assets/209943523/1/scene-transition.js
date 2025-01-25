class SceneTransition extends pc.EventHandler  {

    #app;
    #loadingScreen;
    #transitionComplete;
    #fadeInComplete;
    #fadeInTime;
    #fadeOutTime;

    constructor(app) {
        super();
        this.#app = app;    
        this.#loadingScreen = null;
        this.#transitionComplete = false;
        this.#fadeInComplete = false;
        this.#fadeInTime = 1.0;
        this.#fadeOutTime = 1.0;
        
        this.#createCSS();
        this.#createLoadingScreen();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.progress(0,1);
            this.#transitionComplete = false;
            this.#fadeInComplete = false;
            this.#fadeIn(resolve);
        });
    }

    complete() {
        return new Promise((resolve, reject) => {
            this.progress(1,1);
            this.#transitionComplete = true;

            if ( this.#fadeInComplete ) {
                this.#fadeOut();
            }
            resolve();
        });
    }

    progress(item, total) {
        //console.log('sceneTransition:progress ' + item + ' / ' + total); 
        let bar = document.getElementById('scene-loading-progress-bar');
        let value;
        if (bar) {
            value = ((item * 1.0) / (total * 1.0)) * 100 + '%';
            //console.log('value: ' + value);        
            bar.style.width = value;
        }
    }

    #fadeIn(resolve) {
        let opacity = {value:0.0};
        this.#loadingScreen.style.opacity = opacity.value;
        this.#loadingScreen.style.display = 'block';
        
        this.#app
        .tween(opacity)
        .to({value:1.0}, this.#fadeInTime, pc.SineInOut)
        .onUpdate(() => {
            this.#loadingScreen.style.opacity = opacity.value;
        })
        .onComplete(() => {
            this.#fadeInComplete = true;
            resolve();
            if (this.#transitionComplete) {
                this.#fadeOut();
            }
        })
        .start();
    }

    #fadeOut() {
        let opacity = {value:1.0};
        this.#loadingScreen.style.opacity = opacity.value;
        this.#loadingScreen.style.display = 'block';
        
        this.#app
        .tween(opacity)
        .to({value:0.0}, this.#fadeOutTime, pc.SineInOut)
        .onUpdate(() => {
            this.#loadingScreen.style.opacity = opacity.value;
        })
        .onComplete(() => {
            this.#loadingScreen.style.display = 'none';
        })
        .start();
    }

    #createLoadingScreen() {
        this.#loadingScreen = document.createElement('div');
        this.#loadingScreen.id = 'scene-loading-wrapper';
        document.body.appendChild(this.#loadingScreen);

        const splash = document.createElement('div');
        splash.id = 'scene-loading-splash';
        this.#loadingScreen.appendChild(splash);

        const container = document.createElement('div');
        container.id = 'scene-loading-progress-bar-container';
        splash.appendChild(container);

        const bar = document.createElement('div');
        bar.id = 'scene-loading-progress-bar';
        container.appendChild(bar);
    }

    #createCSS() {
        
        const css = [
            'body {',
            '    background-color: #000000;',
            '}',

            '#scene-loading-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #000000;',
            '    opacity:0.0;',
            '    display:none;',
            '}',
            
            '#scene-loading-splash {',
            '    position: absolute;',
            '    top: calc(50% - 28px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '}',
            
            '#scene-loading-progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #1d292c;',
            '}',

            '#scene-loading-progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #ff332c;',
            '}'

        ].join("\n");

        const style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } 
        else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    }

}
