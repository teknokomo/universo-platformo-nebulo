/**
 * SceneAssets:
 * - parseScenes() - create a list of assets needed by each scene. 
 * - loadAssetsForScene(sceneName)
 * - unloadAssetsForScene(sceneName)
 * 
 * Issues:
 * - unloading a font asset does not unload the generated font texture.  
 * - unloading cubemap and cubemap face textures causes issues so this has been disabled.
 */

class SceneAssets extends pc.EventHandler  {

    #app;
    #assets;
    #sceneName;

    constructor(app) {
        super();
        this.#app = app;    
        this.#assets = {};
    }

    parseScenes() {
        return new Promise((resolve, reject) => {
            const scenes = this.#app.scenes.list();
            let loaded = 0;
            scenes.forEach((sceneItem) => {
                this.#app.scenes.loadSceneData(sceneItem, (err, sceneItem) => {
                    if (err) console.log(err);
                    //console.log(sceneItem.data.name);
                    this.#sceneName = sceneItem.name;
                    this.#assets[sceneItem.name] = [];
                    this.#processItem(sceneItem.data);
                    if (++loaded == scenes.length) {
                        console.log(this.#assets);
                        resolve();
                    }
                });
            });
        });
    }

    loadAssetsForScene(sceneName) {
        return new Promise((resolve, reject) => {
            this.#loadAssetsForScene(sceneName, resolve);
        });
    }

    unloadAssetsForScene(sceneName) {
        if (sceneName) {
            const assets = this.#assets[sceneName];
            assets.forEach((asset) => {
                if (asset.type !== 'cubemap') {
                    console.log(`unloaded ${asset.name} ${asset.type}`);
                    asset.unload();
                }
            });
        }
    }

    #processItem(item) {
        const type = typeof item;

        if (type === 'object') {
            if (Array.isArray(item)) {
                for (let i = 0; i < item.length; i++) {
                    this.#processItem(item[i]);
                }
            } else {
                for (let key in item) {
                    this.#processItem(item[key]);
                }
            }
        } else if (type === 'number') {
            // Check if the number matches an asset ID in the asset registry.
            let asset = this.#app.assets.get(item);
            if (asset && !this.#assets[this.#sceneName].includes(asset)) {
                if (asset.type === "material" || 
                    asset.type === "model" || 
                    asset.type === "render" || 
                    asset.type === "sprite" || 
                    asset.type === "script") { // Добавляем обработку скриптов
                    this.#processItem(asset.data);
                }
                this.#assets[this.#sceneName].push(asset);
            }
        }
    }


    #loadAssetsForScene(sceneName, resolve) {
        const sceneTransition = locator.instance(SceneTransition);
        const assets = this.#assets[sceneName];
        let loadedAssets = 0;

        let assetLoaded = (asset) => {
            ++loadedAssets;
            sceneTransition.progress(loadedAssets, assets.length);
            console.log(`loaded ${asset.name} ${asset.type}`);
            if (loadedAssets === assets.length) {
                resolve();
            }
        }

        if (assets.length === 0) {
            resolve();
        } else {
            assets.forEach((asset) => {
                //console.log(`load ${asset.name}`);
                asset.ready(assetLoaded);            
                this.#app.assets.load(asset);
            });
        }
    }

}
