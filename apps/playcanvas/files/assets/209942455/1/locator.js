class Locator extends pc.EventHandler  {

    #registered;
    #app;

    constructor(app) {
        super();
        this.#app = app;
        this.#registered = {};

        this.#register(SceneAssets,'Singleton');
        this.#register(SceneManager,'Singleton');
        this.#register(SceneTransition,'Singleton');

        //this.#register(MyClass, 'Factory');
    }

    #register(aClass, type) {
        this.#registered[aClass.name] = {name:aClass.name, aClass:aClass, type:type, instance: null};
    }

    instance(aClass, p1, p2, p3) {
        let registration = this.#registered[aClass.name];
        let instance = null;
        if (registration !== undefined) {
            if (registration.type === 'Factory') {
                instance = new aClass(this.#app, p1, p2, p3);
            }
            else if (registration.type === 'Singleton') {
                if (registration.instance) {
                    instance = registration.instance;
                }
                else {
                    instance = new aClass(this.#app, p1, p2, p3);
                    registration.instance = instance;
                }
            }
        }
        return instance;
    }
}
