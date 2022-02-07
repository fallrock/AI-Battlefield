module.exports = {

    id: function() {
        ///TODO: proper id generation
        const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 16; ++i)
            result += characterSet.charAt(Math.floor(Math.random()*characterSet.length));
        return result;
    },

    coinPoint: function(gameState) {
        return this.randomPoint(gameState);
    },

    spawnPoint: function(gameState) {
        return this.randomPoint(gameState);
    },

    randomPoint: function(gameState) {
        return {
            x: Math.floor(Math.random() * gameState.map.w),
            y: Math.floor(Math.random() * gameState.map.h),
        };
    },

};
