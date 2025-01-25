/**
 * SceneManager: changeScene(newSceneName)
 * 
 * - Destroy old scene
 * - Unload assets for old scene
 * - Load assets for new scene
 * - Load new scene
 * - Display a transition while changing scenes
 */

class SceneManager extends pc.EventHandler  {

    #app;
    #currentSceneName;

    constructor(app) {
        super();
        this.#app = app;    
        this.#currentSceneName = null;
        this.changeSceneInProgress = false;
    }

    changeScene(newSceneName) {
        return new Promise((resolve, reject) => {
            this.#changeScene(newSceneName, resolve);
        });
    }

    async #changeScene(newSceneName, resolve) {
        const sceneAssets = locator.instance(SceneAssets);
        const sceneTransition = locator.instance(SceneTransition);
        const currentScene = this.#app.root.findByName('Root');
        const newSceneItem = this.#app.scenes.find(newSceneName);
        
        console.log(`// Changing to scene '${newSceneName}'`);

        this.changeSceneInProgress = true;

        let complete = () => {
            this.changeSceneInProgress = false;
            resolve();
        }

        if (!newSceneItem) {
            complete();
        } else {
            await sceneTransition.start();
            currentScene.destroy();
            sceneAssets.unloadAssetsForScene(this.#currentSceneName);
            this.#currentSceneName = newSceneName;
            await sceneAssets.loadAssetsForScene(newSceneName);
            this.#app.scenes.loadSceneHierarchy(newSceneItem, (err, entity) => {                    
                this.#app.scenes.loadSceneSettings(newSceneItem, async (err) => {
                    await sceneTransition.complete();
                    complete();
                });
            });
        }
    }

}
