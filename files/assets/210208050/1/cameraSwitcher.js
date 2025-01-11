class CameraSwitcher extends pc.ScriptType {
    initialize() {
        // Найти кнопку
        this.buttonEntity = this.app.root.findByName('Button');
        if (this.buttonEntity && this.buttonEntity.button) {
            this.buttonEntity.button.on('click', this.loadNextScene, this);
        } else {
            console.error('Сущность с именем "Button" не найдена или не имеет компонента Button.');
        }
    }

    async loadNextScene() {
        const nextSceneName = 'Space';
        console.log(`Переход к сцене: ${nextSceneName}`);
        
        // Получить SceneManager из Locator
        const sceneManager = locator.instance(SceneManager);

        if (!sceneManager) {
            console.error('SceneManager не инициализирован. Проверьте глобальные менеджеры.');
            return;
        }

        try {
            // Выполнить переход на новую сцену
            await sceneManager.changeScene(nextSceneName);
            console.log(`Сцена ${nextSceneName} успешно загружена.`);
        } catch (err) {
            console.error('Ошибка при переходе на сцену:', err);
        }
    }
}

// Регистрация скрипта
pc.registerScript(CameraSwitcher, 'cameraSwitcher');
